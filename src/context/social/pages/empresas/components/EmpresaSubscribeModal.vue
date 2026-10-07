<template>
  <div
    v-if="isOpen && empresa"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-150"
      @click.stop
    >
      <!-- Modal Header (Matches Image 1) -->
      <div class="flex items-start justify-between p-5 pb-4 border-b border-slate-100 select-none">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <UserPlus class="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 leading-tight">
              Nuevo registro
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Complete el formulario de registro.
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form Body (2-column layout matching Image 1) -->
      <form @submit.prevent="handleSubmit" class="p-5 sm:p-6 space-y-4">
        <!-- Badge with Selected Company -->
        <div class="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-slate-400 text-[11px]">Empresa receptora:</span>
            <span class="font-bold text-slate-800 truncate">{{ empresa.name }}</span>
          </div>
          <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md shrink-0">
            Base de datos oficial
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- 1. Numacro * -->
          <SearchableSelect
            v-model="form.numacro"
            label="Numacro"
            placeholder="Seleccione un numacro"
            :options="NUMACRO_OPTIONS"
            :required="true"
          />

          <!-- 2. Nuis * -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Nuis <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.nuis"
              placeholder="Ingrese el NUIS"
              required
              class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200/90 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 transition-all placeholder-slate-400"
            />
          </div>

          <!-- 3. Dirección * -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Dirección <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.address"
              placeholder="Ingrese la dirección"
              required
              class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200/90 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 transition-all placeholder-slate-400"
            />
          </div>

          <!-- 4. Uso del usuario * -->
          <SearchableSelect
            v-model="form.userUsage"
            label="Uso del usuario"
            placeholder="Seleccione un uso del usuario"
            :options="USO_USUARIO_OPTIONS"
            :required="true"
          />

          <!-- 5. Tipo de usuario * -->
          <SearchableSelect
            v-model="form.userType"
            label="Tipo de usuario"
            placeholder="Seleccione un tipo de usuario"
            :options="TIPO_USUARIO_OPTIONS"
            :required="true"
          />

          <!-- 6. Multiusuario * -->
          <SearchableSelect
            v-model="form.multiuser"
            label="Multiusuario"
            placeholder="Seleccione un tipo de usuario"
            :options="MULTIUSUARIO_OPTIONS"
            :required="true"
          />
        </div>

        <!-- Footer Actions (Matches Image 1: Cancelar + Registrar) -->
        <div class="pt-4 mt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            :disabled="!isFormValid"
            class="px-6 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Registrar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { X, UserPlus } from 'lucide-vue-next';
import { useEmpresaStore } from '../store/empresaStore';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import SearchableSelect from '@/shared/components/SearchableSelect.vue';
import {
  NUMACRO_OPTIONS,
  USO_USUARIO_OPTIONS,
  TIPO_USUARIO_OPTIONS,
  MULTIUSUARIO_OPTIONS
} from '../data/registrationOptions';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  empresa: {
    type: Object,
    default: null,
  },
});

useBodyScrollLock(() => props.isOpen);

const emit = defineEmits(['close']);
const empresaStore = useEmpresaStore();

const form = reactive({
  numacro: 'MAC-01',
  nuis: '10928472',
  address: empresaStore.currentUser?.location || 'Calle 72 # 11-45, Apto 302',
  userUsage: '1 — Residencial',
  userType: '2 — Pequeño generador',
  multiuser: '2 — No multiusuario',
});

const isFormValid = computed(() => {
  return (
    !!form.numacro &&
    !!form.nuis.trim() &&
    !!form.address.trim() &&
    !!form.userUsage &&
    !!form.userType &&
    !!form.multiuser
  );
});

function handleSubmit() {
  if (!props.empresa || !isFormValid.value) return;
  empresaStore.submitSubscription(props.empresa, { ...form });
}
</script>
