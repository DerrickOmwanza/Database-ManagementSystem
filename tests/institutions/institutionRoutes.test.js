const request = require('supertest');

jest.mock('../../src/modules/auth/authRepository', () => ({
  findByUsername: jest.fn(),
  updateLastLogin: jest.fn(),
}));

jest.mock('../../src/modules/institutions/institutionRepository', () => ({
  listBandwidthPackages: jest.fn(),
  findByNameAndTown: jest.fn(),
  getAll: jest.fn(),
  createInstitutionRegistration: jest.fn(),
}));

const authRepository = require('../../src/modules/auth/authRepository');
const institutionRepository = require('../../src/modules/institutions/institutionRepository');
const authService = require('../../src/modules/auth/authService');
const app = require('../../server');

describe('institution routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function loginAgent() {
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

    const agent = request.agent(app);
    await agent
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    return agent;
  }

  test('GET /institutions redirects unauthenticated users to login', async () => {
    const response = await request(app).get('/institutions');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
  });

  test('GET /institutions returns institution list for authenticated user', async () => {
    institutionRepository.getAll.mockResolvedValue([
      {
        id: 1,
        name: 'Greenfield Academy',
        institution_type: 'Senior',
        town: 'Nakuru',
        county: 'Nakuru',
        contact_name: 'John Doe',
        contact_phone: '0712345678',
        speed_label: '10 MBPS',
        status: 'Active',
      },
    ]);

    const agent = await loginAgent();
    const response = await agent.get('/institutions');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Greenfield Academy');
  });

  test('POST /institutions creates institution for authenticated JSON request', async () => {
    institutionRepository.findByNameAndTown.mockResolvedValue(null);
    institutionRepository.createInstitutionRegistration.mockResolvedValue(15);

    const agent = await loginAgent();
    const response = await agent
      .post('/institutions')
      .set('Accept', 'application/json')
      .send({
        name: 'Sunrise Institute',
        postalAddress: 'P.O. Box 20',
        town: 'Mombasa',
        county: 'Mombasa',
        institutionType: 'College',
        bandwidthPackageId: 3,
        contactName: 'Jane Doe',
        contactPhone: '0712345678',
        contactEmail: 'info@sunrise.ac.ke',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.institutionId).toBe(15);
    expect(response.body.registrationFee).toBe(8500);
  });
});
