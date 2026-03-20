const crypto = require('crypto');

const AppError = require('../../shared/errors/AppError');

const HASH_KEY_LENGTH = 64;

function scryptAsync(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, HASH_KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  const [salt, key] = String(storedHash).split(':');
  if (!salt || !key) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt);
  const storedBuffer = Buffer.from(key, 'hex');

  return storedBuffer.length === derivedKey.length
    && crypto.timingSafeEqual(storedBuffer, derivedKey);
}

async function authenticate(credentials, repository) {
  const user = await repository.findByUsername(credentials.username);

  if (!user || user.status !== 'Active') {
    throw new AppError('Invalid username or password', 401);
  }

  const passwordValid = await verifyPassword(credentials.password, user.password_hash);
  if (!passwordValid) {
    throw new AppError('Invalid username or password', 401);
  }

  await repository.updateLastLogin(user.id);

  return {
    id: user.id,
    username: user.username,
    fullName: user.full_name,
    role: user.role,
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  authenticate,
};
