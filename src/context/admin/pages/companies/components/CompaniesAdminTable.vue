<template>
  <div class="space-y-4">
    <!-- Vista Móvil Android (< 640px): Tarjetas nativas sin desbordes -->
    <div class="sm:hidden space-y-3">
      <div
        v-for="comp in companies"
        :key="'mob-' + comp.id"
        class="sg-admin-card p-3.5 space-y-3"
      >
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
            <Building2 class="w-5 h-5" />
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="font-extrabold text-xs text-slate-900 leading-tight">
              {{ comp.name }}
            </h4>
            <span class="text-[11px] text-slate-500 font-mono block mt-0.5">
              NIT: {{ comp.nit }}
            </span>
            <span class="text-[11px] text-slate-600 block mt-0.5">
              📍 {{ comp.municipality }}, {{ comp.department }}
            </span>
            <span class="text-[10px] text-slate-400 block truncate">
              {{ comp.address }}
            </span>
          </div>
        </div>

        <!-- Badges & Metrics -->
        <div class="grid grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-md text-center text-xs">
          <div>
            <span class="text-[10px] text-slate-500 block">Báscula</span>
            <div class="flex items-center justify-center gap-1 mt-0.5">
              <span
                :class="comp.scaleCertified ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'"
                class="px-1.5 py-0.5 rounded text-[9.5px] font-bold border font-mono"
              >
                {{ comp.scaleId }}
              </span>
              <span v-if="comp.scaleCertified" class="text-emerald-700 text-xs">✓</span>
            </div>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">Afiliados</span>
            <span class="font-bold text-slate-800 tabular-nums">
              {{ comp.registeredUsersCount }}
            </span>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">Procesado</span>
            <span class="font-black text-slate-900 tabular-nums">
              {{ comp.tonnesProcessed }} Ton
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span class="text-[11px] text-emerald-800 font-bold">
            🌱 {{ comp.incentiveRate }}
          </span>

          <button
            type="button"
            @click="$emit('toggle-cert', comp.id)"
            :class="comp.scaleCertified ? 'sg-btn--secondary text-amber-800' : 'sg-btn--primary'"
            class="sg-btn sg-btn--sm"
          >
            {{ comp.scaleCertified ? 'Inactivar báscula' : 'Validar báscula' }}
          </button>
        </div>
      </div>

      <div v-if="companies.length === 0" class="sg-admin-card p-6 text-center text-slate-500 text-xs">
        No hay empresas registradas.
      </div>
    </div>

    <!-- Table Desktop (>= 640px) -->
    <div class="hidden sm:block sg-admin-table-wrapper">
      <table class="sg-admin-table">
        <thead>
          <tr>
            <th>Empresa / Razón Social</th>
            <th>Ubicación / Sede</th>
            <th>Báscula Certificada</th>
            <th>Usuarios Afiliados</th>
            <th>Procesado</th>
            <th>Tasa de Incentivo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comp in companies" :key="comp.id">
            <td>
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <Building2 class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <span class="font-bold text-slate-900 block leading-tight truncate max-w-xs">
                    {{ comp.name }}
                  </span>
                  <span class="text-[11px] text-slate-500 font-mono">
                    NIT: {{ comp.nit }}
                  </span>
                </div>
              </div>
            </td>
            <td>
              <span class="font-bold text-slate-800 block text-xs">
                {{ comp.municipality }}, {{ comp.department }}
              </span>
              <span class="text-[11px] text-slate-500 block truncate max-w-xs">
                {{ comp.address }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-1.5">
                <span
                  :class="comp.scaleCertified ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'"
                  class="px-2 py-0.5 rounded text-[10px] font-bold border font-mono"
                >
                  {{ comp.scaleId }}
                </span>
                <span v-if="comp.scaleCertified" class="text-emerald-700 text-xs" title="Certificada">✓</span>
              </div>
            </td>
            <td>
              <span class="tabular-nums font-bold text-slate-800 text-xs">
                {{ comp.registeredUsersCount }} usuarios
              </span>
            </td>
            <td>
              <span class="tabular-nums font-black text-slate-900 text-xs">
                {{ comp.tonnesProcessed }} Ton
              </span>
            </td>
            <td>
              <span class="text-xs text-emerald-800 font-semibold">
                {{ comp.incentiveRate }}
              </span>
            </td>
            <td>
              <button
                type="button"
                @click="$emit('toggle-cert', comp.id)"
                :class="comp.scaleCertified ? 'text-amber-700 hover:text-amber-900' : 'text-emerald-700 hover:text-emerald-900'"
                class="text-xs font-bold underline cursor-pointer"
              >
                {{ comp.scaleCertified ? 'Inactivar báscula' : 'Validar báscula' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Building2 } from 'lucide-vue-next';

defineProps({
  companies: {
    type: Array,
    required: true,
  },
});

defineEmits(['toggle-cert']);
</script>
