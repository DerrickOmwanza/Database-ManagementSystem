const authService = require('../../src/modules/auth/authService');

describe('authService', () => {
  test('hashPassword and verifyPassword work together', async () => {
    const hash = await authService.hashPassword('admin123');

    await expect(authService.verifyPassword('admin123', hash)).resolves.toBe(true);
    await expect(authService.verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });

  test('authenticate returns safe user payload for valid credentials', async () => {
    const passwordHash = await authService.hashPassword('admin123');
    const repository = {
      findByUsername: jest.fn().mockResolvedValue({
        id: 1,
        username: 'admin',
        password_hash: passwordHash,
        full_name: 'System Administrator',
        role: 'Admin',
        status: 'Active',
      }),
      updateLastLogin: jest.fn().mockResolvedValue(undefined),
    };

    const result = await authService.authenticate({
      username: 'admin',
      password: 'admin123',
    }, repository);

    expect(result).toEqual({
      id: 1,
      username: 'admin',
      fullName: 'System Administrator',
      role: 'Admin',
    });
    expect(repository.updateLastLogin).toHaveBeenCalledWith(1);
  });
});
