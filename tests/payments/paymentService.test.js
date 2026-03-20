const paymentService = require('../../src/modules/payments/paymentService');

describe('paymentService', () => {
  test('generateMonthlyCharge rejects duplicate billing period', async () => {
    const repository = {
      findInstitutionBillingProfile: jest.fn().mockResolvedValue({
        id: 1,
        monthly_cost: 2000,
        speed_label: '10 MBPS',
      }),
      findMonthlyCharge: jest.fn().mockResolvedValue({ id: 7 }),
      createMonthlyCharge: jest.fn(),
    };

    await expect(paymentService.generateMonthlyCharge({
      institutionId: 1,
      billingMonth: 3,
      billingYear: 2026,
    }, repository)).rejects.toMatchObject({
      message: 'Monthly charge already exists for the selected billing period.',
      statusCode: 409,
    });
  });

  test('settleMonthlyCharge applies fine and flags reconnection after deadline', async () => {
    const repository = {
      findPaymentById: jest.fn().mockResolvedValue({
        id: 11,
        institution_id: 3,
        payment_type: 'Monthly',
        amount: 2000,
        billing_month: 3,
        billing_year: 2024,
        due_date: '2024-03-31',
        status: 'Pending',
      }),
      createFineRecord: jest.fn().mockResolvedValue(1),
      createFinePayment: jest.fn().mockResolvedValue(2),
      findLatestOpenDisconnection: jest.fn().mockResolvedValue(null),
      createDisconnectionRecord: jest.fn().mockResolvedValue(4),
      updateInstitutionStatus: jest.fn().mockResolvedValue(undefined),
      markPaymentOverdue: jest.fn().mockResolvedValue(undefined),
      markPaymentSettled: jest.fn().mockResolvedValue(undefined),
    };

    const result = await paymentService.settleMonthlyCharge({
      paymentId: 11,
      paymentDate: '2024-04-15',
    }, repository);

    expect(result).toEqual({
      paymentId: 11,
      baseAmount: 2000,
      fineAmount: 300,
      totalPaid: 2300,
      reconnectRequired: true,
      disconnectionCreated: true,
    });
    expect(repository.createFinePayment).toHaveBeenCalled();
    expect(repository.createDisconnectionRecord).toHaveBeenCalled();
    expect(repository.updateInstitutionStatus).toHaveBeenCalledWith(3, 'Disconnected');
  });

  test('processReconnection restores active status', async () => {
    const repository = {
      findInstitutionBillingProfile: jest.fn().mockResolvedValue({
        id: 3,
        status: 'Disconnected',
      }),
      findLatestOpenDisconnection: jest.fn().mockResolvedValue({
        id: 12,
        institution_id: 3,
        status: 'Disconnected',
      }),
      createReconnectionPayment: jest.fn().mockResolvedValue(15),
      markDisconnectionReconnected: jest.fn().mockResolvedValue(undefined),
      updateInstitutionStatus: jest.fn().mockResolvedValue(undefined),
    };

    const result = await paymentService.processReconnection({
      institutionId: 3,
      paymentDate: '2024-04-16',
    }, repository);

    expect(result).toEqual({
      paymentId: 15,
      amount: 1000,
      institutionId: 3,
    });
    expect(repository.updateInstitutionStatus).toHaveBeenCalledWith(3, 'Active');
  });
});
