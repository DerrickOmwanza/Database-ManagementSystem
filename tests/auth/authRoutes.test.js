const request = require('supertest');

jest.mock('../../src/modules/auth/authRepository', () => ({
  findByUsername: jest.fn(),
  updateLastLogin: jest.fn(),
}));

const authRepository = require('../../src/modules/auth/authRepository');
const authService = require('../../src/modules/auth/authService');
const app = require('../../server');

describe('auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /auth/login returns login page', async () => {
    const response = await request(app).get('/auth/login');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Azani ISP Login');
  });

  test('POST /auth/login returns 400 for missing credentials on JSON request', async () => {
    const response = await request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  test('POST /auth/login authenticates valid JSON credentials', async () => {
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

    const response = await request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        username: 'admin',
        password: 'admin123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.username).toBe('admin');
  });
});
