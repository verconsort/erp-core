const BaseModel = require('../../shared/base.model');

class WarehouseModel extends BaseModel {
  constructor(db) {
    super(db, 'warehouses');
  }

  async findByType(type) {
    const result = await this.db.query(`SELECT * FROM ${this.tableName} WHERE type = $1 AND status = 'ACTIVE' ORDER BY created_at DESC;`, [type]);
    return result.rows;
  }
}

module.exports = WarehouseModel;
