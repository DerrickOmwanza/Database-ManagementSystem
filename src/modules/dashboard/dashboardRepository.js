const db = require('../../config/database');

async function getSummary() {
  const [[institutionCount]] = await db.query(
    'SELECT COUNT(*) AS total_institutions FROM institutions'
  );
  const [[activeCount]] = await db.query(
    "SELECT COUNT(*) AS active_institutions FROM institutions WHERE status = 'Active'"
  );
  const [[pendingCount]] = await db.query(
    "SELECT COUNT(*) AS pending_payments FROM payments WHERE payment_type = 'Monthly' AND status IN ('Pending', 'Overdue')"
  );
  const [[disconnectionCount]] = await db.query(
    "SELECT COUNT(*) AS disconnected_institutions FROM institutions WHERE status = 'Disconnected'"
  );

  return {
    totalInstitutions: Number(institutionCount.total_institutions),
    activeInstitutions: Number(activeCount.active_institutions),
    pendingPayments: Number(pendingCount.pending_payments),
    disconnectedInstitutions: Number(disconnectionCount.disconnected_institutions),
  };
}

async function getRecentActivity() {
  const [paymentRows] = await db.query(`
    SELECT
      p.id,
      'Payment' AS activity_type,
      i.name AS institution_name,
      p.payment_type AS detail,
      p.status,
      p.created_at AS activity_date
    FROM payments p
    JOIN institutions i ON i.id = p.institution_id
    ORDER BY p.created_at DESC
    LIMIT 5
  `);

  const [upgradeRows] = await db.query(`
    SELECT
      bu.id,
      'Upgrade' AS activity_type,
      i.name AS institution_name,
      CONCAT(old_bp.speed_label, ' to ', new_bp.speed_label) AS detail,
      'Completed' AS status,
      bu.created_at AS activity_date
    FROM bandwidth_upgrades bu
    JOIN institutions i ON i.id = bu.institution_id
    JOIN bandwidth_packages old_bp ON old_bp.id = bu.old_package_id
    JOIN bandwidth_packages new_bp ON new_bp.id = bu.new_package_id
    ORDER BY bu.created_at DESC
    LIMIT 5
  `);

  return [...paymentRows, ...upgradeRows]
    .sort((left, right) => new Date(right.activity_date) - new Date(left.activity_date))
    .slice(0, 8);
}

module.exports = {
  getSummary,
  getRecentActivity,
};
