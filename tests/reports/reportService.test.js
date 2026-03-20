const reportService = require('../../src/modules/reports/reportService');

describe('reportService', () => {
  test('getReportsDashboard computes overall financial totals', async () => {
    const repository = {
      getRegisteredInstitutions: jest.fn().mockResolvedValue([]),
      getDefaulters: jest.fn().mockResolvedValue([]),
      getDisconnections: jest.fn().mockResolvedValue([]),
      getInfrastructureReport: jest.fn().mockResolvedValue([]),
      getFinancialSummaryByInstitution: jest.fn().mockResolvedValue([
        {
          registration_total: 8500,
          installation_total: 10000,
          monthly_total: 2000,
          fine_total: 300,
          reconnection_total: 0,
          paid_total: 20800,
        },
        {
          registration_total: 8500,
          installation_total: 0,
          monthly_total: 3500,
          fine_total: 0,
          reconnection_total: 1000,
          paid_total: 13000,
        },
      ]),
      getFinancialSummaryByType: jest.fn().mockResolvedValue([]),
      getUpgradeHistory: jest.fn().mockResolvedValue([]),
    };

    const result = await reportService.getReportsDashboard(repository);

    expect(result.overallFinancialTotals).toEqual({
      registrationTotal: 17000,
      installationTotal: 10000,
      monthlyTotal: 5500,
      fineTotal: 300,
      reconnectionTotal: 1000,
      paidTotal: 33800,
    });
  });
});
