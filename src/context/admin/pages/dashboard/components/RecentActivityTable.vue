<template>
  <div class="sg-admin-card overflow-hidden">
    <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h4 class="text-sm font-extrabold text-slate-900">
          Actividad en Tiempo Real
        </h4>
        <span class="text-xs text-slate-500">
          Últimos pesajes, canjes y alertas en el sistema
        </span>
      </div>
      <span class="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-600" />
        Sincronizado
      </span>
    </div>

    <!-- Vista Móvil Android (< 640px): Lista nativa sin scroll horizontal forzado -->
    <div class="sm:hidden divide-y divide-slate-100">
      <div
        v-for="act in activities"
        :key="'act-mob-' + act.id"
        class="p-3.5 space-y-2"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div v-if="act.avatar" class="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0">
              <img :src="act.avatar" :alt="act.user" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
              ⚠️
            </div>
            <div>
              <span class="font-bold text-xs text-slate-900 block leading-tight">{{ act.user }}</span>
              <span class="text-[10px] text-slate-400 font-mono">{{ act.id }}</span>
            </div>
          </div>

          <span
            :class="{
              'bg-emerald-50 text-emerald-800 border-emerald-200': act.status === 'verified',
              'bg-amber-50 text-amber-800 border-amber-200': act.status === 'processing',
              'bg-red-50 text-red-700 border-red-200': act.status === 'pending_review',
              'bg-blue-50 text-blue-700 border-blue-200': act.status === 'pending_validation'
            }"
            class="px-2 py-0.5 rounded text-[10px] font-bold border"
          >
            {{ formatStatus(act.status) }}
          </span>
        </div>

        <div class="text-xs text-slate-700">
          <span>{{ act.detail }}</span>
          <span class="text-slate-400 block text-[11px] mt-0.5">
            📍 {{ act.company || 'Sistema' }} · {{ act.city }}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-50 text-slate-500">
          <span class="text-[11px]">{{ act.timestamp }}</span>
          <span
            v-if="act.points"
            :class="act.points.startsWith('+') ? 'text-emerald-800 font-extrabold' : 'text-amber-800 font-extrabold'"
            class="tabular-nums"
          >
            {{ act.points }}
          </span>
          <span v-else-if="act.voucher" class="font-mono text-xs font-bold text-slate-800">
            {{ act.voucher }}
          </span>
        </div>
      </div>
    </div>

    <!-- Table Desktop (>= 640px) -->
    <div class="hidden sm:block sg-admin-table-wrapper border-0 rounded-none">
      <table class="sg-admin-table">
        <thead>
          <tr>
            <th>Evento / Usuario</th>
            <th>Empresa / Ubicación</th>
            <th>Detalle</th>
            <th>Puntos / Voucher</th>
            <th>Estado</th>
            <th>Tiempo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="act in activities" :key="act.id">
            <td>
              <div class="flex items-center gap-2.5">
                <div v-if="act.avatar" class="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <img :src="act.avatar" :alt="act.user" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                  ⚠️
                </div>
                <div>
                  <span class="font-bold text-slate-900 block leading-tight">{{ act.user }}</span>
                  <span class="text-[10px] text-slate-400 uppercase font-mono">{{ act.id }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="font-semibold text-slate-800 block">{{ act.company || 'Sistema' }}</span>
              <span class="text-[11px] text-slate-500">{{ act.city }}</span>
            </td>
            <td>
              <span class="text-xs text-slate-700">{{ act.detail }}</span>
            </td>
            <td>
              <span
                v-if="act.points"
                :class="act.points.startsWith('+') ? 'text-emerald-800 font-extrabold' : 'text-amber-800 font-extrabold'"
                class="tabular-nums"
              >
                {{ act.points }}
              </span>
              <span v-else-if="act.voucher" class="font-mono text-xs font-bold text-slate-800">
                {{ act.voucher }}
              </span>
              <span v-else class="text-slate-400 text-xs">—</span>
            </td>
            <td>
              <span
                :class="{
                  'bg-emerald-50 text-emerald-800': act.status === 'verified',
                  'bg-amber-50 text-amber-800': act.status === 'processing',
                  'bg-red-50 text-red-700': act.status === 'pending_review',
                  'bg-blue-50 text-blue-700': act.status === 'pending_validation'
                }"
                class="px-2 py-0.5 rounded text-[10px] font-bold"
              >
                {{ formatStatus(act.status) }}
              </span>
            </td>
            <td class="text-xs text-slate-500 whitespace-nowrap">
              {{ act.timestamp }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    required: true,
  },
});

function formatStatus(status) {
  const map = {
    verified: 'Verificado',
    processing: 'En proceso',
    pending_review: 'Revisión',
    pending_validation: 'Validación',
  };
  return map[status] || status;
}
</script>
