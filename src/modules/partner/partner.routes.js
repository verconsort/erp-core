const { Router } = require('express');
const PartnerModel = require('./partner.model');

module.exports = (db) => {
  const router = Router();
  const partnerModel = new PartnerModel(db);

  // 获取所有客商列表（支持按 type 过滤：customer / supplier）
  router.get('/', async (req, res, next) => {
    try {
      const { type, q } = req.query;
      let partners;
      
      if (q) {
        partners = await partnerModel.searchByName(q);
      } else if (type) {
        partners = await partnerModel.findByType(type.toUpperCase());
      } else {
        const result = await db.query('SELECT * FROM partners WHERE status = $1 ORDER BY created_at DESC;', ['ACTIVE']);
        partners = result.rows;
      }
      
      res.json({ success: true, data: partners });
    } catch (err) {
      next(err);
    }
  });

  // 根据 ID 获取单个客商详情
  router.get('/:id', async (req, res, next) => {
    try {
      const partner = await partnerModel.findById(req.params.id);
      if (!partner) {
        return res.status(404).json({ success: false, message: '未找到对应的客商档案' });
      }
      res.json({ success: true, data: partner });
    } catch (err) {
      next(err);
    }
  });

  // 新增客商档案
  router.post('/', async (req, res, next) => {
    try {
      const newPartner = await partnerModel.create(req.body);
      res.status(201).json({ success: true, data: newPartner });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
