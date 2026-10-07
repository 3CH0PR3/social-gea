<template>
  <BaseModal
    :modelValue="modelValue"
    title="Resolver Reporte de Comunidad"
    size="md"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <div v-if="report" class="p-4 sm:p-5 text-xs space-y-4">
      <!-- Reported User / Reason Banner -->
      <div class="p-3 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between">
        <div>
          <span class="text-[11px] text-slate-500 font-semibold block">Usuario Denunciado:</span>
          <span class="font-extrabold text-slate-900 text-sm">{{ report.reportedUser.name }}</span>
          <span class="text-[11px] text-slate-500 block">{{ report.reportedUser.city }}</span>
        </div>
        <div class="text-right">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-900 border border-red-200">
            {{ report.reportsCount }} denuncias
          </span>
          <span class="text-[11px] text-red-800 font-bold block mt-1">{{ report.reason }}</span>
        </div>
      </div>

      <!-- Action Selection -->
      <div class="space-y-2">
        <label class="block font-bold text-slate-800">
          Selecciona la acción disciplinaria a aplicar:
        </label>

        <div class="grid grid-cols-1 gap-2">
          <label
            v-for="opt in actionOptions"
            :key="opt.value"
            :class="selectedAction === opt.value ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'"
            class="flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors"
          >
            <input
              type="radio"
              v-model="selectedAction"
              :value="opt.value"
              class="mt-0.5 text-emerald-700"
            />
            <div>
              <span class="font-bold text-slate-900 block leading-tight">{{ opt.title }}</span>
              <span class="text-[11px] text-slate-500">{{ opt.desc }}</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Moderator Notes -->
      <div class="space-y-1">
        <label class="block font-bold text-slate-700">Nota interna de auditoría (opcional):</label>
        <textarea
          v-model="notes"
          rows="2"
          placeholder="Motivo de la resolución para el registro de auditoría..."
          class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 text-xs"
        />
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
          @click="handleApply"
          :class="selectedAction === 'dismiss' ? 'sg-btn--secondary' : 'sg-btn--danger'"
          class="sg-btn sg-btn--sm flex-1 sm:flex-initial"
          :disabled="isSubmitting"
        >
          <span>Aplicar Resolución</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '@/shared/components/BaseModal.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  report: { type: Object, default: null },
  isSubmitting: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'apply']);

const selectedAction = ref('hide_content');
const notes = ref('');

const actionOptions = [
  {
    value: 'dismiss',
    title: 'Desestimar reporte',
    desc: 'El contenido cumple las normas comunitarias y se mantiene visible.',
  },
  {
    value: 'hide_content',
    title: 'Ocultar / Eliminar contenido',
    desc: 'Retira la publicación, historia o comentario inmediatamente del muro.',
  },
  {
    value: 'warn_user',
    title: 'Enviar advertencia formal',
    desc: 'Notifica al usuario por infracción leve de las normas ecológicas.',
  },
  {
    value: 'suspend_24h',
    title: 'Suspender cuenta por 24 horas',
    desc: 'Inhabilita interacciones y canjes durante 24 horas.',
  },
  {
    value: 'ban_permanent',
    title: 'Baneo definitivo de cuenta',
    desc: 'Bloquea el usuario, cédula y anula saldo de puntos fraudulentos.',
  },
];

function handleApply() {
  emit('apply', {
    reportId: props.report?.id,
    action: selectedAction.value,
    notes: notes.value,
  });
}
</script>
