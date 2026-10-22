const BaseModel = require('../../shared/base.model');

class FundModel extends BaseModel {
  constructor(db) {
    super(db, 'fund_accounts');
  }

  // 资金“进出库”核心逻辑：更新账户余额并记录交易流水
  async recordTransaction({ accountId, direction, amount, category, relatedBillId, partnerId, remark }) {
    const client = await this.db.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. 锁行查询当前钱库余额
      const accRes = await client.query(
        'SELECT * FROM fund_accounts WHERE id = $1 FOR UPDATE;',
        [accountId]
      );
      const account = accRes.rows[0];
      if (!account) {
        throw new Error('指定的资金账户不存在');
      }

      const numericAmount = parseFloat(amount);
      const currentBalance = parseFloat(account.balance);
      let newBalance = currentBalance;

      if (direction === 'IN') {
        newBalance += numericAmount;
      } else if (direction === 'OUT') {
        newBalance -= numericAmount;
      } else {
        throw new Error('无效的资金变动方向，必须为 IN 或 OUT');
      }

      // 2. 更新钱库实时余额
      await client.query(
        'UPDATE fund_accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;',
        [newBalance, accountId]
      );

      // 3. 写入资金变动流水
      const txId = `TX${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const txRes = await client.query(
        `INSERT INTO fund_transactions 
         (id, account_id, direction, amount, balance_after, category, related_bill_id, partner_id, remark)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
        [txId, accountId, direction, numericAmount, newBalance, category, relatedBillId, partnerId, remark]
      );

      await client.query('COMMIT');
      return { account: { ...account, balance: newBalance }, transaction: txRes.rows[0] };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // 查询某个“钱库”的明细流水
  async getTransactionsByAccount(accountId, limit = 50) {
    const queryText = `
      SELECT * FROM fund_transactions 
      WHERE account_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2;
    `;
    const result = await this.db.query(queryText, [accountId, limit]);
    return result.rows;
  }
}

module.exports = FundModel;
