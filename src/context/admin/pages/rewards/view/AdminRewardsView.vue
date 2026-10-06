<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sg-admin-header">
      <div>
        <h1 class="sg-admin-title">Gestión de Catálogo de Premios</h1>
        <p class="sg-admin-sub">
          Crea, edita y ajusta stock y equivalencias en EcoPuntos y pesos colombianos.
        </p>
      </div>

      <button
        type="button"
        @click="openCreateModal"
        class="sg-btn sg-btn--primary sg-btn--sm"
      >
        <Plus class="w-4 h-4" />
        <span>Crear Nuevo Premio</span>
      </button>
    </div>

    <!-- Table with filters -->
    <RewardsTable
      :rewards="rewardsStore.filteredItems"
      v-model:search="rewardsStore.searchQuery"
      v-model:category="rewardsStore.categoryFilter"
      v-model:status="rewardsStore.statusFilter"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <!-- Create / Edit Modal -->
    <RewardFormModal
      v-model="isFormModalOpen"
      :initialReward="activeReward"
      :isSubmitting="rewardsStore.isLoading"
      @save="handleSaveReward"
    />

    <!-- Delete Confirmation Modal -->
    <RewardDeleteModal
      v-model="isDeleteModalOpen"
      :reward="rewardToDelete"
      :isSubmitting="rewardsStore.isLoading"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useAdminRewardsStore } from '../store/useAdminRewards.store';
import RewardsTable from '../components/RewardsTable.vue';
import RewardFormModal from '../components/RewardFormModal.vue';
import RewardDeleteModal from '../components/RewardDeleteModal.vue';

const rewardsStore = useAdminRewardsStore();

const isFormModalOpen = ref(false);
const activeReward = ref(null);

const isDeleteModalOpen = ref(false);
const rewardToDelete = ref(null);

function openCreateModal() {
  activeReward.value = null;
  isFormModalOpen.value = true;
}

function openEditModal(reward) {
  activeReward.value = { ...reward };
  isFormModalOpen.value = true;
}

function openDeleteModal(reward) {
  rewardToDelete.value = reward;
  isDeleteModalOpen.value = true;
}

async function handleSaveReward(payload) {
  try {
    if (payload.id) {
      await rewardsStore.updateReward(payload.id, payload);
    } else {
      await rewardsStore.createReward(payload);
    }
    isFormModalOpen.value = false;
  } catch (err) {
    // handled in store
  }
}

async function handleConfirmDelete(id) {
  try {
    await rewardsStore.deleteReward(id);
    isDeleteModalOpen.value = false;
  } catch (err) {
    // handled in store
  }
}

onMounted(() => {
  if (rewardsStore.items.length === 0) {
    rewardsStore.fetchRewards();
  }
});
</script>
