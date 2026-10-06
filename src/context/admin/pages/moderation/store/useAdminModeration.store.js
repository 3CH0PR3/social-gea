import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AdminModerationService } from '../services/moderation.service';

export const useAdminModerationStore = defineStore('admin.moderation', () => {
  const reports = ref([]);
  const isLoading = ref(false);
  const errorMsg = ref(null);
  const activeTab = ref('pending'); // 'pending' | 'resolved' | 'all'
  const filterType = ref('all'); // 'all' | 'post' | 'comment' | 'story'

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err?.message || 'Error en moderación';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchReports = async () => {
    return executeAsync(async () => {
      const res = await AdminModerationService.list();
      reports.value = res;
      return res;
    });
  };

  const takeAction = async (reportId, actionType, notes) => {
    return executeAsync(async () => {
      const updated = await AdminModerationService.applyAction(reportId, actionType, notes);
      const idx = reports.value.findIndex((r) => r.id === reportId);
      if (idx !== -1) {
        reports.value[idx] = updated;
      }
      return updated;
    });
  };

  const pendingCount = computed(() => {
    return reports.value.filter((r) => r.status === 'pending').length;
  });

  const filteredReports = computed(() => {
    return reports.value.filter((report) => {
      if (activeTab.value === 'pending' && report.status !== 'pending') return false;
      if (activeTab.value === 'resolved' && report.status === 'pending') return false;
      if (filterType.value !== 'all' && report.targetType !== filterType.value) return false;
      return true;
    });
  });

  return {
    reports,
    isLoading,
    errorMsg,
    activeTab,
    filterType,
    pendingCount,
    filteredReports,
    executeAsync,
    fetchReports,
    takeAction,
  };
});
