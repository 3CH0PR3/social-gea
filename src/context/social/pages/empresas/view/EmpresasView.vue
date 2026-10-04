<template>
  <div class="w-full space-y-4 pb-12 animate-in fade-in duration-200">
    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 max-w-sm"
    >
      <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Clean Top Title Header (No stacked cards, pure flat structure) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Empresas sugeridas
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Centros y empresas de reciclaje autorizadas para recolección de materiales
        </p>
      </div>

      <!-- Mobile Search Box (visible only on mobile where the left sidebar is collapsed) -->
      <div class="lg:hidden relative w-full sm:w-64">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          :value="searchQuery"
          @input="setSearch($event.target.value)"
          placeholder="Buscar empresas..."
          class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all"
        />
      </div>
    </div>

    <!-- Suggestion-style Cards Grid (Pure cards, no clutter, no filters) -->
    <div v-if="filteredEmpresas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <EmpresaCard
        v-for="empresa in filteredEmpresas"
        :key="empresa.id"
        :empresa="empresa"
      />
    </div>

    <!-- Clean Empty State if search finds nothing -->
    <div v-else class="bg-white rounded-xl p-10 text-center border border-slate-200 space-y-3">
      <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Building2 class="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 class="font-bold text-slate-800 text-sm">No se encontraron empresas</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        No hay empresas de reciclaje que coincidan con "{{ searchQuery }}".
      </p>
      <button
        type="button"
        @click="setSearch('')"
        class="px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
      >
        Limpiar búsqueda
      </button>
    </div>

    <!-- Modals -->
    <EmpresaSubscribeModal
      :isOpen="isSubscribeModalOpen"
      :empresa="selectedEmpresaForSubscribe"
      @close="closeSubscribe"
    />

    <ApplicationDetailsModal
      :isOpen="isApplicationDetailModalOpen"
      @close="closeApplicationDetails"
    />

    <CancelConfirmModal
      :isOpen="isCancelModalOpen"
      @close="closeCancelConfirm"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Building2, Search, CheckCircle2 } from 'lucide-vue-next';
import { useEmpresaStore } from '../store/empresaStore';
import EmpresaCard from '../components/EmpresaCard.vue';
import EmpresaSubscribeModal from '../components/EmpresaSubscribeModal.vue';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal.vue';
import CancelConfirmModal from '../components/CancelConfirmModal.vue';

const empresaStore = useEmpresaStore();

const filteredEmpresas = computed(() => empresaStore.filteredEmpresas);
const searchQuery = computed(() => empresaStore.searchQuery);
const toastMessage = computed(() => empresaStore.toastMessage);
const isSubscribeModalOpen = computed(() => empresaStore.isSubscribeModalOpen);
const selectedEmpresaForSubscribe = computed(() => empresaStore.selectedEmpresaForSubscribe);
const isApplicationDetailModalOpen = computed(() => empresaStore.isApplicationDetailModalOpen);
const isCancelModalOpen = computed(() => empresaStore.isCancelModalOpen);

function setSearch(val) {
  empresaStore.setSearch(val);
}

function closeSubscribe() {
  empresaStore.closeSubscribe();
}

function closeApplicationDetails() {
  empresaStore.closeApplicationDetails();
}

function closeCancelConfirm() {
  empresaStore.closeCancelConfirm();
}
</script>
