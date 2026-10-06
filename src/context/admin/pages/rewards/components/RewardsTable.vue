<template>
  <div class="space-y-4">
    <!-- Filter Controls Bar -->
    <div class="sg-admin-card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
      <div class="flex flex-1 items-center gap-2">
        <div class="relative flex-1 max-w-sm">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por título o proveedor..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
          />
        </div>

        <select
          v-model="categoryFilter"
          class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-800 font-semibold cursor-pointer"
        >
          <option value="">Todas las categorías</option>
          <option value="Electrodomésticos">Electrodomésticos</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Hogar">Hogar</option>
          <option value="Movilidad">Movilidad</option>
          <option value="Cuidado Personal">Cuidado Personal</option>
        </select>

        <select
          v-model="statusFilter"
          class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-800 font-semibold cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="draft">Borrador</option>
          <option value="out_of_stock">Agotado</option>
        </select>
      </div>

      <div class="text-right text-slate-500 font-semibold shrink-0">
        {{ rewards.length }} productos
      </div>
    </div>

    <!-- Table -->
    <div class="sg-admin-table-wrapper">
      <table class="sg-admin-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>EcoPuntos</th>
            <th>Equivalencia COP</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rewards" :key="item.id">
            <td>
              <div class="flex items-center gap-3">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0"
                />
                <div class="min-w-0">
                  <h4 class="font-bold text-slate-900 leading-tight truncate max-w-xs sm:max-w-md">
                    {{ item.title }}
                  </h4>
                  <span class="text-[11px] text-slate-500 block truncate">
                    {{ item.supplier }} · {{ item.recyclingEquivalent }}
                  </span>
                </div>
              </div>
            </td>
            <td>
              <span class="text-xs font-semibold text-slate-700">
                {{ item.category }}
              </span>
            </td>
            <td>
              <strong class="text-amber-800 font-black tabular-nums">
                {{ item.pointsPrice.toLocaleString('es-CO') }} Pts
              </strong>
            </td>
            <td>
              <span class="text-xs font-bold text-slate-800 tabular-nums">
                $ {{ item.priceCOP?.toLocaleString('es-CO') }} COP
              </span>
            </td>
            <td>
              <span
                :class="item.stock > 0 ? 'text-slate-900 font-bold' : 'text-red-700 font-black'"
                class="tabular-nums text-xs"
              >
                {{ item.stock }} un.
              </span>
            </td>
            <td>
              <span
                :class="{
                  'bg-emerald-50 text-emerald-800 border-emerald-200': item.status === 'active',
                  'bg-slate-100 text-slate-600 border-slate-200': item.status === 'draft',
                  'bg-red-50 text-red-700 border-red-200': item.status === 'out_of_stock'
                }"
                class="px-2 py-0.5 rounded text-[10px] font-bold border"
              >
                {{ formatStatus(item.status) }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  @click="$emit('edit', item)"
                  class="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title="Editar producto"
                >
                  <Edit2 class="w-4 h-4" />
                </button>

                <button
                  type="button"
                  @click="$emit('delete', item)"
                  class="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-700 cursor-pointer"
                  title="Eliminar producto"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="rewards.length === 0">
            <td colspan="7" class="text-center py-8 text-slate-500">
              No se encontraron productos con estos filtros.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Search, Edit2, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  rewards: { type: Array, required: true },
  search: { type: String, default: '' },
  category: { type: String, default: '' },
  status: { type: String, default: '' },
});

const emit = defineEmits(['update:search', 'update:category', 'update:status', 'edit', 'delete']);

const searchQuery = computed({
  get: () => props.search,
  set: (val) => emit('update:search', val),
});

const categoryFilter = computed({
  get: () => props.category,
  set: (val) => emit('update:category', val),
});

const statusFilter = computed({
  get: () => props.status,
  set: (val) => emit('update:status', val),
});

function formatStatus(st) {
  const map = {
    active: 'Activo',
    draft: 'Borrador',
    out_of_stock: 'Agotado',
  };
  return map[st] || st;
}
</script>
