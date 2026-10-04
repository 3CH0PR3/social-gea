<template>
  <div
    v-if="isOpen && activeEmpresa"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
      @click.stop
    >
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <AlertTriangle class="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <h3 class="font-bold text-slate-900 text-base">
            ¿Cancelar suscripción?
          </h3>
          <span class="text-xs text-slate-500">
            {{ activeEmpresa.name }}
          </span>
        </div>
      </div>

      <div class="space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        <p>
          Al cancelar tu suscripción actual con <strong>{{ activeEmpresa.name }}</strong>:
        </p>
        <ul class="space-y-1 list-disc list-inside text-slate-700">
          <li>Se anulará el retiro o entrega programada con esta empresa.</li>
          <li><strong>Se volverán a habilitar inmediatamente todos los botones</strong> de las demás empresas para que puedas enviar solicitud a la que elijas.</li>
          <li>Tus datos básicos quedarán precargados para tu conveniencia en el próximo formulario.</li>
        </ul>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Mantener mi suscripción
        </button>
        <button
          type="button"
          @click="confirmCancel"
          class="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <XCircle class="w-4 h-4" />
          <span>Confirmar y Cancelar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { AlertTriangle, XCircle } from 'lucide-vue-next';
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

const activeEmpresa = computed(() => empresaStore.activeEmpresa);

function confirmCancel() {
  empresaStore.cancelSubscription();
}
</script>
