const fs = require('fs');
const path = require('path');

function loadModules(app, db) {
  const modulesDir = path.join(__dirname, '../modules');
  if (!fs.existsSync(modulesDir)) return;

  const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const moduleName = entry.name;
      const moduleRoutePath = path.join(modulesDir, moduleName, `${moduleName}.routes.js`);
      
      if (fs.existsSync(moduleRoutePath)) {
        try {
          const moduleRouter = require(moduleRoutePath);
          app.use(`/api/v1/${moduleName}`, moduleRouter(db));
          console.log(`[Kernel Loader] Successfully loaded module: ${moduleName}`);
        } catch (err) {
          console.error(`[Kernel Loader] Failed to load module [${moduleName}]:`, err.message);
        }
      }
    }
  }
}

module.exports = { loadModules };
