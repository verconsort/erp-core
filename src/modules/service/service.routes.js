const { Router } = require('express');
const ServiceModel = require('./service.model');

module.exports = (db) => {
  const router = Router();
  const serviceModel = new ServiceModel(db);

  // 获取所有服务/费项档案列表
  router.get('/', async (req, res, next) => {
    try {
      const { category, q } = req.query;
      let services;
      if (q) {
        services = await serviceModel.searchByName(q);
      } else if (category) {
        services = await serviceModel.findByCategory(category.toUpperCase());
      } else {
        const result = await db.query('SELECT * FROM services WHERE status = $1 ORDER BY created_at ASC;', ['ACTIVE']);
        services = result.rows;
      }
      res.json({ success: true, data: services });
    } catch (err) {
      next(err);
    }
  });

  // 根据ID获取特定服务/费项详情
  router.get('/:id', async (req, res, next) => {
    try {
      const service = await serviceModel.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: '未找到对应的服务或费项档案' });
      }
      res.json({ success: true, data: service });
    } catch (err) {
      next(err);
    }
  });

  // 新增服务/费项档案
  router.post('/', async (req, res, next) => {
    try {
      const newService = await serviceModel.create(req.body);
      res.status(201).json({ success: true, data: newService });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
