<template>
  <div class="sg-admin-table-wrapper">
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
