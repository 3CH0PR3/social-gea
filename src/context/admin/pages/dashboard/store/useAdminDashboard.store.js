import { ref } from 'vue';
import { defineStore } from 'pinia';
import { AdminDashboardService } from '../services/dashboard.service';

export const useAdminDashboardStore = defineStore('admin.dashboard', () => {
  const data = ref(null);
  const isLoading = ref(false);
  const errorMsg = ref(null);

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err?.message || 'Error al cargar analíticas';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchDashboard = async () => {
    return executeAsync(async () => {
      const res = await AdminDashboardService.getDashboardData();
      data.value = res;
      return res;
    });
  };

  return {
    data,
    isLoading,
    errorMsg,
    executeAsync,
    fetchDashboard,
  };
});
