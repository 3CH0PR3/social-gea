import mockDashboard from './mocks/mockAdminDashboard.json';

export const AdminDashboardService = {
  async getDashboardData() {
    // Simulates HTTP request
    await new Promise((resolve) => setTimeout(resolve, 80));
    return JSON.parse(JSON.stringify(mockDashboard));
  },
};
