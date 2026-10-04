<template>
  <div class="w-full max-w-2xl mx-auto space-y-4 pb-12 animate-in fade-in duration-200">
    <!-- Back Button -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="router.push(`/empresas/${route.params.id || ''}`)"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4 stroke-[2]" />
        <span>Volver a empresa</span>
      </button>
    </div>

    <div v-if="empresa" class="space-y-4">
      <div class="bg-white p-5 rounded-md border border-slate-200">
        <h2 class="text-lg font-extrabold text-slate-900">Afiliación a {{ empresa.name }}</h2>
        <p class="text-xs text-slate-500 mt-1">Completa tus datos para vincularte a la base de recolección.</p>
      </div>

      <EmpresaSubscribeForm
        :empresa="empresa"
        :isLoading="empresaStore.isLoading"
        @submit="handleSubscribeSubmit"
      />
    </div>

    <div v-else class="bg-white rounded-md p-10 text-center border border-slate-200">
      <p class="text-sm font-semibold text-slate-600">Empresa no encontrada.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { useEmpresasStore } from '../store/useCompanies.store';
import EmpresaSubscribeForm from '../components/EmpresaSubscribeForm.vue';

const route = useRoute();
const router = useRouter();
const empresaStore = useEmpresasStore();

const empresa = computed(() => {
  return empresaStore.empresas.find((e) => e.id === route.params.id) || empresaStore.empresas[0];
});

function handleSubscribeSubmit(formData) {
  if (!empresa.value) return;
  empresaStore.subscribeToEmpresa(empresa.value, formData);
  router.push('/empresas');
}
</script>
