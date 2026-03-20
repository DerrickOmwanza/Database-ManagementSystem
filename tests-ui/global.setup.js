const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const { executeSqlFile } = require('../src/database/runSqlBatch');
const authService = require('../src/modules/auth/authService');

async function resetDatabase(config) {
  const adminConnection = await mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
  });

  await adminConnection.query(`DROP DATABASE IF EXISTS \`${config.database}\``);
  await adminConnection.query(
    `CREATE DATABASE \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await adminConnection.end();

  const connection = await mysql.createConnection(config);
  const migrationsDir = path.join(__dirname, '..', 'src', 'database', 'migrations');
  const seedsDir = path.join(__dirname, '..', 'src', 'database', 'seeds');

  for (const file of fs.readdirSync(migrationsDir).sort()) {
    await executeSqlFile(connection, path.join(migrationsDir, file));
  }

  for (const file of fs.readdirSync(seedsDir).sort()) {
    await executeSqlFile(connection, path.join(seedsDir, file));
  }

  const passwordHash = await authService.hashPassword('admin123');
  await connection.query(
    `INSERT INTO system_users (username, password_hash, full_name, role, status)
     VALUES (?, ?, ?, 'Admin', 'Active')`,
    ['admin', passwordHash, 'System Administrator']
  );

  return connection;
}

async function seedOperationalFixtures(connection) {
  const [packageRows] = await connection.query(
    `SELECT id FROM bandwidth_packages WHERE speed_label = '10 MBPS' LIMIT 1`
  );
  const [upgradeRows] = await connection.query(
    `SELECT id, monthly_cost FROM bandwidth_packages WHERE speed_label IN ('10 MBPS', '20 MBPS') ORDER BY monthly_cost ASC`
  );

  const basePackageId = packageRows[0].id;
  const oldPackage = upgradeRows.find((row) => Number(row.monthly_cost) === 2000);
  const newPackage = upgradeRows.find((row) => Number(row.monthly_cost) === 3500);

  const [institutionResult] = await connection.query(
    `INSERT INTO institutions
     (name, postal_address, town, county, institution_type, bandwidth_package_id, registration_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`,
    [
      'Playwright Academy',
      'P.O. Box 100',
      'Nairobi',
      'Nairobi',
      'Senior',
      basePackageId,
      '2026-01-15',
    ]
  );

  const institutionId = institutionResult.insertId;

  await connection.query(
    `INSERT INTO contact_people (institution_id, full_name, phone, email)
     VALUES (?, ?, ?, ?)`,
    [institutionId, 'Jane Testing', '0712345678', 'jane.testing@example.com']
  );

  await connection.query(
    `INSERT INTO payments
     (institution_id, payment_type, amount, payment_date, status, notes)
     VALUES (?, 'Registration', 8500.00, '2026-01-15', 'Paid', 'Playwright registration fixture')`,
    [institutionId]
  );

  await connection.query(
    `INSERT INTO payments
     (institution_id, payment_type, amount, payment_date, status, notes)
     VALUES (?, 'Installation', 10000.00, '2026-01-18', 'Paid', 'Playwright installation fixture')`,
    [institutionId]
  );

  const [monthlyResult] = await connection.query(
    `INSERT INTO payments
     (institution_id, payment_type, amount, payment_date, billing_month, billing_year, due_date, status, notes)
     VALUES (?, 'Monthly', 2000.00, '2026-02-01', 2, 2026, '2026-02-05', 'Overdue', 'Playwright overdue monthly charge')`,
    [institutionId]
  );

  await connection.query(
    `INSERT INTO payments
     (institution_id, payment_type, amount, payment_date, billing_month, billing_year, due_date, status, notes)
     VALUES (?, 'Fine', 300.00, '2026-03-12', 2, 2026, '2026-02-05', 'Paid', 'Playwright late fine fixture')`,
    [institutionId]
  );

  await connection.query(
    `INSERT INTO fines
     (institution_id, payment_id, base_amount, fine_rate, fine_amount, applied_date, status)
     VALUES (?, ?, 2000.00, 0.15, 300.00, '2026-03-12', 'Paid')`,
    [institutionId, monthlyResult.insertId]
  );

  await connection.query(
    `INSERT INTO disconnections
     (institution_id, effective_date, reason, outstanding_balance, fine_amount, reconnection_fee, status)
     VALUES (?, '2026-03-10', 'Late monthly payment', 2000.00, 300.00, 1000.00, 'Disconnected')`,
    [institutionId]
  );

  await connection.query(
    `UPDATE institutions SET status = 'Disconnected' WHERE id = ?`,
    [institutionId]
  );

  await connection.query(
    `INSERT INTO infrastructure_records
     (institution_id, pcs_purchased, pcs_cost, lan_nodes, lan_cost, installation_fee, total_cost, installation_status, installation_date)
     VALUES (?, 12, 480000.00, 12, 20000.00, 10000.00, 510000.00, 'Completed', '2026-01-20')`,
    [institutionId]
  );

  await connection.query(
    `INSERT INTO bandwidth_upgrades
     (institution_id, old_package_id, new_package_id, old_monthly_cost, new_monthly_cost, discount_percent, discounted_monthly_cost, upgrade_date)
     VALUES (?, ?, ?, 2000.00, 3500.00, 10.00, 3150.00, '2026-03-01')`,
    [institutionId, oldPackage.id, newPackage.id]
  );
}

module.exports = async () => {
  const databaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.PLAYWRIGHT_DB_NAME || 'azani_isp_playwright',
  };

  let connection;

  try {
    connection = await resetDatabase(databaseConfig);
    await seedOperationalFixtures(connection);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
