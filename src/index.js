const express = require('express');
const db = require('./core/database');
const { loadModules } = require('./core/loader');
const errorHandler = require('./core/error.handler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'UP', kernel: 'erp-core', timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ status: 'DOWN', error: err.message });
  }
});

loadModules(app, db);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[erp-core Kernel] Micro-kernel successfully booted on port ${PORT}`);
});
