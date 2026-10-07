<script setup>
import { computed } from 'vue';
import { Layers, Coins, Calendar, Clock, Truck, ShieldAlert } from 'lucide-vue-next';

const props = defineProps({
  empresa: {
    type: Object,
    default: () => ({}),
  },
  materials: {
    type: Array,
    default: () => [],
  },
});

const resolvedMaterials = computed(() => {
  if (Array.isArray(props.materials) && props.materials.length > 0) return props.materials;
  if (Array.isArray(props.empresa?.materials) && props.empresa.materials.length > 0) return props.empresa.materials;
  return ['PET Transparente', 'Cartón Corrugado', 'Aluminio / Latas', 'Vidrio'];
});

const incentiveText = computed(() => {
  return props.empresa?.incentive || props.empresa?.incentiveRate || '+20 Pts por kg de PET';
});
</script>

<template>
  <div class="bg-white rounded-md border border-slate-200 shadow-card p-5 sm:p-6 space-y-5">
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <Layers class="w-5 h-5 text-emerald-700" />
        <h3 class="text-sm font-bold text-slate-900">Materiales aceptados e incentivos</h3>
      </div>
      <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
        {{ incentiveText }}
      </span>
    </div>

    <!-- Materials list -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        v-for="mat in resolvedMaterials"
        :key="typeof mat === 'object' ? mat.label || mat.name : mat"
        class="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors"
      >
        <span class="text-xs font-semibold text-slate-800">{{ typeof mat === 'object' ? mat.label || mat.name : mat }}</span>
        <span class="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
          <Coins class="w-3.5 h-3.5" />
          <span>+20 Pts/kg</span>
        </span>
      </div>
    </div>

    <!-- Logistics and Schedule Info -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
      <div class="p-3 rounded-md bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
        <Clock class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <h4 class="text-xs font-bold text-emerald-900">Horario de recepción</h4>
          <p class="text-[11px] text-emerald-800 mt-0.5">Lunes a Viernes: 8:00 AM - 5:00 PM · Sábados: 8:00 AM - 1:00 PM</p>
        </div>
      </div>

      <div class="p-3 rounded-md bg-slate-50 border border-slate-200 flex items-start gap-2.5">
        <Truck class="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <h4 class="text-xs font-bold text-slate-900">Modalidad de recolección</h4>
          <p class="text-[11px] text-slate-600 mt-0.5">Recepción en punto de acopio o recogida programada a partir de 50 kg</p>
        </div>
      </div>
    </div>
  </div>
</template>
