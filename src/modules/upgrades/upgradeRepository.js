const db = require('../../config/database');

async function listInstitutions() {
  const [rows] = await db.query(`
    SELECT
      i.id,
      i.name,
      i.status,
      bp.id AS bandwidth_package_id,
      bp.speed_label,
      bp.monthly_cost
    FROM institutions i
    JOIN bandwidth_packages bp ON bp.id = i.bandwidth_package_id
    ORDER BY i.name ASC
  `);

  return rows;
}

async function listBandwidthPackages() {
  const [rows] = await db.query(`
    SELECT id, speed_label, monthly_cost
    FROM bandwidth_packages
    ORDER BY monthly_cost ASC
  `);

  return rows;
}

async function findInstitutionWithPackage(institutionId) {
  const [rows] = await db.query(`
    SELECT
      i.id,
      i.name,
      i.status,
      bp.id AS bandwidth_package_id,
      bp.speed_label,
      bp.monthly_cost
    FROM institutions i
    JOIN bandwidth_packages bp ON bp.id = i.bandwidth_package_id
    WHERE i.id = ?
    LIMIT 1
  `, [institutionId]);

  return rows[0] || null;
}

async function findBandwidthPackage(packageId) {
  const [rows] = await db.query(`
    SELECT id, speed_label, monthly_cost
    FROM bandwidth_packages
    WHERE id = ?
    LIMIT 1
  `, [packageId]);

  return rows[0] || null;
}

async function getAllUpgrades() {
  const [rows] = await db.query(`
    SELECT
      bu.id,
      bu.institution_id,
      i.name AS institution_name,
      bu.old_package_id,
      old_bp.speed_label AS old_speed_label,
      bu.old_monthly_cost,
      bu.new_package_id,
      new_bp.speed_label AS new_speed_label,
      bu.new_monthly_cost,
      bu.discount_percent,
      bu.discounted_monthly_cost,
      bu.upgrade_date
    FROM bandwidth_upgrades bu
    JOIN institutions i ON i.id = bu.institution_id
    JOIN bandwidth_packages old_bp ON old_bp.id = bu.old_package_id
    JOIN bandwidth_packages new_bp ON new_bp.id = bu.new_package_id
    ORDER BY bu.upgrade_date DESC, bu.id DESC
  `);

  return rows;
}

async function createUpgradeAndUpdateInstitution(payload) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [upgradeResult] = await connection.query(`
      INSERT INTO bandwidth_upgrades
        (institution_id, old_package_id, new_package_id, old_monthly_cost, new_monthly_cost, discount_percent, discounted_monthly_cost, upgrade_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      payload.institutionId,
      payload.oldPackageId,
      payload.newPackageId,
      payload.oldMonthlyCost,
      payload.newMonthlyCost,
      payload.discountPercent,
      payload.discountedMonthlyCost,
      payload.upgradeDate,
    ]);

    await connection.query(`
      UPDATE institutions
      SET bandwidth_package_id = ?
      WHERE id = ?
    `, [payload.newPackageId, payload.institutionId]);

    await connection.commit();
    return upgradeResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  listInstitutions,
  listBandwidthPackages,
  findInstitutionWithPackage,
  findBandwidthPackage,
  getAllUpgrades,
  createUpgradeAndUpdateInstitution,
};
