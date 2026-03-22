const app = require('./src/app');
const env = require('./src/config/env');
const migrate = require('./src/database/scripts/migrate');
const seed = require('./src/database/scripts/seed');

if (require.main === module) {
  const server = app.listen(env.port, () => {
    console.log(`Azani ISP System running at http://localhost:${env.port}`);
  });

  migrate()
    .then(() => seed())
    .then(() => console.log('Database ready.'))
    .catch((err) => console.error('DB init error:', err.message));
}

module.exports = app;
