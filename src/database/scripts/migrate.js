const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const env = require('../../config/env');
const { executeSqlFile } = require('../runSqlBatch');

async function main() {
  // When MYSQL_URL is set (Railway), the DB is pre-created — skip CREATE DATABASE
  const useUrl = !!(process.env.MYSQL_URL || process.env.DATABASE_URL);

  if (!useUrl) {
    const rootConnection = await mysql.createConnection({
      host: env.db.host,
      user: env.db.user,
      password: env.db.password,
      port: env.db.port,
    });
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await rootConnection.end();
  }

  const connection = await mysql.createConnection({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    port: env.db.port,
    database: env.db.database,
  });

  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationFiles) {
    await executeSqlFile(connection, path.join(migrationsDir, file));
    console.log(`Applied migration: ${file}`);
  }

  await connection.end();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = main;
