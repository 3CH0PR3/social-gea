<template>
  <div class="sg-admin-card p-5 space-y-4">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div>
        <h4 class="text-sm font-extrabold text-slate-900">
          Municipios con Mayor Impacto
        </h4>
        <span class="text-xs text-slate-500">
          Ranking por volumen de reciclaje captado
        </span>
      </div>
      <span class="text-xs font-bold text-slate-600">
        Top 5 Nacional
      </span>
    </div>

    <div class="space-y-2.5">
      <div
        v-for="item in municipalities"
        :key="item.rank"
        class="p-2.5 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-between border border-slate-100"
      >
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
            #{{ item.rank }}
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-900 leading-tight">
              {{ item.city }}
            </h5>
            <span class="text-[11px] text-slate-500">
              {{ item.department }} · {{ item.companies }} empresas
            </span>
          </div>
        </div>

        <div class="text-right">
          <span class="text-xs font-black text-slate-900 block tabular-nums">
            {{ item.tonnes }} Ton
          </span>
          <span class="text-[10px] text-emerald-800 font-semibold block">
            {{ item.users.toLocaleString('es-CO') }} usuarios
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  municipalities: {
    type: Array,
    required: true,
  },
});
</script>
