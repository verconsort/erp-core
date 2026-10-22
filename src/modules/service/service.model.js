const BaseModel = require('../../shared/base.model');

class ServiceModel extends BaseModel {
  constructor(db) {
    super(db, 'services');
  }

  // 按类别查询费项/服务 (如: RENT, UTILITY, FEE)
  async findByCategory(category) {
    const queryText = `SELECT * FROM ${this.tableName} WHERE category = $1 AND status = 'ACTIVE' ORDER BY created_at DESC;`;
    const result = await this.db.query(queryText, [category]);
    return result.rows;
  }

  // 按名称模糊搜索
  async searchByName(keyword) {
    const queryText = `SELECT * FROM ${this.tableName} WHERE name ILIKE $1 AND status = 'ACTIVE' ORDER BY created_at DESC;`;
    const result = await this.db.query(queryText, [`%${keyword}%`]);
    return result.rows;
  }
}

module.exports = ServiceModel;
