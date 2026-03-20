const request = require('supertest');

jest.mock('../../src/modules/auth/authRepository', () => ({
  findByUsername: jest.fn(),
  updateLastLogin: jest.fn(),
}));

jest.mock('../../src/modules/infrastructure/infrastructureRepository', () => ({
  listInstitutions: jest.fn(),
  getLanPricingTiers: jest.fn(),
  findInstitutionById: jest.fn(),
  findRecordByInstitutionId: jest.fn(),
  findTierForNodeCount: jest.fn(),
  getAllRecords: jest.fn(),
  createRecord: jest.fn(),
  updateRecord: jest.fn(),
}));

const authRepository = require('../../src/modules/auth/authRepository');
const infrastructureRepository = require('../../src/modules/infrastructure/infrastructureRepository');
const authService = require('../../src/modules/auth/authService');
const app = require('../../server');

describe('infrastructure routes', () => {
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
    await agent.post('/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });

    return agent;
  }

  test('GET /infrastructure redirects unauthenticated users', async () => {
    const response = await request(app).get('/infrastructure');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
  });

  test('GET /infrastructure returns infrastructure page for authenticated user', async () => {
    infrastructureRepository.listInstitutions.mockResolvedValue([]);
    infrastructureRepository.getAllRecords.mockResolvedValue([]);
    infrastructureRepository.getLanPricingTiers.mockResolvedValue([]);

    const agent = await loginAgent();
    const response = await agent.get('/infrastructure');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Infrastructure');
  });

  test('POST /infrastructure creates record via JSON', async () => {
    infrastructureRepository.findInstitutionById.mockResolvedValue({
      id: 1,
      name: 'Greenfield Academy',
    });
    infrastructureRepository.findTierForNodeCount.mockResolvedValue({
      id: 1,
      min_nodes: 2,
      max_nodes: 10,
      cost: 10000,
    });
    infrastructureRepository.findRecordByInstitutionId.mockResolvedValue(null);
    infrastructureRepository.createRecord.mockResolvedValue(12);

    const agent = await loginAgent();
    const response = await agent
      .post('/infrastructure')
      .set('Accept', 'application/json')
      .send({
        institutionId: 1,
        pcsPurchased: 1,
        lanNodes: 5,
        installationStatus: 'Completed',
        installationDate: '2024-03-12',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.recordId).toBe(12);
    expect(response.body.totalCost).toBe(60000);
  });
});
