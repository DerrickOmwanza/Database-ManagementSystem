const db = require('../../config/database');

async function getRegisteredInstitutions() {
  const [rows] = await db.query(`
    SELECT
      i.id,
      i.name,
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

async function getDefaulters() {
  const [rows] = await db.query(`
    SELECT
      p.id,
      p.institution_id,
      i.name AS institution_name,
      i.institution_type,
      p.amount AS outstanding_amount,
      p.billing_month,
      p.billing_year,
      p.due_date,
      p.status,
      COALESCE(SUM(f.fine_amount), 0) AS fine_amount,
      p.amount + COALESCE(SUM(f.fine_amount), 0) AS total_due
    FROM payments p
    JOIN institutions i ON i.id = p.institution_id
    LEFT JOIN fines f ON f.payment_id = p.id
    WHERE p.payment_type = 'Monthly'
      AND p.status = 'Overdue'
    GROUP BY
      p.id,
      p.institution_id,
      i.name,
      i.institution_type,
      p.amount,
      p.billing_month,
      p.billing_year,
      p.due_date,
      p.status
    ORDER BY p.due_date ASC, i.name ASC
  `);

  return rows;
}

async function getDisconnections() {
  const [rows] = await db.query(`
    SELECT
      d.id,
      d.institution_id,
      i.name AS institution_name,
      i.institution_type,
      d.effective_date,
      d.reason,
      d.outstanding_balance,
      d.fine_amount,
      d.reconnection_fee,
      d.status,
      d.reconnected_at
    FROM disconnections d
    JOIN institutions i ON i.id = d.institution_id
    ORDER BY d.created_at DESC, d.id DESC
  `);

  return rows;
}

async function getInfrastructureReport() {
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

async function getFinancialSummaryByInstitution() {
  const [rows] = await db.query(`
    SELECT
      i.id AS institution_id,
      i.name AS institution_name,
      i.institution_type,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Registration' THEN p.amount ELSE 0 END), 0) AS registration_total,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Installation' THEN p.amount ELSE 0 END), 0) AS installation_total,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Monthly' AND p.status = 'Paid' THEN p.amount ELSE 0 END), 0) AS monthly_total,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Fine' THEN p.amount ELSE 0 END), 0) AS fine_total,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Reconnection' THEN p.amount ELSE 0 END), 0) AS reconnection_total,
      COALESCE(SUM(CASE WHEN p.status = 'Paid' THEN p.amount ELSE 0 END), 0) AS paid_total
    FROM institutions i
    LEFT JOIN payments p ON p.institution_id = i.id
    GROUP BY i.id, i.name, i.institution_type
    ORDER BY i.name ASC
  `);

  return rows;
}

async function getFinancialSummaryByType() {
  const [rows] = await db.query(`
    SELECT
      i.institution_type,
      COUNT(DISTINCT i.id) AS institution_count,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Registration' THEN p.amount ELSE 0 END), 0) AS registration_total,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Installation' THEN p.amount ELSE 0 END), 0) AS installation_total,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Monthly' AND p.status = 'Paid' THEN p.amount ELSE 0 END), 0) AS monthly_total,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Fine' THEN p.amount ELSE 0 END), 0) AS fine_total,
      COALESCE(SUM(CASE WHEN p.payment_type = 'Reconnection' THEN p.amount ELSE 0 END), 0) AS reconnection_total,
      COALESCE(SUM(CASE WHEN p.status = 'Paid' THEN p.amount ELSE 0 END), 0) AS paid_total
    FROM institutions i
    LEFT JOIN payments p ON p.institution_id = i.id
    GROUP BY i.institution_type
    ORDER BY i.institution_type ASC
  `);

  return rows;
}

async function getUpgradeHistory() {
  const [rows] = await db.query(`
    SELECT
      bu.id,
      bu.institution_id,
      i.name AS institution_name,
      old_bp.speed_label AS old_speed_label,
      new_bp.speed_label AS new_speed_label,
      bu.old_monthly_cost,
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

async function getAuditLog() {
  const [rows] = await db.query(`
    SELECT
      al.id,
      al.action,
      al.entity,
      al.entity_id,
      al.description,
      al.ip_address,
      al.created_at,
      su.username
    FROM audit_logs al
    LEFT JOIN system_users su ON su.id = al.user_id
    ORDER BY al.created_at DESC
    LIMIT 200
  `);
  return rows;
}

module.exports = {
  getRegisteredInstitutions,
  getDefaulters,
  getDisconnections,
  getInfrastructureReport,
  getFinancialSummaryByInstitution,
  getFinancialSummaryByType,
  getUpgradeHistory,
  getAuditLog,
};
