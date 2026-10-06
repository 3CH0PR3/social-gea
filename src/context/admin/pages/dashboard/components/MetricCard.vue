<template>
  <div class="sg-admin-card p-4 sm:p-5 flex items-start justify-between">
    <div>
      <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block">
        {{ label }}
      </span>
      <h3 class="text-xl sm:text-2xl font-black text-slate-900 mt-1 tabular-nums">
        {{ value }}
      </h3>
      <div v-if="delta" class="flex items-center gap-1.5 mt-2 text-xs font-bold">
        <span
          :class="isNegative ? 'text-red-700 bg-red-50' : 'text-emerald-800 bg-emerald-50'"
          class="px-1.5 py-0.5 rounded"
        >
          {{ delta }}
        </span>
        <span class="text-slate-400 font-medium">vs mes anterior</span>
      </div>
    </div>

    <div
      :class="iconBg || 'bg-slate-100 text-slate-700'"
      class="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
    >
      <component :is="icon" class="w-5 h-5" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  delta: { type: String, default: '' },
  isNegative: { type: Boolean, default: false },
  icon: { type: Object, required: true },
  iconBg: { type: String, default: '' },
});
</script>
