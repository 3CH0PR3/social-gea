import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AdminRewardsService } from '../services/rewards.service';

export const useAdminRewardsStore = defineStore('admin.rewards', () => {
  const items = ref([]);
  const isLoading = ref(false);
  const errorMsg = ref(null);
  const searchQuery = ref('');
  const categoryFilter = ref('');
  const statusFilter = ref('');

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err?.message || 'Error en operación de productos';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRewards = async () => {
    return executeAsync(async () => {
      const res = await AdminRewardsService.list();
      items.value = res;
      return res;
    });
  };

  const createReward = async (payload) => {
    return executeAsync(async () => {
      const created = await AdminRewardsService.create(payload);
      items.value.unshift(created);
      return created;
    });
  };

  const updateReward = async (id, payload) => {
    return executeAsync(async () => {
      const updated = await AdminRewardsService.update(id, payload);
      const idx = items.value.findIndex((r) => r.id === id);
      if (idx !== -1) {
        items.value[idx] = updated;
      }
      return updated;
    });
  };

  const deleteReward = async (id) => {
    return executeAsync(async () => {
      await AdminRewardsService.delete(id);
      items.value = items.value.filter((r) => r.id !== id);
      return id;
    });
  };

  const filteredItems = computed(() => {
    return items.value.filter((reward) => {
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        const matchTitle = reward.title.toLowerCase().includes(q);
        const matchSupplier = reward.supplier?.toLowerCase().includes(q);
        if (!matchTitle && !matchSupplier) return false;
      }
      if (categoryFilter.value && reward.category !== categoryFilter.value) {
        return false;
      }
      if (statusFilter.value && reward.status !== statusFilter.value) {
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
    categoryFilter,
    statusFilter,
    filteredItems,
    executeAsync,
    fetchRewards,
    createReward,
    updateReward,
    deleteReward,
  };
});
