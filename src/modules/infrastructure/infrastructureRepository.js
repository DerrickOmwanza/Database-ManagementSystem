const db = require('../../config/database');

async function listInstitutions() {
  const [rows] = await db.query(`
    SELECT
      i.id,
      i.name,
      i.institution_type,
      i.status
    FROM institutions i
    ORDER BY i.name ASC
  `);

  return rows;
}

async function getLanPricingTiers() {
  const [rows] = await db.query(`
    SELECT id, min_nodes, max_nodes, cost
    FROM lan_pricing_tiers
    ORDER BY min_nodes ASC
  `);

  return rows;
}

async function findInstitutionById(institutionId) {
  const [rows] = await db.query(`
    SELECT id, name, institution_type, status
    FROM institutions
    WHERE id = ?
    LIMIT 1
  `, [institutionId]);

  return rows[0] || null;
}

async function findRecordByInstitutionId(institutionId) {
  const [rows] = await db.query(`
    SELECT
      ir.id,
      ir.institution_id,
      ir.pcs_purchased,
      ir.pcs_cost,
      ir.lan_nodes,
      ir.lan_cost,
      ir.installation_fee,
      ir.total_cost,
      ir.installation_status,
      ir.installation_date
    FROM infrastructure_records ir
    WHERE ir.institution_id = ?
    LIMIT 1
  `, [institutionId]);

  return rows[0] || null;
}

async function findTierForNodeCount(nodeCount) {
  const [rows] = await db.query(`
    SELECT id, min_nodes, max_nodes, cost
    FROM lan_pricing_tiers
    WHERE ? BETWEEN min_nodes AND max_nodes
    LIMIT 1
  `, [nodeCount]);

  return rows[0] || null;
}

async function getAllRecords() {
  const [rows] = await db.query(`
    SELECT
      ir.id,
      ir.institution_id,
      i.name AS institution_name,
      i.institution_type,
      ir.pcs_purchased,
      ir.pcs_cost,
      ir.lan_nodes,
      ir.lan_cost,
      ir.installation_fee,
      ir.total_cost,
      ir.installation_status,
      ir.installation_date
    FROM infrastructure_records ir
    JOIN institutions i ON i.id = ir.institution_id
    ORDER BY i.name ASC
  `);

  return rows;
}

async function createRecord(payload) {
  const [result] = await db.query(`
    INSERT INTO infrastructure_records
      (institution_id, pcs_purchased, pcs_cost, lan_nodes, lan_cost, installation_fee, total_cost, installation_status, installation_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    payload.institutionId,
    payload.pcsPurchased,
    payload.pcsCost,
    payload.lanNodes,
    payload.lanCost,
    payload.installationFee,
    payload.totalCost,
    payload.installationStatus,
    payload.installationDate,
  ]);

  return result.insertId;
}

async function updateRecord(recordId, payload) {
  await db.query(`
    UPDATE infrastructure_records
    SET pcs_purchased = ?,
        pcs_cost = ?,
        lan_nodes = ?,
        lan_cost = ?,
        installation_fee = ?,
        total_cost = ?,
        installation_status = ?,
        installation_date = ?
    WHERE id = ?
  `, [
    payload.pcsPurchased,
    payload.pcsCost,
    payload.lanNodes,
    payload.lanCost,
    payload.installationFee,
    payload.totalCost,
    payload.installationStatus,
    payload.installationDate,
    recordId,
  ]);
}

module.exports = {
  listInstitutions,
  getLanPricingTiers,
  findInstitutionById,
  findRecordByInstitutionId,
  findTierForNodeCount,
  getAllRecords,
  createRecord,
  updateRecord,
};
