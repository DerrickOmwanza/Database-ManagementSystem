const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const env = require('../../config/env');
const { executeSqlFile } = require('../runSqlBatch');
const authService = require('../../modules/auth/authService');

async function seedAdminUser(connection) {
  console.log('seedAdminUser: starting admin user seed');

  let passwordHash;
  try {
    passwordHash = await authService.hashPassword('admin123');
    console.log('seedAdminUser: password hashed successfully, hash prefix:', passwordHash.substring(0, 10) + '...');
  } catch (hashError) {
    console.error('seedAdminUser: failed to hash password:', hashError);
    throw hashError;
  }

  try {
    const [result] = await connection.query(
      `INSERT INTO system_users (username, password_hash, full_name, role, status)
       VALUES (?, ?, ?, 'Admin', 'Active')
       ON DUPLICATE KEY UPDATE
         password_hash = VALUES(password_hash),
         full_name = VALUES(full_name),
         role = VALUES(role),
         status = VALUES(status),
         updated_at = CURRENT_TIMESTAMP`,
      ['admin', passwordHash, 'System Administrator']
    );
    console.log('seedAdminUser: INSERT query succeeded, affectedRows:', result.affectedRows);
  } catch (queryError) {
    console.error('seedAdminUser: INSERT query failed:', queryError);
    throw queryError;
  }
}

async function main() {
  const connection = await mysql.createConnection({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    port: env.db.port,
    database: env.db.database,
  });

  const seedsDir = path.join(__dirname, '..', 'seeds');
  const seedFiles = fs.readdirSync(seedsDir).sort();

  for (const file of seedFiles) {
    await executeSqlFile(connection, path.join(seedsDir, file));
    console.log(`Applied seed: ${file}`);
  }

  try {
    await seedAdminUser(connection);
    console.log('Applied seed: admin user');
  } catch (error) {
    console.error('main: seedAdminUser failed:', error);
    throw error;
  }

  await connection.end();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = main;
