const db = require('../../config/database');

async function listBandwidthPackages() {
  const [rows] = await db.query(
    'SELECT id, speed_label, monthly_cost FROM bandwidth_packages ORDER BY monthly_cost ASC'
  );
  return rows;
}

async function findByNameAndTown(name, town) {
  const [rows] = await db.query(
    `SELECT id, name, town, county, institution_type, bandwidth_package_id, registration_date, status
     FROM institutions
     WHERE LOWER(name) = LOWER(?) AND LOWER(town) = LOWER(?)`,
    [name.trim(), town.trim()]
  );

  return rows[0] || null;
}

async function getAll() {
  const [rows] = await db.query(`
    SELECT
      i.id,
      i.name,
      i.postal_address,
      i.town,
      i.county,
      i.institution_type,
      i.registration_date,
      i.status,
      bp.speed_label,
      bp.monthly_cost,
      cp.full_name AS contact_name,
      cp.phone AS contact_phone,
      cp.email AS contact_email
    FROM institutions i
    JOIN bandwidth_packages bp ON bp.id = i.bandwidth_package_id
    LEFT JOIN contact_people cp ON cp.institution_id = i.id
    ORDER BY i.name ASC
  `);

  return rows;
}

async function createInstitutionRegistration(payload, registrationFee) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [institutionResult] = await connection.query(
      `INSERT INTO institutions
       (name, postal_address, town, county, institution_type, bandwidth_package_id, registration_date, status)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 'Active')`,
      [
        payload.name.trim(),
        payload.postalAddress ? payload.postalAddress.trim() : null,
        payload.town.trim(),
        payload.county.trim(),
        payload.institutionType,
        payload.bandwidthPackageId,
      ]
    );

    const institutionId = institutionResult.insertId;

    await connection.query(
      `INSERT INTO contact_people
       (institution_id, full_name, phone, email)
       VALUES (?, ?, ?, ?)`,
      [
        institutionId,
        payload.contactName.trim(),
        payload.contactPhone.trim(),
        payload.contactEmail ? payload.contactEmail.trim() : null,
      ]
    );

    await connection.query(
      `INSERT INTO payments
       (institution_id, payment_type, amount, payment_date, status, notes)
       VALUES (?, 'Registration', ?, CURDATE(), 'Paid', ?)`,
      [institutionId, registrationFee, 'Auto-recorded during institution registration']
    );

    await connection.commit();
    return institutionId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  listBandwidthPackages,
  findByNameAndTown,
  getAll,
  createInstitutionRegistration,
};
