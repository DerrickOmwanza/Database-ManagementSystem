const request = require('supertest');

jest.mock('../../src/modules/auth/authRepository', () => ({
  findByUsername: jest.fn(),
  updateLastLogin: jest.fn(),
}));

jest.mock('../../src/modules/reports/reportRepository', () => ({
  getRegisteredInstitutions: jest.fn(),
  getDefaulters: jest.fn(),
  getDisconnections: jest.fn(),
  getInfrastructureReport: jest.fn(),
  getFinancialSummaryByInstitution: jest.fn(),
  getFinancialSummaryByType: jest.fn(),
  getUpgradeHistory: jest.fn(),
}));

const authRepository = require('../../src/modules/auth/authRepository');
const reportRepository = require('../../src/modules/reports/reportRepository');
const authService = require('../../src/modules/auth/authService');
const app = require('../../server');

describe('report routes', () => {
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

  test('GET /reports redirects unauthenticated users', async () => {
    const response = await request(app).get('/reports');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
  });

  test('GET /reports returns reports page for authenticated user', async () => {
    reportRepository.getRegisteredInstitutions.mockResolvedValue([]);
    reportRepository.getDefaulters.mockResolvedValue([]);
    reportRepository.getDisconnections.mockResolvedValue([]);
    reportRepository.getInfrastructureReport.mockResolvedValue([]);
    reportRepository.getFinancialSummaryByInstitution.mockResolvedValue([]);
    reportRepository.getFinancialSummaryByType.mockResolvedValue([]);
    reportRepository.getUpgradeHistory.mockResolvedValue([]);

    const agent = await loginAgent();
    const response = await agent.get('/reports');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Reports');
  });
});
