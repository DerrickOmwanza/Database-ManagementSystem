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

async function getAllPayments() {
  const [rows] = await db.query(`
    SELECT
      p.id,
      p.institution_id,
      i.name AS institution_name,
      p.payment_type,
      p.amount,
      p.payment_date,
      p.billing_month,
      p.billing_year,
      p.due_date,
      p.status,
      p.notes
    FROM payments p
    JOIN institutions i ON i.id = p.institution_id
    ORDER BY p.created_at DESC, p.id DESC
  `);

  return rows;
}

async function getPendingMonthlyCharges() {
  const [rows] = await db.query(`
    SELECT
      p.id,
      p.institution_id,
      i.name AS institution_name,
      p.amount,
      p.billing_month,
      p.billing_year,
      p.due_date,
      p.status
    FROM payments p
    JOIN institutions i ON i.id = p.institution_id
    WHERE p.payment_type = 'Monthly'
      AND p.status IN ('Pending', 'Overdue')
    ORDER BY p.due_date ASC, i.name ASC
  `);

  return rows;
}

async function findInstitutionBillingProfile(institutionId) {
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
  `, [institutionId]);

  return rows[0] || null;
}

async function findMonthlyCharge(institutionId, billingMonth, billingYear) {
  const [rows] = await db.query(`
    SELECT id, institution_id, payment_type, amount, payment_date, billing_month, billing_year, due_date, status, notes
    FROM payments
    WHERE institution_id = ?
      AND payment_type = 'Monthly'
      AND billing_month = ?
      AND billing_year = ?
    LIMIT 1
  `, [institutionId, billingMonth, billingYear]);

  return rows[0] || null;
}

async function findPaymentById(paymentId) {
  const [rows] = await db.query(`
    SELECT id, institution_id, payment_type, amount, payment_date, billing_month, billing_year, due_date, status, notes
    FROM payments
    WHERE id = ?
    LIMIT 1
  `, [paymentId]);

  return rows[0] || null;
}

async function findLatestOpenDisconnection(institutionId) {
  const [rows] = await db.query(`
    SELECT id, institution_id, effective_date, reason, outstanding_balance, fine_amount, reconnection_fee, status
    FROM disconnections
    WHERE institution_id = ?
      AND status = 'Disconnected'
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `, [institutionId]);

  return rows[0] || null;
}

async function createMonthlyCharge(payload) {
  const [result] = await db.query(`
    INSERT INTO payments
      (institution_id, payment_type, amount, payment_date, billing_month, billing_year, due_date, status, notes)
    VALUES (?, 'Monthly', ?, CURDATE(), ?, ?, ?, 'Pending', ?)
  `, [
    payload.institutionId,
    payload.amount,
    payload.billingMonth,
    payload.billingYear,
    payload.dueDate,
    payload.notes || 'Generated monthly charge',
  ]);

  return result.insertId;
}

async function markPaymentSettled(paymentId, paymentDate, notes) {
  await db.query(`
    UPDATE payments
    SET status = 'Paid',
        payment_date = ?,
        notes = ?
    WHERE id = ?
  `, [paymentDate, notes, paymentId]);
}

async function markPaymentOverdue(paymentId, notes) {
  await db.query(`
    UPDATE payments
    SET status = 'Overdue',
        notes = ?
    WHERE id = ?
  `, [notes, paymentId]);
}

async function createFinePayment(payload) {
  const [result] = await db.query(`
    INSERT INTO payments
      (institution_id, payment_type, amount, payment_date, billing_month, billing_year, due_date, status, notes)
    VALUES (?, 'Fine', ?, ?, ?, ?, ?, 'Paid', ?)
  `, [
    payload.institutionId,
    payload.amount,
    payload.paymentDate,
    payload.billingMonth,
    payload.billingYear,
    payload.dueDate,
    payload.notes,
  ]);

  return result.insertId;
}

async function createFineRecord(payload) {
  const [result] = await db.query(`
    INSERT INTO fines
      (institution_id, payment_id, base_amount, fine_rate, fine_amount, applied_date, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Paid')
  `, [
    payload.institutionId,
    payload.paymentId,
    payload.baseAmount,
    payload.fineRate,
    payload.fineAmount,
    payload.appliedDate,
  ]);

  return result.insertId;
}

async function createInstallationPayment(payload) {
  const [result] = await db.query(`
    INSERT INTO payments
      (institution_id, payment_type, amount, payment_date, status, notes)
    VALUES (?, 'Installation', ?, ?, 'Paid', ?)
  `, [payload.institutionId, payload.amount, payload.paymentDate, payload.notes || null]);

  return result.insertId;
}

async function createReconnectionPayment(payload) {
  const [result] = await db.query(`
    INSERT INTO payments
      (institution_id, payment_type, amount, payment_date, status, notes)
    VALUES (?, 'Reconnection', ?, ?, 'Paid', ?)
  `, [payload.institutionId, payload.amount, payload.paymentDate, payload.notes || null]);

  return result.insertId;
}

async function createDisconnectionRecord(payload) {
  const [result] = await db.query(`
    INSERT INTO disconnections
      (institution_id, effective_date, reason, outstanding_balance, fine_amount, reconnection_fee, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Disconnected')
  `, [
    payload.institutionId,
    payload.effectiveDate,
    payload.reason,
    payload.outstandingBalance,
    payload.fineAmount,
    payload.reconnectionFee,
  ]);

  return result.insertId;
}

async function markDisconnectionReconnected(disconnectionId, reconnectedAt) {
  await db.query(`
    UPDATE disconnections
    SET status = 'Reconnected',
        reconnected_at = ?
    WHERE id = ?
  `, [reconnectedAt, disconnectionId]);
}

async function updateInstitutionStatus(institutionId, status) {
  await db.query('UPDATE institutions SET status = ? WHERE id = ?', [status, institutionId]);
}

module.exports = {
  listInstitutions,
  getAllPayments,
  getPendingMonthlyCharges,
  findInstitutionBillingProfile,
  findMonthlyCharge,
  findPaymentById,
  findLatestOpenDisconnection,
  createMonthlyCharge,
  markPaymentSettled,
  markPaymentOverdue,
  createFinePayment,
  createFineRecord,
  createInstallationPayment,
  createReconnectionPayment,
  createDisconnectionRecord,
  markDisconnectionReconnected,
  updateInstitutionStatus,
};
