<template>
  <div
    v-if="activeSubscription && activeEmpresa"
    class="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-md border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200"
  >
    <div class="flex items-center gap-3.5">
      <div class="w-14 h-14 rounded-2xl bg-white p-1 shrink-0 shadow-sm border border-emerald-500/40">
        <img
          :src="activeEmpresa.logo"
          :alt="activeEmpresa.name"
          class="w-full h-full object-cover rounded-xl"
        />
      </div>

      <div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-xs">
            <CheckCircle2 class="w-3 h-3" />
            Suscripción Activa
          </span>
          <span class="text-xs text-emerald-300 font-mono">
            #{{ activeSubscription.applicationId }}
          </span>
        </div>

        <h3 class="text-base sm:text-lg font-bold text-white leading-tight mt-1">
          {{ activeEmpresa.name }}
        </h3>

        <p class="text-xs text-emerald-200/90 mt-0.5 flex flex-wrap items-center gap-2">
          <span>Modalidad: {{ activeSubscription.formData.deliveryMode === 'domicilio' ? 'Retiro a domicilio' : 'Punto limpio' }}</span>
          <span>•</span>
          <span>Frecuencia: {{ activeSubscription.formData.frequency }}</span>
          <span>•</span>
          <span>Desde: {{ activeSubscription.subscribedAt }}</span>
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 shrink-0 self-end md:self-center">
      <!-- Ver mi solicitud enviada -->
      <button
        type="button"
        @click="empresaStore.openApplicationDetails"
        class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
        title="Consultar los datos de tu solicitud enviada"
      >
        <FileText class="w-3.5 h-3.5" />
        <span>Ver mi solicitud</span>
      </button>

      <!-- Cancelar suscripción -->
      <button
        type="button"
        @click="empresaStore.openCancelConfirm"
        class="px-3.5 py-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        title="Cancelar suscripción para habilitar las demás empresas"
      >
        <XCircle class="w-3.5 h-3.5" />
        <span>Cancelar suscripción</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CheckCircle2, FileText, XCircle } from 'lucide-vue-next';
import { useEmpresaStore } from '../store/empresaStore';

const empresaStore = useEmpresaStore();
const activeSubscription = computed(() => empresaStore.activeSubscription);
const activeEmpresa = computed(() => empresaStore.activeEmpresa);
</script>
