const BaseModel = require('../../shared/base.model');

class PartnerModel extends BaseModel {
  constructor(db) {
    super(db, 'partners');
  }

  // 按客商类型查询 ('CUSTOMER' 客户 / 'SUPPLIER' 供应商 / 'BOTH' 往来户)
  async findByType(type) {
    const queryText = `SELECT * FROM ${this.tableName} WHERE (type = $1 OR type = 'BOTH') AND status = 'ACTIVE' ORDER BY created_at DESC;`;
    const result = await this.db.query(queryText, [type]);
    return result.rows;
  }

  // 按名称模糊搜索客商（高频查阅场景）
  async searchByName(keyword) {
    const queryText = `SELECT * FROM ${this.tableName} WHERE name ILIKE $1 AND status = 'ACTIVE' ORDER BY created_at DESC;`;
    const result = await this.db.query(queryText, [`%${keyword}%`]);
    return result.rows;
  }
}

module.exports = PartnerModel;
