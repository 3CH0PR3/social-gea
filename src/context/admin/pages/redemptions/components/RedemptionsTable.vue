<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="sg-admin-card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
      <div class="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2">
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

      <div class="text-right text-slate-500 font-semibold shrink-0 text-[11px] sm:text-xs">
        {{ redemptions.length }} comprobantes
      </div>
    </div>

    <!-- Vista Móvil Android (< 640px): Tarjetas nativas ordenadas -->
    <div class="sm:hidden space-y-3">
      <div
        v-for="red in redemptions"
        :key="'mob-' + red.voucherCode"
        class="sg-admin-card p-3.5 space-y-3"
      >
        <!-- Header: Voucher & Status -->
        <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div>
            <span class="font-mono text-xs font-black text-slate-900 block">
              {{ red.voucherCode }}
            </span>
            <span class="text-[10.5px] text-slate-400 font-medium">{{ red.createdAt }}</span>
          </div>

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
        </div>

        <!-- User & Product details -->
        <div class="space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900">{{ red.userName }}</span>
            <span class="text-[11px] text-slate-500">📍 {{ red.userCity }}</span>
          </div>

          <div class="flex items-center gap-2.5 p-2 bg-slate-50 rounded-md border border-slate-100">
            <img
              :src="red.rewardImage"
              :alt="red.rewardTitle"
              class="w-10 h-10 rounded object-cover border border-slate-200 shrink-0"
            />
            <div class="min-w-0 flex-1">
              <span class="font-bold text-xs text-slate-900 truncate block">{{ red.rewardTitle }}</span>
              <span class="text-[10.5px] text-slate-500 block truncate">
                {{ red.deliveryType === 'home_delivery' ? 'Domicilio nacional' : 'Retiro en acopio' }}
                {{ red.carrierGuide ? `· Guía: ${red.carrierGuide}` : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Points & Action -->
        <div class="flex items-center justify-between pt-1">
          <div>
            <span class="text-[10px] text-slate-400 block font-semibold">PUNTOS CANJEADOS</span>
            <span class="font-black text-amber-800 tabular-nums text-xs">
              -{{ red.pointsDeducted }} Pts
            </span>
          </div>

          <button
            type="button"
            @click="$emit('edit-status', red)"
            class="sg-btn sg-btn--primary sg-btn--sm"
          >
            <span>Actualizar Estado</span>
          </button>
        </div>
      </div>

      <div v-if="redemptions.length === 0" class="sg-admin-card p-6 text-center text-slate-500 text-xs">
        No hay canjes registrados con estos filtros.
      </div>
    </div>

    <!-- Table Desktop (>= 640px) -->
    <div class="hidden sm:block sg-admin-table-wrapper">
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
