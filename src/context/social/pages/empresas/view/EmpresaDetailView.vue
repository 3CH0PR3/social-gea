<template>
  <div class="w-full max-w-4xl mx-auto space-y-4 pb-12 animate-in fade-in duration-200">
    <!-- Back Button -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="router.push('/empresas')"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4 stroke-[2]" />
        <span>Volver a empresas</span>
      </button>
    </div>

    <!-- Empresa Header Card -->
    <div v-if="empresa" class="space-y-4">
      <EmpresaHeader
        :empresa="empresa"
        :isSubscribed="isSubscribed"
        @subscribe="handleOpenSubscribe"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EmpresaMaterials :materials="empresa.materials" />
        <EmpresaImpact :impact="empresa.impactMetrics" :companyName="empresa.name" />
      </div>
    </div>

    <div v-else class="bg-white rounded-md p-10 text-center border border-slate-200">
      <p class="text-sm font-semibold text-slate-600">Empresa no encontrada.</p>
    </div>

    <EmpresaSubscribeModal
      :isOpen="isSubscribeModalOpen"
      :empresa="empresa"
      @close="isSubscribeModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { useEmpresasStore } from '../store/useCompanies.store';
import EmpresaHeader from '../components/EmpresaHeader.vue';
import EmpresaMaterials from '../components/EmpresaMaterials.vue';
import EmpresaImpact from '../components/EmpresaImpact.vue';
import EmpresaSubscribeModal from '../components/EmpresaSubscribeModal.vue';

const route = useRoute();
const router = useRouter();
const empresaStore = useEmpresasStore();

const isSubscribeModalOpen = ref(false);

const empresa = computed(() => {
  return empresaStore.empresas.find((e) => e.id === route.params.id) || empresaStore.empresas[0];
});

const isSubscribed = computed(() => {
  return empresaStore.activeSubscription?.companyId === empresa.value?.id;
});

function handleOpenSubscribe() {
  isSubscribeModalOpen.value = true;
}
</script>
