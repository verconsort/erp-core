const { Router } = require('express');
const FundModel = require('./fund.model');

module.exports = (db) => {
  const router = Router();
  const fundModel = new FundModel(db);

  // 1. 获取所有资金账户（钱库）列表及其实时余额
  router.get('/accounts', async (req, res, next) => {
    try {
      const result = await db.query('SELECT * FROM fund_accounts WHERE status = $1 ORDER BY created_at ASC;', ['ACTIVE']);
      res.json({ success: true, data: result.rows });
    } catch (err) {
      next(err);
    }
  });

  // 2. 创建新的资金账户（钱库）
  router.post('/accounts', async (req, res, next) => {
    try {
      const newAccount = await fundModel.create(req.body);
      res.status(201).json({ success: true, data: newAccount });
    } catch (err) {
      next(err);
    }
  });

  // 3. 资金进出库记账（收支/出入库流水）
  router.post('/transactions', async (req, res, next) => {
    try {
      const { accountId, direction, amount, category, relatedBillId, partnerId, remark } = req.body;
      const result = await fundModel.recordTransaction({
        accountId,
        direction,
        amount,
        category,
        relatedBillId,
        partnerId,
        remark
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  });

  // 4. 获取指定钱库的变动流水
  router.get('/accounts/:id/transactions', async (req, res, next) => {
    try {
      const transactions = await fundModel.getTransactionsByAccount(req.params.id);
      res.json({ success: true, data: transactions });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
