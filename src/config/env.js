require('dotenv').config();

function parseDbConfig() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (url) {
    const u = new URL(url);
    return {
      host: u.hostname,
      user: u.username,
      password: u.password,
      database: u.pathname.replace('/', ''),
      port: Number(u.port || 3306),
    };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'azani_isp',
    port: Number(process.env.DB_PORT || 3306),
  };
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  sessionSecret: process.env.SESSION_SECRET || 'azani-isp-secret',
  db: parseDbConfig(),
};
