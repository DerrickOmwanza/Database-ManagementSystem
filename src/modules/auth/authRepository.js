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

async function findById(userId) {
  const [rows] = await db.query(
    `SELECT id, username, password_hash, full_name, role, status
     FROM system_users
     WHERE id = ?`,
    [userId]
  );

  return rows[0] || null;
}

async function updateLastLogin(userId) {
  await db.query(
    'UPDATE system_users SET last_login_at = NOW() WHERE id = ?',
    [userId]
  );
}

async function updatePassword(userId, passwordHash) {
  await db.query(
    'UPDATE system_users SET password_hash = ? WHERE id = ?',
    [passwordHash, userId]
  );
}

async function findByUsernameExcluding(username, excludeUserId) {
  const [rows] = await db.query(
    `SELECT id FROM system_users WHERE username = ? AND id != ?`,
    [username, excludeUserId]
  );
  return rows[0] || null;
}

async function updateUsername(userId, newUsername) {
  await db.query(
    'UPDATE system_users SET username = ? WHERE id = ?',
    [newUsername, userId]
  );
}

module.exports = {
  findByUsername,
  findById,
  updateLastLogin,
  updatePassword,
  findByUsernameExcluding,
  updateUsername,
};
