const { Router } = require('express');
const WarehouseModel = require('./warehouse.model');

module.exports = (db) => {
  const router = Router();
  const warehouseModel = new WarehouseModel(db);

  router.get('/', async (req, res, next) => {
    try {
      const { type } = req.query;
      let warehouses = type ? await warehouseModel.findByType(type.toUpperCase()) : (await db.query('SELECT * FROM warehouses WHERE status = $1 ORDER BY created_at ASC;', ['ACTIVE'])).rows;
      res.json({ success: true, data: warehouses });
    } catch (err) { next(err); }
  });

  router.post('/', async (req, res, next) => {
    try {
      const newWh = await warehouseModel.create(req.body);
      res.status(201).json({ success: true, data: newWh });
    } catch (err) { next(err); }
  });

  return router;
};
