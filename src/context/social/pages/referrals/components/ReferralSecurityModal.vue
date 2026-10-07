<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    title="Arquitectura de Seguridad Anti-Fraude en Referidos"
    size="lg"
  >
    <div class="space-y-4 p-4 text-xs text-slate-700 leading-relaxed">
      <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md">
        <h4 class="font-bold text-emerald-950 text-sm mb-1">
          ¿Cómo garantiza Socialgea que nadie abuse de los puntos?
        </h4>
        <p class="text-emerald-900">
          En los programas de puntos tradicionales, es común que una persona intente abrir enlaces de invitación en modo incógnito, cambiar de IP con VPN o crearse 10 cuentas falsas para ganar puntos ilegítimamente. Socialgea implementa una arquitectura de validación de 4 capas:
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="p-3 border border-slate-200 rounded-md bg-white space-y-1.5">
          <div class="flex items-center gap-2 text-slate-900 font-bold">
            <Smartphone :size="16" class="text-emerald-700" />
            <span>1. Validación Telefónica Móvil Colombia</span>
          </div>
          <p class="text-slate-500">
            Cada cuenta exige un número de celular único (+57 3xx...) verificado con código SMS/OTP. No se admiten números virtuales temporales (VoIP) ni números repetidos.
          </p>
        </div>

        <div class="p-3 border border-slate-200 rounded-md bg-white space-y-1.5">
          <div class="flex items-center gap-2 text-slate-900 font-bold">
            <Cpu :size="16" class="text-emerald-700" />
            <span>2. Device Fingerprinting (Huella Digital)</span>
          </div>
          <p class="text-slate-500">
            Analiza hardware, GPU canvas, resolución de pantalla y almacenamiento local del navegador. Si intentas invitarte a ti mismo en el mismo teléfono, el sistema bloquea la recompensa de inmediato.
          </p>
        </div>

        <div class="p-3 border border-slate-200 rounded-md bg-white space-y-1.5">
          <div class="flex items-center gap-2 text-slate-900 font-bold">
            <Globe :size="16" class="text-emerald-700" />
            <span>3. Detección de Datacenter & Bloqueo VPN</span>
          </div>
          <p class="text-slate-500">
            Se analizan los prefijos de red (ISP). Las conexiones que provienen de servidores de hosting, túneles VPN conocidos (NordVPN, Proton, proxies) o nodos Tor son marcadas automáticamente como fraudulentas.
          </p>
        </div>

        <div class="p-3 border border-slate-200 rounded-md bg-white space-y-1.5">
          <div class="flex items-center gap-2 text-slate-900 font-bold">
            <Recycle :size="16" class="text-emerald-700" />
            <span>4. Condición de Puntos: Primer Reciclaje Real</span>
          </div>
          <p class="text-slate-500">
            <strong>La regla de oro:</strong> Crear la cuenta NO entrega los puntos inmediatamente. Los +150 EcoPuntos se acreditan solo cuando tu amigo va a un centro de acopio y pesa su primer lote de reciclaje. Un bot nunca podrá entregar PET físico.
          </p>
        </div>
      </div>
    </div>

    <template #actions>
      <button
        type="button"
        @click="$emit('update:modelValue', false)"
        class="sg-btn sg-btn--primary"
      >
        Entendido
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { Smartphone, Cpu, Globe, Recycle } from 'lucide-vue-next';
import BaseModal from '@/shared/components/BaseModal.vue';

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>
