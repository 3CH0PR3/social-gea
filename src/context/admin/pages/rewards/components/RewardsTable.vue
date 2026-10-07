<template>
  <div class="space-y-4">
    <!-- Filter Controls Bar -->
    <div class="sg-admin-card p-3 sm:p-4 flex flex-col gap-2.5 text-xs">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div class="relative flex-1 max-w-sm">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por título o proveedor..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
          />
        </div>

        <div class="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <select
            v-model="categoryFilter"
            class="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-800 font-semibold cursor-pointer"
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
            class="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-800 font-semibold cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="draft">Borrador</option>
            <option value="out_of_stock">Agotado</option>
          </select>
        </div>

        <div class="text-right text-slate-500 font-semibold shrink-0 text-[11px] sm:text-xs">
          {{ rewards.length }} productos
        </div>
      </div>
    </div>

    <!-- Vista Móvil Android (< 640px): Filas con divisores limpias, sin scrolls horizontales rotos -->
    <div class="sm:hidden space-y-3">
      <div
        v-for="item in rewards"
        :key="'mob-' + item.id"
        class="sg-admin-card p-3.5 space-y-3"
      >
        <div class="flex items-start gap-3">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-14 h-14 rounded-md object-cover border border-slate-200 shrink-0"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 flex-wrap mb-1">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                {{ item.category }}
              </span>
              <span
                :class="{
                  'bg-emerald-50 text-emerald-800 border-emerald-200': item.status === 'active',
                  'bg-slate-100 text-slate-600 border-slate-200': item.status === 'draft',
                  'bg-red-50 text-red-700 border-red-200': item.status === 'out_of_stock'
                }"
                class="px-1.5 py-0.5 rounded text-[10px] font-bold border"
              >
                {{ formatStatus(item.status) }}
              </span>
            </div>

            <h4 class="font-bold text-xs text-slate-900 leading-tight">
              {{ item.title }}
            </h4>
            <span class="text-[10.5px] text-slate-500 block mt-0.5 truncate">
              {{ item.supplier }} · {{ item.recyclingEquivalent }}
            </span>
          </div>
        </div>

        <!-- Metrics row -->
        <div class="grid grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-md text-center text-xs">
          <div>
            <span class="text-[10px] text-slate-500 block">EcoPuntos</span>
            <strong class="text-amber-800 font-extrabold tabular-nums">
              {{ item.pointsPrice.toLocaleString('es-CO') }}
            </strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">Precio COP</span>
            <span class="font-bold text-slate-800 tabular-nums">
              ${{ item.priceCOP?.toLocaleString('es-CO') }}
            </span>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">Stock</span>
            <span
              :class="item.stock > 0 ? 'text-slate-900 font-bold' : 'text-red-700 font-black'"
              class="tabular-nums"
            >
              {{ item.stock }} un.
            </span>
          </div>
        </div>

        <!-- Action buttons row -->
        <div class="flex items-center gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            @click="$emit('edit', item)"
            class="sg-btn sg-btn--secondary sg-btn--sm flex-1"
          >
            <Edit2 class="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            @click="$emit('delete', item)"
            class="sg-btn sg-btn--danger sg-btn--sm px-3"
            title="Eliminar producto"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div v-if="rewards.length === 0" class="sg-admin-card p-6 text-center text-slate-500 text-xs">
        No se encontraron productos con estos filtros.
      </div>
    </div>

    <!-- Table Desktop (>= 640px) -->
    <div class="hidden sm:block sg-admin-table-wrapper">
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
