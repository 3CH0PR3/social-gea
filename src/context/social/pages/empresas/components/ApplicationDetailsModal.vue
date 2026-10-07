<template>
  <div
    v-if="isOpen && activeSubscription && activeEmpresa"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-white sm:bg-black/60 sm:backdrop-blur-xs animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border border-slate-200 flex flex-col animate-in slide-in-from-bottom duration-200"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 bg-white sticky top-0 z-20 select-none">
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="sm:hidden p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
          </button>
          <div class="flex items-center gap-2">
            <FileText class="w-5 h-5 text-emerald-600" />
            <h3 class="font-bold text-slate-900 text-sm sm:text-base">Detalle de tu Solicitud</h3>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="hidden sm:flex p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <!-- Company Summary Card -->
        <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
          <img :src="activeEmpresa.logo" :alt="activeEmpresa.name" class="w-12 h-12 rounded-xl object-cover border border-emerald-300" />
          <div class="min-w-0 flex-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              Empresa suscrita
            </span>
            <h4 class="font-bold text-slate-900 text-sm truncate mt-0.5">{{ activeEmpresa.name }}</h4>
            <span class="text-xs text-slate-500 font-mono">Solicitud: #{{ activeSubscription.applicationId }}</span>
          </div>
        </div>

        <!-- Submitted Info List (Official Database Record) -->
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span class="text-slate-400 block text-[11px]">NUIS (Id Suscriptor)</span>
              <span class="font-bold text-slate-900 font-mono text-xs">
                {{ activeSubscription?.formData?.nuis || activeSubscription?.nuis || '10928472' }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Numacro (Macro-ruta)</span>
              <span class="font-bold text-slate-900">
                {{ activeSubscription?.formData?.numacro || activeSubscription?.numacro || 'MAC-01' }}
              </span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span class="text-slate-400 block text-[11px]">Dirección del predio</span>
            <span class="font-semibold text-slate-800">{{ activeSubscription?.formData?.address || activeSubscription?.address || 'Calle 72 # 11-45' }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span class="text-slate-400 block text-[11px]">Uso del usuario</span>
              <span class="font-semibold text-indigo-700">
                {{ activeSubscription?.formData?.userUsage || activeSubscription?.userUsage || '1 — Residencial' }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Tipo de usuario</span>
              <span class="font-semibold text-slate-800">
                {{ activeSubscription?.formData?.userType || activeSubscription?.userType || '2 — Pequeño generador' }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Multiusuario</span>
              <span class="font-semibold text-slate-800">
                {{ activeSubscription?.formData?.multiuser || activeSubscription?.multiuser || '2 — No multiusuario' }}
              </span>
            </div>
          </div>

          <div v-if="activeSubscription?.formData?.materialsSelected?.length || activeSubscription?.materialsOffered?.length" class="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span class="text-slate-400 block text-[11px] mb-1.5">Materiales valorizados</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="matId in (activeSubscription?.formData?.materialsSelected || activeSubscription?.materialsOffered || [])"
                :key="typeof matId === 'object' ? matId.label || matId.name : matId"
                class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-medium text-[11px]"
              >
                {{ getMaterialLabel(typeof matId === 'object' ? matId.label || matId.name : matId) }}
              </span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
            <span>Fecha y hora de registro oficial: {{ activeSubscription.subscribedAt }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <XCircle class="w-4 h-4" />
          <span>Cancelar esta suscripción</span>
        </button>

        <button
          type="button"
          @click="$emit('close')"
          class="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-colors cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { X, ArrowLeft, FileText, XCircle } from 'lucide-vue-next';
import { useEmpresaStore } from '../store/empresaStore';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

useBodyScrollLock(() => props.isOpen);

const emit = defineEmits(['close']);
const empresaStore = useEmpresaStore();

const activeSubscription = computed(() => empresaStore.activeSubscription);
const activeEmpresa = computed(() => empresaStore.activeEmpresa);

function getMaterialLabel(matId) {
  if (!activeEmpresa.value) return matId;
  const found = activeEmpresa.value.acceptedMaterials.find((m) => m.id === matId);
  return found ? found.label : matId;
}

function handleCancel() {
  emit('close');
  empresaStore.openCancelConfirm();
}
</script>
