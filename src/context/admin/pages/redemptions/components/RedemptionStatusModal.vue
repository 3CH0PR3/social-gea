<template>
  <BaseModal
    :modelValue="modelValue"
    title="Actualizar Estado del Canje / Despacho"
    size="md"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <div v-if="redemption" class="p-4 sm:p-6 space-y-4 text-xs">
      <!-- Voucher Info Banner -->
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
        <div>
          <span class="font-mono text-sm font-black text-slate-900 block">
            {{ redemption.voucherCode }}
          </span>
          <span class="text-slate-600 block mt-0.5">
            {{ redemption.userName }} · {{ redemption.userCity }}
          </span>
        </div>
        <div class="text-right">
          <strong class="text-amber-800 font-extrabold text-sm block">
            -{{ redemption.pointsDeducted }} Pts
          </strong>
          <span class="text-[11px] text-slate-500">
            {{ redemption.deliveryType === 'home_delivery' ? 'Envío nacional' : 'Retiro en acopio' }}
          </span>
        </div>
      </div>

      <!-- Reward Summary -->
      <div class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-md">
        <img
          :src="redemption.rewardImage"
          :alt="redemption.rewardTitle"
          class="w-12 h-12 rounded object-cover border border-slate-100 shrink-0"
        />
        <div class="min-w-0">
          <span class="font-bold text-slate-900 block truncate">{{ redemption.rewardTitle }}</span>
          <span class="text-[11px] text-slate-500 block">{{ redemption.notes }}</span>
        </div>
      </div>

      <!-- Status Selection -->
      <div class="space-y-1">
        <label class="block font-bold text-slate-700">Nuevo Estado de Entrega *</label>
        <select
          v-model="selectedStatus"
          class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-900 font-bold cursor-pointer"
        >
          <option value="processing">En preparación / embalaje</option>
          <option value="ready_for_pickup">Listo para entrega en acopio</option>
          <option value="shipped">Despachado con transportadora</option>
          <option value="delivered">Entregado al usuario (Cerrado)</option>
        </select>
      </div>

      <!-- Carrier Guide (only if shipped) -->
      <div v-if="selectedStatus === 'shipped'" class="space-y-1">
        <label class="block font-bold text-slate-700">Guía de Transporte / Empresa *</label>
        <input
          v-model="carrierGuide"
          type="text"
          placeholder="Ej. ENV-COL-99218 (Servientrega / Coordinadora)"
          class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-900 font-mono"
        />
      </div>
    </div>

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
          type="button"
          @click="handleSave"
          class="sg-btn sg-btn--primary sg-btn--sm"
          :disabled="isSubmitting"
        >
          <span>Guardar Estado</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseModal from '@/shared/components/BaseModal.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  redemption: { type: Object, default: null },
  isSubmitting: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'save']);

const selectedStatus = ref('ready_for_pickup');
const carrierGuide = ref('');

watch(
  () => props.redemption,
  (val) => {
    if (val) {
      selectedStatus.value = val.status || 'ready_for_pickup';
      carrierGuide.value = val.carrierGuide || '';
    }
  },
  { immediate: true }
);

function handleSave() {
  emit('save', {
    voucherCode: props.redemption?.voucherCode,
    status: selectedStatus.value,
    carrierGuide: carrierGuide.value,
  });
}
</script>
