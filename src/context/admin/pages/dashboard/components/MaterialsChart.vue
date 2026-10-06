<template>
  <div class="sg-admin-card p-5 space-y-4">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div>
        <h4 class="text-sm font-extrabold text-slate-900">
          Distribución de Materiales en Básculas
        </h4>
        <span class="text-xs text-slate-500">
          Clasificación certificada acumulada en Colombia
        </span>
      </div>
      <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
        412.8 Ton Total
      </span>
    </div>

    <!-- Materials Breakdown List -->
    <div class="space-y-3.5">
      <div v-for="mat in materials" :key="mat.id" class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: mat.color }" />
            <span class="font-bold text-slate-800">{{ mat.name }}</span>
          </div>
          <div class="flex items-center gap-2 font-bold tabular-nums">
            <span class="text-slate-900">{{ (mat.kg / 1000).toFixed(1) }} Ton</span>
            <span class="text-slate-400">({{ mat.percentage }}%)</span>
          </div>
        </div>

        <!-- Bar meter -->
        <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300"
            :style="{ width: `${mat.percentage}%`, backgroundColor: mat.color }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  materials: {
    type: Array,
    required: true,
  },
});
</script>
