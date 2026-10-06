<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sg-admin-header">
      <div>
        <h1 class="sg-admin-title">Empresas Aliadas & Nodos de Báscula</h1>
        <p class="sg-admin-sub">
          Administra cooperativas, centros de acopio autorizados y certificación de instrumentos de pesaje.
        </p>
      </div>

      <button
        type="button"
        @click="isModalOpen = true"
        class="sg-btn sg-btn--primary sg-btn--sm"
      >
        <Plus class="w-4 h-4" />
        <span>Registrar Empresa</span>
      </button>
    </div>

    <!-- Table -->
    <CompaniesAdminTable
      :companies="companiesStore.items"
      @toggle-cert="handleToggleCertification"
    />

    <!-- Create Modal -->
    <CompanyFormModal
      v-model="isModalOpen"
      @save="handleCreateCompany"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useAdminCompaniesStore } from '../store/useAdminCompanies.store';
import CompaniesAdminTable from '../components/CompaniesAdminTable.vue';
import CompanyFormModal from '../components/CompanyFormModal.vue';

const companiesStore = useAdminCompaniesStore();
const isModalOpen = ref(false);

async function handleCreateCompany(payload) {
  try {
    await companiesStore.createCompany(payload);
    isModalOpen.value = false;
  } catch (err) {
    // handled in store
  }
}

async function handleToggleCertification(id) {
  try {
    await companiesStore.toggleScaleCertification(id);
  } catch (err) {
    // handled in store
  }
}

onMounted(() => {
  if (companiesStore.items.length === 0) {
    companiesStore.fetchCompanies();
  }
});
</script>
