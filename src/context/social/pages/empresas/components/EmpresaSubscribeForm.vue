<script setup>
import { ref } from 'vue';
import { UserPlus, ShieldCheck, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps({
  empresa: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit']);

const formData = ref({
  numacro: '',
  documentType: 'Cédula de Ciudadanía',
  documentNumber: '',
  userRole: 'Reciclador urbano',
  phone: '',
  neighborhood: '',
  collectionMode: 'Entrega en punto físico',
  monthlyVolumeEst: 'Menos de 20 kg',
  materialsOffered: [...(props.empresa.materials?.slice(0, 2) || [])],
  notes: '',
  acceptedTerms: true,
});

const toggleMaterial = (mat) => {
  const idx = formData.value.materialsOffered.indexOf(mat);
  if (idx === -1) {
    formData.value.materialsOffered.push(mat);
  } else {
    formData.value.materialsOffered.splice(idx, 1);
  }
};

const handleSubmit = () => {
  emit('submit', { ...formData.value });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
    <!-- Form Header Section -->
    <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100">
      <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
        <UserPlus class="w-4 h-4 stroke-[2.2]" />
      </div>
      <div>
        <h3 class="text-sm font-bold text-slate-900">Formulario de registro y vinculación</h3>
        <p class="text-[11px] text-slate-500">Datos para vincularte a la base de recolección de {{ empresa.name }}</p>
      </div>
    </div>

    <!-- Personal and Identification Details -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo de documento *</label>
        <select
          v-model="formData.documentType"
          class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
          required
        >
          <option>Cédula de Ciudadanía</option>
          <option>Cédula de Extranjería</option>
          <option>Permiso por Protección Temporal (PPT)</option>
          <option>Pasaporte</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Número de documento *</label>
        <input
          v-model="formData.documentNumber"
          type="text"
          placeholder="Ej: 1020304050"
          class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
          required
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Teléfono o WhatsApp de contacto *</label>
        <input
          v-model="formData.phone"
          type="tel"
          placeholder="+57 300 123 4567"
          class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
          required
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Barrio o Localidad *</label>
        <input
          v-model="formData.neighborhood"
          type="text"
          placeholder="Ej: Chapinero, Bogotá"
          class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
          required
        />
      </div>
    </div>

    <!-- Recycling logistics and role -->
    <div class="space-y-3 pt-2 border-t border-slate-100">
      <h4 class="text-xs font-bold text-slate-800">Detalles de recolección</h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Modalidad de entrega *</label>
          <select
            v-model="formData.collectionMode"
            class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
          >
            <option>Entrega en punto físico de acopio</option>
            <option>Recolección a domicilio programada</option>
            <option>Ruta de reciclaje comunitario</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Estimado de volumen mensual</label>
          <select
            v-model="formData.monthlyVolumeEst"
            class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
          >
            <option>Menos de 20 kg</option>
            <option>Entre 20 kg y 50 kg</option>
            <option>Entre 50 kg y 100 kg</option>
            <option>Más de 100 kg</option>
          </select>
        </div>
      </div>

      <!-- Materials Checkboxes -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-2">Materiales que planeas entregar:</label>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            v-for="mat in empresa.materials"
            :key="mat"
            @click="toggleMaterial(mat)"
            :class="[
              'text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer',
              formData.materialsOffered.includes(mat)
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            ]"
          >
            <CheckCircle2 v-if="formData.materialsOffered.includes(mat)" class="w-3.5 h-3.5 text-emerald-700" />
            <span>{{ mat }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
      <RouterLink
        :to="`/empresas/${empresa.id}`"
        class="sg-btn sg-btn--secondary"
      >
        Cancelar
      </RouterLink>
      <button
        type="submit"
        :disabled="isLoading"
        class="sg-btn sg-btn--primary"
      >
        <ShieldCheck class="w-4 h-4" />
        <span>{{ isLoading ? 'Procesando...' : 'Confirmar vinculación' }}</span>
      </button>
    </div>
  </form>
</template>
