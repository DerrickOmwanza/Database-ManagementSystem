module.exports = {
  fees: {
    registration: 8500,
    installation: 10000,
    pcUnit: 40000,
    reconnection: 1000,
  },
  discounts: {
    upgrade: 0.10,
  },
  penalties: {
    latePaymentRate: 0.15,
    disconnectionDay: 10,
  },
  institutionTypes: ['Primary', 'Junior', 'Senior', 'College'],
  paymentTypes: ['Registration', 'Installation', 'Monthly', 'Fine', 'Reconnection'],
  paymentStatuses: ['Paid', 'Pending', 'Overdue'],
  institutionStatuses: ['Active', 'Disconnected', 'Suspended'],
  installationStatuses: ['Pending', 'In Progress', 'Completed', 'Not Eligible'],
  bandwidthPackages: [
    { speed: '4 MBPS', monthlyCost: 1200 },
    { speed: '10 MBPS', monthlyCost: 2000 },
    { speed: '20 MBPS', monthlyCost: 3500 },
    { speed: '25 MBPS', monthlyCost: 4000 },
    { speed: '50 MBPS', monthlyCost: 7000 },
  ],
  lanPricingTiers: [
    { minNodes: 2, maxNodes: 10, cost: 10000 },
    { minNodes: 11, maxNodes: 20, cost: 20000 },
    { minNodes: 21, maxNodes: 40, cost: 30000 },
    { minNodes: 41, maxNodes: 100, cost: 40000 },
  ],
};
