<template>
  <div class="sg-timeline">
    <div
      v-for="item in items"
      :key="item.id"
      class="sg-timeline-item"
      :class="{
        'sg-timeline-item--completed': item.status === 'completed',
        'sg-timeline-item--pending': item.status === 'verified_pending_recycle',
        'sg-timeline-item--blocked': item.status === 'blocked_fraud',
      }"
    >
      <!-- Timeline Node Indicator -->
      <div class="sg-timeline-item__node">
        <Check v-if="item.status === 'completed'" :size="12" />
        <Clock v-else-if="item.status === 'verified_pending_recycle'" :size="12" />
        <ShieldAlert v-else :size="12" />
      </div>

      <!-- Card Container -->
      <div class="sg-timeline-item__card">
        <div class="sg-timeline-item__header">
          <div class="sg-timeline-item__user-wrap">
            <SafeImage
              :src="item.avatar"
              :alt="item.name"
              imgClass="sg-timeline-item__avatar"
              containerClass="w-10 h-10 rounded-full shrink-0"
            />
            <div>
              <span class="sg-timeline-item__name">{{ item.name }}</span>
              <span class="sg-timeline-item__meta">{{ item.city }} · Registrado: {{ formatDate(item.registeredAt) }}</span>
            </div>
          </div>

          <!-- Status badge -->
          <span
            class="sg-timeline-item__status-chip"
            :class="{
              'sg-timeline-item__status-chip--completed': item.status === 'completed',
              'sg-timeline-item__status-chip--pending': item.status === 'verified_pending_recycle',
              'sg-timeline-item__status-chip--blocked': item.status === 'blocked_fraud',
            }"
          >
            <ShieldCheck v-if="item.status === 'completed'" :size="12" />
            <AlertTriangle v-else-if="item.status === 'verified_pending_recycle'" :size="12" />
            <Ban v-else :size="12" />
            <span>{{ item.statusLabel }}</span>
          </span>
        </div>

        <!-- Security & Anti-Fraud Telemetry row -->
        <div class="sg-timeline-item__security-box">
          <div>
            <span class="text-slate-400 block text-[10px]">Huella de Dispositivo:</span>
            <code class="font-mono text-slate-700">{{ item.security.deviceFingerprint }}</code>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">Red / ISP Colombia:</span>
            <span class="font-semibold text-slate-800">{{ item.security.networkType }}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">Detección VPN / Proxy:</span>
            <span :class="item.security.vpnDetected ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'">
              {{ item.security.vpnDetected ? 'Detectado (Bloqueado)' : 'Limpio (Residencial)' }}
            </span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">Nivel de Riesgo:</span>
            <span class="font-medium text-slate-700">{{ item.security.riskScore }}</span>
          </div>
        </div>

        <!-- First recycling evidence or pending trigger -->
        <div class="sg-timeline-item__reward-row">
          <div>
            <span v-if="item.firstClassification" class="text-xs text-slate-600">
              🌱 Primer reciclaje: <strong>{{ item.firstClassification.material }}</strong> en {{ item.firstClassification.enterprise }}
            </span>
            <span v-else-if="item.status === 'verified_pending_recycle'" class="text-xs text-amber-800 font-medium">
              ⏳ Para recibir los puntos, tu amigo debe entregar su primer material en un centro de acopio aliado.
            </span>
            <span v-else class="text-xs text-rose-700 font-medium">
              ❌ Rechazado: Intentó registrarse desde tu misma IP/dispositivo o mediante VPN de centro de datos.
            </span>
          </div>

          <div class="flex items-center gap-3">
            <!-- Simulator trigger for pending referral -->
            <button
              v-if="item.status === 'verified_pending_recycle'"
              type="button"
              @click="$emit('simulate-recycle', item.id)"
              class="sg-btn sg-btn--sm sg-btn--reward"
              title="Simular que este amigo fue a la recicladora y entregó material"
            >
              <span>Simular 1er reciclaje</span>
            </button>

            <!-- Points Chip -->
            <div
              class="font-black text-xs tabular-nums px-2.5 py-1 rounded-md"
              :class="item.pointsAwarded > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'"
            >
              {{ item.pointsAwarded > 0 ? `+${item.pointsAwarded} Pts` : '0 Pts' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check, Clock, ShieldAlert, ShieldCheck, AlertTriangle, Ban } from 'lucide-vue-next';
import SafeImage from '@/shared/components/SafeImage.vue';

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

defineEmits(['simulate-recycle']);

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return iso;
  }
}
</script>

<style src="./ReferralTimeline.css"></style>
