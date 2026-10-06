import { ref } from 'vue';
import { defineStore } from 'pinia';
import { AdminCompaniesService } from '../services/companies.service';

export const useAdminCompaniesStore = defineStore('admin.companies', () => {
  const items = ref([]);
  const isLoading = ref(false);
  const errorMsg = ref(null);

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err?.message || 'Error en empresas aliadas';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCompanies = async () => {
    return executeAsync(async () => {
      const res = await AdminCompaniesService.list();
      items.value = res;
      return res;
    });
  };

  const createCompany = async (payload) => {
    return executeAsync(async () => {
      const created = await AdminCompaniesService.create(payload);
      items.value.unshift(created);
      return created;
    });
  };

  const toggleScaleCertification = async (id) => {
    return executeAsync(async () => {
      const updated = await AdminCompaniesService.toggleCertification(id);
      const idx = items.value.findIndex((c) => c.id === id);
      if (idx !== -1) {
        items.value[idx] = updated;
      }
      return updated;
    });
  };

  return {
    items,
    isLoading,
    errorMsg,
    executeAsync,
    fetchCompanies,
    createCompany,
    toggleScaleCertification,
  };
});
