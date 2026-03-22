async function getReportsDashboard(repository) {
  const [
    registeredInstitutions,
    defaulters,
    disconnections,
    infrastructureRecords,
    financialByInstitution,
    financialByType,
    upgradeHistory,
    auditLog,
  ] = await Promise.all([
    repository.getRegisteredInstitutions(),
    repository.getDefaulters(),
    repository.getDisconnections(),
    repository.getInfrastructureReport(),
    repository.getFinancialSummaryByInstitution(),
    repository.getFinancialSummaryByType(),
    repository.getUpgradeHistory(),
    repository.getAuditLog(),
  ]);

  const overallFinancialTotals = financialByInstitution.reduce((totals, row) => ({
    registrationTotal: totals.registrationTotal + Number(row.registration_total),
    installationTotal: totals.installationTotal + Number(row.installation_total),
    monthlyTotal: totals.monthlyTotal + Number(row.monthly_total),
    fineTotal: totals.fineTotal + Number(row.fine_total),
    reconnectionTotal: totals.reconnectionTotal + Number(row.reconnection_total),
    paidTotal: totals.paidTotal + Number(row.paid_total),
  }), {
    registrationTotal: 0,
    installationTotal: 0,
    monthlyTotal: 0,
    fineTotal: 0,
    reconnectionTotal: 0,
    paidTotal: 0,
  });

  return {
    registeredInstitutions,
    defaulters,
    disconnections,
    infrastructureRecords,
    financialByInstitution,
    financialByType,
    overallFinancialTotals,
    upgradeHistory,
    auditLog,
  };
}

module.exports = {
  getReportsDashboard,
};
