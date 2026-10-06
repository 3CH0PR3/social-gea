<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sg-admin-header">
      <div>
        <h1 class="sg-admin-title">Cola de Moderación de la Comunidad</h1>
        <p class="sg-admin-sub">
          Revisa denuncias de usuarios en tiempo real. Oculta posts infractores, advierte o suspende cuentas.
        </p>
      </div>

      <!-- Tabs / Filter -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-bold">
        <button
          type="button"
          @click="moderationStore.activeTab = 'pending'"
          :class="moderationStore.activeTab === 'pending' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          class="px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Pendientes</span>
          <span
            v-if="moderationStore.pendingCount > 0"
            class="px-1.5 py-0.2 bg-red-100 text-red-900 rounded-full text-[10px]"
          >
            {{ moderationStore.pendingCount }}
          </span>
        </button>

        <button
          type="button"
          @click="moderationStore.activeTab = 'resolved'"
          :class="moderationStore.activeTab === 'resolved' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          class="px-3 py-1.5 rounded transition-colors cursor-pointer"
        >
          Resueltos
        </button>

        <button
          type="button"
          @click="moderationStore.activeTab = 'all'"
          :class="moderationStore.activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          class="px-3 py-1.5 rounded transition-colors cursor-pointer"
        >
          Todos
        </button>
      </div>
    </div>

    <!-- Content Type Filter Pills -->
    <div class="flex items-center gap-2 flex-wrap text-xs">
      <span class="text-slate-400 font-bold uppercase text-[10px] mr-1">Filtrar tipo:</span>
      <button
        v-for="t in [
          { id: 'all', label: 'Todos' },
          { id: 'post', label: 'Publicaciones' },
          { id: 'comment', label: 'Comentarios' },
          { id: 'story', label: 'Historias 24h' }
        ]"
        :key="t.id"
        type="button"
        @click="moderationStore.filterType = t.id"
        :class="moderationStore.filterType === t.id ? 'bg-emerald-700 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'"
        class="px-2.5 py-1 rounded-md cursor-pointer transition-colors"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Reports Queue Table / Cards -->
    <ModerationQueueTable
      :reports="moderationStore.filteredReports"
      @resolve="openResolveModal"
    />

    <!-- Action Modal -->
    <ReportActionModal
      v-model="isActionModalOpen"
      :report="activeReport"
      :isSubmitting="moderationStore.isLoading"
      @apply="handleApplyAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAdminModerationStore } from '../store/useAdminModeration.store';
import ModerationQueueTable from '../components/ModerationQueueTable.vue';
import ReportActionModal from '../components/ReportActionModal.vue';

const moderationStore = useAdminModerationStore();

const isActionModalOpen = ref(false);
const activeReport = ref(null);

function openResolveModal(report) {
  activeReport.value = report;
  isActionModalOpen.value = true;
}

async function handleApplyAction({ reportId, action, notes }) {
  try {
    await moderationStore.takeAction(reportId, action, notes);
    isActionModalOpen.value = false;
  } catch (err) {
    // handled in store
  }
}

onMounted(() => {
  if (moderationStore.reports.length === 0) {
    moderationStore.fetchReports();
  }
});
</script>
