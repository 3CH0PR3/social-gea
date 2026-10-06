<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sg-admin-header">
      <div>
        <h1 class="sg-admin-title">Trazabilidad de Canjes & Vouchers</h1>
        <p class="sg-admin-sub">
          Gestiona comprobantes CANJE-XXXXXX, órdenes de retiro en acopio y guías de transporte nacional.
        </p>
      </div>
    </div>

    <!-- Table -->
    <RedemptionsTable
      :redemptions="redemptionsStore.filteredItems"
      v-model:search="redemptionsStore.searchQuery"
      v-model:status="redemptionsStore.statusFilter"
      @edit-status="openStatusModal"
    />

    <!-- Status Update Modal -->
    <RedemptionStatusModal
      v-model="isModalOpen"
      :redemption="activeRedemption"
      :isSubmitting="redemptionsStore.isLoading"
      @save="handleSaveStatus"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAdminRedemptionsStore } from '../store/useAdminRedemptions.store';
import RedemptionsTable from '../components/RedemptionsTable.vue';
import RedemptionStatusModal from '../components/RedemptionStatusModal.vue';

const redemptionsStore = useAdminRedemptionsStore();
const isModalOpen = ref(false);
const activeRedemption = ref(null);

function openStatusModal(item) {
  activeRedemption.value = item;
  isModalOpen.value = true;
}

async function handleSaveStatus({ voucherCode, status, carrierGuide }) {
  try {
    await redemptionsStore.updateRedemptionStatus(voucherCode, status, carrierGuide);
    isModalOpen.value = false;
  } catch (err) {
    // handled in store
  }
}

onMounted(() => {
  if (redemptionsStore.items.length === 0) {
    redemptionsStore.fetchRedemptions();
  }
});
</script>
