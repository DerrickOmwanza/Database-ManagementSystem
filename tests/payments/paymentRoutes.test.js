const request = require('supertest');

jest.mock('../../src/modules/auth/authRepository', () => ({
  findByUsername: jest.fn(),
  updateLastLogin: jest.fn(),
}));

jest.mock('../../src/modules/payments/paymentRepository', () => ({
  listInstitutions: jest.fn(),
  getAllPayments: jest.fn(),
  getPendingMonthlyCharges: jest.fn(),
  findInstitutionBillingProfile: jest.fn(),
  findMonthlyCharge: jest.fn(),
  findPaymentById: jest.fn(),
  findLatestOpenDisconnection: jest.fn(),
  createMonthlyCharge: jest.fn(),
  markPaymentSettled: jest.fn(),
  markPaymentOverdue: jest.fn(),
  createFinePayment: jest.fn(),
  createFineRecord: jest.fn(),
  createInstallationPayment: jest.fn(),
  createReconnectionPayment: jest.fn(),
  createDisconnectionRecord: jest.fn(),
  markDisconnectionReconnected: jest.fn(),
  updateInstitutionStatus: jest.fn(),
}));

const authRepository = require('../../src/modules/auth/authRepository');
const paymentRepository = require('../../src/modules/payments/paymentRepository');
const authService = require('../../src/modules/auth/authService');
const app = require('../../server');

describe('payment routes', () => {
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

  test('GET /payments redirects unauthenticated users', async () => {
    const response = await request(app).get('/payments');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
  });

  test('GET /payments returns billing page for authenticated user', async () => {
    paymentRepository.listInstitutions.mockResolvedValue([]);
    paymentRepository.getAllPayments.mockResolvedValue([]);
    paymentRepository.getPendingMonthlyCharges.mockResolvedValue([]);

    const agent = await loginAgent();
    const response = await agent.get('/payments');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Generate Monthly Charge');
  });

  test('POST /payments/monthly-charges creates monthly charge via JSON', async () => {
    paymentRepository.findInstitutionBillingProfile.mockResolvedValue({
      id: 2,
      monthly_cost: 3500,
      speed_label: '20 MBPS',
    });
    paymentRepository.findMonthlyCharge.mockResolvedValue(null);
    paymentRepository.createMonthlyCharge.mockResolvedValue(44);

    const agent = await loginAgent();
    const response = await agent
      .post('/payments/monthly-charges')
      .set('Accept', 'application/json')
      .send({
        institutionId: 2,
        billingMonth: 3,
        billingYear: 2026,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.paymentId).toBe(44);
    expect(response.body.amount).toBe(3500);
  });
});
