const BaseModel = require('../../shared/base.model');

class OrgModel extends BaseModel {
  constructor(db) {
    super(db, 'employees'); // 默认主表操作员工，也可灵活操作部门
  }

  // 根据工号查询员工
  async findByCode(code) {
    const queryText = `SELECT * FROM employees WHERE code = $1 AND status = 'ACTIVE' LIMIT 1;`;
    const result = await this.db.query(queryText, [code]);
    return result.rows[0] || null;
  }

  // 获取指定部门下的所有在职员工
  async findByDepartment(departmentId) {
    const queryText = `SELECT * FROM employees WHERE department_id = $1 AND status = 'ACTIVE' ORDER BY created_at DESC;`;
    const result = await this.db.query(queryText, [departmentId]);
    return result.rows;
  }
}

module.exports = OrgModel;
