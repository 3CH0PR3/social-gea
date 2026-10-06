<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="sg-admin-card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
      <div class="flex flex-1 items-center gap-2">
        <div class="relative flex-1 max-w-sm">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por código CANJE-..., usuario o premio..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-900"
          />
        </div>

        <select
          v-model="statusFilter"
          class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-800 font-semibold cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="processing">En preparación</option>
          <option value="ready_for_pickup">Listo para entrega</option>
          <option value="shipped">Despachado</option>
          <option value="delivered">Entregado</option>
        </select>
      </div>

      <div class="text-right text-slate-500 font-semibold shrink-0">
        {{ redemptions.length }} comprobantes
      </div>
    </div>

    <!-- Table -->
    <div class="sg-admin-table-wrapper">
      <table class="sg-admin-table">
        <thead>
          <tr>
            <th>Comprobante / Fecha</th>
            <th>Usuario</th>
            <th>Premio Canjeado</th>
            <th>Modalidad / Entrega</th>
            <th>Puntos</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="red in redemptions" :key="red.voucherCode">
            <td>
              <span class="font-mono text-xs font-black text-slate-900 block">
                {{ red.voucherCode }}
              </span>
              <span class="text-[11px] text-slate-500">{{ red.createdAt }}</span>
            </td>
            <td>
              <span class="font-bold text-slate-900 block leading-tight">{{ red.userName }}</span>
              <span class="text-[11px] text-slate-500">{{ red.userCity }}</span>
            </td>
            <td>
              <div class="flex items-center gap-2.5">
                <img :src="red.rewardImage" :alt="red.rewardTitle" class="w-8 h-8 rounded object-cover border border-slate-100 shrink-0" />
                <span class="font-semibold text-xs text-slate-800 truncate max-w-xs block">
                  {{ red.rewardTitle }}
                </span>
              </div>
            </td>
            <td>
              <span class="font-bold text-xs text-slate-800 block">
                {{ red.deliveryType === 'home_delivery' ? 'Domicilio Nacional' : 'Retiro en Acopio' }}
              </span>
              <span v-if="red.carrierGuide" class="text-[11px] text-slate-500 font-mono block">
                {{ red.carrierGuide }}
              </span>
              <span v-else-if="red.pickupCenter" class="text-[11px] text-slate-500 truncate max-w-xs block">
                {{ red.pickupCenter }}
              </span>
            </td>
            <td>
              <span class="font-black text-amber-800 tabular-nums text-xs">
                -{{ red.pointsDeducted }} Pts
              </span>
            </td>
            <td>
              <span
                :class="{
                  'bg-emerald-50 text-emerald-800 border-emerald-200': red.status === 'delivered',
                  'bg-blue-50 text-blue-800 border-blue-200': red.status === 'shipped',
                  'bg-amber-50 text-amber-900 border-amber-200': red.status === 'ready_for_pickup',
                  'bg-slate-100 text-slate-700 border-slate-200': red.status === 'processing'
                }"
                class="px-2 py-0.5 rounded text-[10px] font-bold border"
              >
                {{ formatStatus(red.status) }}
              </span>
            </td>
            <td>
              <button
                type="button"
                @click="$emit('edit-status', red)"
                class="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Actualizar
              </button>
            </td>
          </tr>

          <tr v-if="redemptions.length === 0">
            <td colspan="7" class="text-center py-8 text-slate-500">
              No hay canjes registrados con estos filtros.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Search } from 'lucide-vue-next';

const props = defineProps({
  redemptions: { type: Array, required: true },
  search: { type: String, default: '' },
  status: { type: String, default: '' },
});

const emit = defineEmits(['update:search', 'update:status', 'edit-status']);

const searchQuery = computed({
  get: () => props.search,
  set: (val) => emit('update:search', val),
});

const statusFilter = computed({
  get: () => props.status,
  set: (val) => emit('update:status', val),
});

function formatStatus(st) {
  const map = {
    processing: 'En preparación',
    ready_for_pickup: 'Listo en sede',
    shipped: 'Despachado',
    delivered: 'Entregado',
  };
  return map[st] || st;
}
</script>
