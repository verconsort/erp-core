const BaseModel = require('../../shared/base.model');

class ItemModel extends BaseModel {
  constructor(db) {
    super(db, 'items');
  }

  // 按条码查询（超市/批发高频场景）
  async findByBarcode(barcode) {
    const queryText = `SELECT * FROM ${this.tableName} WHERE barcode = $1 AND status = 'ACTIVE' LIMIT 1;`;
    const result = await this.db.query(queryText, [barcode]);
    return result.rows[0] || null;
  }

  // 按类型区分查询 ('MATERIAL' 物料 / 'FINISHED' 成品)
  async findByType(type) {
    const queryText = `SELECT * FROM ${this.tableName} WHERE type = $1 AND status = 'ACTIVE' ORDER BY created_at DESC;`;
    const result = await this.db.query(queryText, [type]);
    return result.rows;
  }
}

module.exports = ItemModel;
