const db = require('../../config/database');

/**
 * Write one audit log entry.
 *
 * @param {object} params
 * @param {number|null} params.userId      - system_users.id (null for anonymous)
 * @param {string}      params.action      - e.g. 'LOGIN', 'LOGOUT', 'REGISTER_INSTITUTION'
 * @param {string}      params.entity      - table / domain name, e.g. 'institutions'
 * @param {number|null} params.entityId    - PK of the affected row (null if not applicable)
 * @param {string}      params.description - human-readable summary
 * @param {string}      params.ipAddress   - req.ip
 */
async function auditLog({ userId, action, entity, entityId, description, ipAddress }) {
  try {
    await db.query(
      `INSERT INTO audit_logs
         (user_id, action, entity, entity_id, description, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId   || null,
        action,
        entity,
        entityId || null,
        description,
        ipAddress || null,
      ]
    );
  } catch {
    // Audit failures must never crash the main request
  }
}

module.exports = auditLog;
