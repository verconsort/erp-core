const { Router } = require('express');
const OrgModel = require('./org.model');

module.exports = (db) => {
  const router = Router();
  const orgModel = new OrgModel(db);

  // 1. 获取所有部门列表
  router.get('/departments', async (req, res, next) => {
    try {
      const result = await db.query('SELECT * FROM org_departments WHERE status = $1 ORDER BY created_at ASC;', ['ACTIVE']);
      res.json({ success: true, data: result.rows });
    } catch (err) {
      next(err);
    }
  });

  // 2. 创建部门
  router.post('/departments', async (req, res, next) => {
    try {
      const { id, name, parentId } = req.body;
      const result = await db.query(
        'INSERT INTO org_departments (id, name, parent_id) VALUES ($1, $2, $3) RETURNING *;',
        [id || `DEPT${Date.now()}`, name, parentId || null]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  });

  // 3. 获取所有员工/操作员列表
  router.get('/employees', async (req, res, next) => {
    try {
      const { dept } = req.query;
      let employees;
      if (dept) {
        employees = await orgModel.findByDepartment(dept);
      } else {
        const result = await db.query('SELECT * FROM employees WHERE status = $1 ORDER BY created_at DESC;', ['ACTIVE']);
        employees = result.rows;
      }
      res.json({ success: true, data: employees });
    } catch (err) {
      next(err);
    }
  });

  // 4. 新增员工/操作员档案
  router.post('/employees', async (req, res, next) => {
    try {
      const newEmployee = await orgModel.create(req.body);
      res.status(201).json({ success: true, data: newEmployee });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
