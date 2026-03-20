const db = require('../../config/database');

async function findByUsername(username) {
  const [rows] = await db.query(
    `SELECT id, username, password_hash, full_name, role, status, last_login_at
     FROM system_users
     WHERE username = ?`,
    [username]
  );

  return rows[0] || null;
}

async function updateLastLogin(userId) {
  await db.query(
    'UPDATE system_users SET last_login_at = NOW() WHERE id = ?',
    [userId]
  );
}

module.exports = {
  findByUsername,
  updateLastLogin,
};
