const crypto = require('crypto');
const authRepository = require('./authRepository');
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

async function changePassword({ userId, currentPassword, newPassword }, repository) {
    const user = await repository.findById(userId);
    if (!user) {
        throw new AppError('User not found.', 404);
    }

    const passwordValid = await verifyPassword(currentPassword, user.password_hash);
    if (!passwordValid) {
        throw new AppError('Invalid current password.', 401);
    }

    if (!newPassword || newPassword.length < 8) {
        throw new AppError('New password must be at least 8 characters.', 400);
    }

    const newPasswordHash = await hashPassword(newPassword);
    await repository.updatePassword(userId, newPasswordHash);
}

async function changeUsername({ userId, currentPassword, newUsername }, repository) {
    const user = await repository.findById(userId);
    if (!user) {
        throw new AppError('User not found.', 404);
    }

    const passwordValid = await verifyPassword(currentPassword, user.password_hash);
    if (!passwordValid) {
        throw new AppError('Invalid current password.', 401);
    }

    const trimmed = newUsername.trim();
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(trimmed)) {
        throw new AppError('Username must be 3–50 characters and contain only letters, numbers, and underscores.', 400);
    }

    const conflict = await repository.findByUsernameExcluding(trimmed, userId);
    if (conflict) {
        throw new AppError('That username is already taken. Please choose another.', 409);
    }

    await repository.updateUsername(userId, trimmed);
    return { newUsername: trimmed };
}

module.exports = {
  hashPassword,
  verifyPassword,
  authenticate,
  changePassword,
  changeUsername,
};
