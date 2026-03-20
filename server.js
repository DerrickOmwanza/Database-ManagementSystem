const app = require('./src/app');
const env = require('./src/config/env');

if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`Azani ISP System running at http://localhost:${env.port}`);
  });
}

module.exports = app;
