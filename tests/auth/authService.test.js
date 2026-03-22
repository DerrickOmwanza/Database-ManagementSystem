const authService = require('../../src/modules/auth/authService');
const authRepository = require('../../src/modules/auth/authRepository');
const AppError = require('../../src/shared/errors/AppError');

jest.mock('../../src/modules/auth/authRepository');

describe('authService', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    authRepository.findById.mockClear();
    authRepository.updatePassword.mockClear();
    authRepository.findByUsername.mockClear();
    authRepository.updateLastLogin.mockClear();
  });

  test('hashPassword and verifyPassword work together', async () => {
    const hash = await authService.hashPassword('admin123');

    await expect(authService.verifyPassword('admin123', hash)).resolves.toBe(true);
    await expect(authService.verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });

  test('authenticate returns safe user payload for valid credentials', async () => {
    const passwordHash = await authService.hashPassword('admin123');
    authRepository.findByUsername.mockResolvedValue({
      id: 1,
      username: 'admin',
      password_hash: passwordHash,
      full_name: 'System Administrator',
      role: 'Admin',
      status: 'Active',
    });
    authRepository.updateLastLogin.mockResolvedValue(undefined);

    const result = await authService.authenticate({
      username: 'admin',
      password: 'admin123',
    }, authRepository);

    expect(result).toEqual({
      id: 1,
      username: 'admin',
      fullName: 'System Administrator',
      role: 'Admin',
    });
    expect(authRepository.updateLastLogin).toHaveBeenCalledWith(1);
  });

  describe('changePassword', () => {
    it('should update password when correct current password is provided', async () => {
      const userId = 1;
      const oldPassword = 'old-password';
      const newPassword = 'new-password-123';
      const oldPasswordHash = await authService.hashPassword(oldPassword);

      authRepository.findById.mockResolvedValue({
        id: userId,
        password_hash: oldPasswordHash,
      });
      authRepository.updatePassword.mockResolvedValue(undefined);

      await authService.changePassword({
        userId,
        currentPassword: oldPassword,
        newPassword,
      }, authRepository);

      expect(authRepository.findById).toHaveBeenCalledWith(userId);
      expect(authRepository.updatePassword).toHaveBeenCalledWith(userId, expect.any(String));

      // Verify the new password can be authenticated
      const newHash = authRepository.updatePassword.mock.calls[0][1];
      await expect(authService.verifyPassword(newPassword, newHash)).resolves.toBe(true);
      await expect(authService.verifyPassword(oldPassword, newHash)).resolves.toBe(false);
    });

    it('should throw error if incorrect current password is provided', async () => {
      const userId = 1;
      const oldPassword = 'old-password';
      const wrongPassword = 'wrong-password';
      const newPassword = 'new-password-123';
      const oldPasswordHash = await authService.hashPassword(oldPassword);

      authRepository.findById.mockResolvedValue({
        id: userId,
        password_hash: oldPasswordHash,
      });

      await expect(authService.changePassword({
        userId,
        currentPassword: wrongPassword,
        newPassword,
      }, authRepository)).rejects.toThrow(new AppError('Invalid current password.', 401));

      expect(authRepository.updatePassword).not.toHaveBeenCalled();
    });

    it('should throw error if user is not found', async () => {
      authRepository.findById.mockResolvedValue(null);

      await expect(authService.changePassword({
        userId: 999,
        currentPassword: 'any-password',
        newPassword: 'any-new-password',
      }, authRepository)).rejects.toThrow(new AppError('User not found.', 404));

      expect(authRepository.updatePassword).not.toHaveBeenCalled();
    });
  });
});
