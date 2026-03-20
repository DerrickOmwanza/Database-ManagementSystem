const request = require('supertest');

jest.mock('../../src/modules/auth/authRepository', () => ({
  findByUsername: jest.fn(),
  updateLastLogin: jest.fn(),
}));

jest.mock('../../src/modules/upgrades/upgradeRepository', () => ({
  listInstitutions: jest.fn(),
  listBandwidthPackages: jest.fn(),
  findInstitutionWithPackage: jest.fn(),
  findBandwidthPackage: jest.fn(),
  getAllUpgrades: jest.fn(),
  createUpgradeAndUpdateInstitution: jest.fn(),
}));

const authRepository = require('../../src/modules/auth/authRepository');
const upgradeRepository = require('../../src/modules/upgrades/upgradeRepository');
const authService = require('../../src/modules/auth/authService');
const app = require('../../server');

describe('upgrade routes', () => {
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

  test('GET /upgrades redirects unauthenticated users', async () => {
    const response = await request(app).get('/upgrades');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
  });

  test('GET /upgrades returns upgrade page for authenticated user', async () => {
    upgradeRepository.listInstitutions.mockResolvedValue([]);
    upgradeRepository.listBandwidthPackages.mockResolvedValue([]);
    upgradeRepository.getAllUpgrades.mockResolvedValue([]);

    const agent = await loginAgent();
    const response = await agent.get('/upgrades');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Bandwidth Upgrades');
  });

  test('POST /upgrades processes upgrade via JSON', async () => {
    upgradeRepository.findInstitutionWithPackage.mockResolvedValue({
      id: 1,
      bandwidth_package_id: 2,
      monthly_cost: 2000,
    });
    upgradeRepository.findBandwidthPackage.mockResolvedValue({
      id: 3,
      monthly_cost: 3500,
    });
    upgradeRepository.createUpgradeAndUpdateInstitution.mockResolvedValue(22);

    const agent = await loginAgent();
    const response = await agent
      .post('/upgrades')
      .set('Accept', 'application/json')
      .send({
        institutionId: 1,
        newPackageId: 3,
        upgradeDate: '2024-03-10',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.upgradeId).toBe(22);
    expect(response.body.discountedMonthlyCost).toBe(3150);
  });
});
