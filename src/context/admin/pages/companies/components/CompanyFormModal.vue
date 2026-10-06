<template>
  <BaseModal
    :modelValue="modelValue"
    title="Registrar Empresa Recicladora Aliada"
    size="md"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" id="companyForm" class="p-4 sm:p-6 space-y-4 text-xs">
      <div class="space-y-1">
        <label class="block font-bold text-slate-700">Razón Social / Nombre Comercial *</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Ej. Recicladora del Sinú S.A.S"
          class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-semibold"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block font-bold text-slate-700">NIT de la Empresa *</label>
          <input
            v-model="form.nit"
            type="text"
            required
            placeholder="901.842.190-2"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-mono"
          />
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-slate-700">Teléfono de Contacto</label>
          <input
            v-model="form.phone"
            type="text"
            placeholder="+57 601 748 9200"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block font-bold text-slate-700">Departamento *</label>
          <input
            v-model="form.department"
            type="text"
            required
            placeholder="Ej. Córdoba"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
          />
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-slate-700">Municipio / Ciudad *</label>
          <input
            v-model="form.municipality"
            type="text"
            required
            placeholder="Ej. Montería"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label class="block font-bold text-slate-700">Dirección Sede / Centro de Acopio *</label>
        <input
          v-model="form.address"
          type="text"
          required
          placeholder="Carrera 4 # 28-19, Barrio La Granja"
          class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block font-bold text-slate-700">Código de Báscula Certificada</label>
          <input
            v-model="form.scaleId"
            type="text"
            placeholder="BASC-MON-0912"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-mono"
          />
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-slate-700">Tasa de Incentivo (PET)</label>
          <input
            v-model="form.incentiveRate"
            type="text"
            placeholder="+20 Pts por kg de PET"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
          />
        </div>
      </div>
    </form>

    <template #actions>
      <div class="flex items-center justify-end gap-2.5">
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="sg-btn sg-btn--secondary sg-btn--sm"
        >
          Cancelar
        </button>

        <button
          type="submit"
          form="companyForm"
          class="sg-btn sg-btn--primary sg-btn--sm"
        >
          <span>Registrar Empresa</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '@/shared/components/BaseModal.vue';

defineProps({
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(['update:modelValue', 'save']);

const form = ref({
  name: '',
  nit: '',
  department: '',
  municipality: '',
  address: '',
  phone: '',
  scaleId: 'BASC-NUEVA-001',
  scaleCertified: true,
  incentiveRate: '+20 Pts por kg de PET',
  materials: ['PET', 'Cartón', 'Aluminio'],
});

function handleSubmit() {
  emit('save', { ...form.value });
  form.value = {
    name: '',
    nit: '',
    department: '',
    municipality: '',
    address: '',
    phone: '',
    scaleId: 'BASC-NUEVA-001',
    scaleCertified: true,
    incentiveRate: '+20 Pts por kg de PET',
    materials: ['PET', 'Cartón'],
  };
}
</script>
