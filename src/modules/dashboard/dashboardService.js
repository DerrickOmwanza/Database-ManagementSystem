async function getDashboardData(repository) {
  const [summary, recentActivity] = await Promise.all([
    repository.getSummary(),
    repository.getRecentActivity(),
  ]);

  return {
    ...summary,
    recentActivity,
  };
}

module.exports = {
  getDashboardData,
};
