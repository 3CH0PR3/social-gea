import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AdminRedemptionsService } from '../services/redemptions.service';

export const useAdminRedemptionsStore = defineStore('admin.redemptions', () => {
  const items = ref([]);
  const isLoading = ref(false);
  const errorMsg = ref(null);
  const searchQuery = ref('');
  const statusFilter = ref('');

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err?.message || 'Error en gestión de canjes';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRedemptions = async () => {
    return executeAsync(async () => {
      const res = await AdminRedemptionsService.list();
      items.value = res;
      return res;
    });
  };

  const updateRedemptionStatus = async (voucherCode, newStatus, carrierGuide) => {
    return executeAsync(async () => {
      const updated = await AdminRedemptionsService.updateStatus(voucherCode, newStatus, carrierGuide);
      const idx = items.value.findIndex((r) => r.voucherCode === voucherCode);
      if (idx !== -1) {
        items.value[idx] = updated;
      }
      return updated;
    });
  };

  const filteredItems = computed(() => {
    return items.value.filter((redemption) => {
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        const matchCode = redemption.voucherCode.toLowerCase().includes(q);
        const matchUser = redemption.userName.toLowerCase().includes(q);
        const matchReward = redemption.rewardTitle.toLowerCase().includes(q);
        if (!matchCode && !matchUser && !matchReward) return false;
      }
      if (statusFilter.value && redemption.status !== statusFilter.value) {
        return false;
      }
      return true;
    });
  });

  return {
    items,
    isLoading,
    errorMsg,
    searchQuery,
    statusFilter,
    filteredItems,
    executeAsync,
    fetchRedemptions,
    updateRedemptionStatus,
  };
});
