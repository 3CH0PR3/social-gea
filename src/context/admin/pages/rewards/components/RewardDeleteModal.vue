<template>
  <BaseModal
    :modelValue="modelValue"
    title="Confirmar Eliminación de Producto"
    size="sm"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <div class="p-4 sm:p-5 text-xs space-y-3">
      <div class="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-900">
        <AlertTriangle class="w-5 h-5 text-red-600 shrink-0" />
        <p class="leading-relaxed">
          Esta acción eliminará el producto del catálogo activo de Socialgea. Los usuarios no podrán seguir canjeándolo.
        </p>
      </div>

      <div v-if="reward" class="p-3 bg-slate-50 border border-slate-200 rounded-md">
        <span class="font-bold text-slate-900 block">{{ reward.title }}</span>
        <span class="text-slate-500 font-mono text-[11px] block mt-0.5">
          ID: {{ reward.id }} · {{ reward.pointsPrice }} EcoPuntos
        </span>
      </div>
    </div>

    <template #actions>
      <div class="flex items-center justify-end gap-2.5 w-full">
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="sg-btn sg-btn--secondary sg-btn--sm flex-1 sm:flex-initial"
        >
          Cancelar
        </button>

        <button
          type="button"
          @click="$emit('confirm', reward?.id)"
          class="sg-btn sg-btn--danger sg-btn--sm flex-1 sm:flex-initial"
          :disabled="isSubmitting"
        >
          <span>Eliminar Producto</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next';
import BaseModal from '@/shared/components/BaseModal.vue';

defineProps({
  modelValue: { type: Boolean, required: true },
  reward: { type: Object, default: null },
  isSubmitting: { type: Boolean, default: false },
});

defineEmits(['update:modelValue', 'confirm']);
</script>
