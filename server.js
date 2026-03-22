const app = require('./src/app');
const env = require('./src/config/env');
const migrate = require('./src/database/scripts/migrate');
const seed = require('./src/database/scripts/seed');

if (require.main === module) {
  migrate()
    .then(() => seed())
    .then(() => {
      app.listen(env.port, () => {
        console.log(`Azani ISP System running at http://localhost:${env.port}`);
      });
    })
    .catch((err) => {
      console.error('Startup failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
