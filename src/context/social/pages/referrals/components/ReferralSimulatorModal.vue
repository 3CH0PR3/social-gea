<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    title="Simulador de Registro y Anti-Fraude"
    size="md"
  >
    <form @submit.prevent="handleSimulate" class="p-4 space-y-3.5 text-xs">
      <p class="text-slate-600">
        Prueba cómo reacciona el motor de Socialgea ante diferentes escenarios de trampa y registros legítimos:
      </p>

      <div class="space-y-1">
        <label class="block font-bold text-slate-800">Nombre del nuevo amigo</label>
        <input
          v-model="simForm.name"
          type="text"
          required
          placeholder="Ej: Andrés Felipe Gómez"
          class="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-emerald-700 bg-white"
        />
      </div>

      <div class="space-y-1">
        <label class="block font-bold text-slate-800">Teléfono Móvil Colombia (+57)</label>
        <input
          v-model="simForm.phone"
          type="tel"
          required
          placeholder="312 456 7890"
          class="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-emerald-700 bg-white"
        />
      </div>

      <div class="space-y-1">
        <label class="block font-bold text-slate-800">Ciudad de Colombia</label>
        <input
          v-model="simForm.city"
          type="text"
          placeholder="Bogotá D.C. / Medellín / Cali"
          class="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-emerald-700 bg-white"
        />
      </div>

      <!-- Fraud test toggles -->
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
        <span class="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
          Probar Vectores de Ataque:
        </span>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="simForm.isSameDevice"
            type="checkbox"
            class="rounded-sm text-emerald-700"
          />
          <span class="text-slate-700 font-medium">
            Simular auto-invitación en el mismo dispositivo móvil
          </span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="simForm.isSimulatedVPN"
            type="checkbox"
            class="rounded-sm text-emerald-700"
          />
          <span class="text-slate-700 font-medium">
            Simular conexión oculta detrás de VPN / Proxy de Datacenter
          </span>
        </label>
      </div>

      <!-- Feedback Banner -->
      <div
        v-if="feedback"
        class="p-3 rounded-md border text-xs"
        :class="feedback.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'"
      >
        <strong class="block font-bold">{{ feedback.success ? 'Registro Aceptado:' : 'Bloqueado por Anti-Fraude:' }}</strong>
        <span>{{ feedback.message }}</span>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="sg-btn sg-btn--primary w-full"
        >
          <span>{{ isSubmitting ? 'Validando huella de red...' : 'Ejecutar Validación' }}</span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '@/shared/components/BaseModal.vue';
import { useReferralsStore } from '../store/useReferrals.store';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const store = useReferralsStore();

const isSubmitting = ref(false);
const feedback = ref(null);

const simForm = reactive({
  name: 'Mateo Zuluaga',
  phone: '3158941230',
  city: 'Bucaramanga, Santander',
  isSameDevice: false,
  isSimulatedVPN: false,
});

async function handleSimulate() {
  feedback.value = null;
  isSubmitting.value = true;
  try {
    const created = await store.registerSimulatedReferral({
      code: store.referralCode,
      name: simForm.name,
      email: `${simForm.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: simForm.phone,
      city: simForm.city,
      isSameDevice: simForm.isSameDevice,
      isSimulatedVPN: simForm.isSimulatedVPN,
    });
    feedback.value = {
      success: true,
      message: `¡Referido legítimo creado exitosamente! Se agregó a tu línea de tiempo en estado pendiente de primer reciclaje.`,
    };
  } catch (err) {
    feedback.value = {
      success: false,
      message: err.message || 'Error en la validación',
    };
  } finally {
    isSubmitting.value = false;
  }
}
</script>
