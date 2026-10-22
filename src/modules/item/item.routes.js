const { Router } = require('express');
const ItemModel = require('./item.model');

module.exports = (db) => {
  const router = Router();
  const itemModel = new ItemModel(db);

  // 获取所有商品/物料列表
  router.get('/', async (req, res, next) => {
    try {
      const { type } = req.query;
      let items;
      if (type) {
        items = await itemModel.findByType(type.toUpperCase());
      } else {
        const result = await db.query('SELECT * FROM items WHERE status = $1 ORDER BY created_at DESC;', ['ACTIVE']);
        items = result.rows;
      }
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  });

  // 根据条码查询商品
  router.get('/barcode/:barcode', async (req, res, next) => {
    try {
      const item = await itemModel.findByBarcode(req.params.barcode);
      if (!item) {
        return res.status(404).json({ success: false, message: '未找到对应条码的物料或成品' });
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  });

  // 新增物料或成品
  router.post('/', async (req, res, next) => {
    try {
      const newItem = await itemModel.create(req.body);
      res.status(201).json({ success: true, data: newItem });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
