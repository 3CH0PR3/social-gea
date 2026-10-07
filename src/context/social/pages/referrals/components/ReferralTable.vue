<template>
  <div class="sg-referral-table-wrap">
    <table class="sg-referral-table">
      <thead>
        <tr>
          <th>Amigo Referido</th>
          <th>Ciudad</th>
          <th>Estado & Validación</th>
          <th>Red / Dispositivo</th>
          <th>1er Reciclaje</th>
          <th class="text-right">EcoPuntos</th>
          <th class="text-right">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>
            <div class="flex items-center gap-2.5">
              <SafeImage
                :src="item.avatar"
                :alt="item.name"
                imgClass="w-8 h-8 rounded-full object-cover"
                containerClass="w-8 h-8 rounded-full shrink-0"
              />
              <div>
                <span class="font-bold text-slate-900 block">{{ item.name }}</span>
                <span class="text-[11px] text-slate-400 block">{{ item.email }}</span>
              </div>
            </div>
          </td>

          <td class="text-slate-700">
            {{ item.city }}
          </td>

          <td>
            <span
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-bold"
              :class="{
                'bg-emerald-100 text-emerald-800': item.status === 'completed',
                'bg-amber-100 text-amber-800': item.status === 'verified_pending_recycle',
                'bg-rose-100 text-rose-800': item.status === 'blocked_fraud',
              }"
            >
              {{ item.status === 'completed' ? 'Completado' : item.status === 'verified_pending_recycle' ? 'Pendiente Reciclaje' : 'Bloqueado (Anti-Fraude)' }}
            </span>
          </td>

          <td>
            <div class="text-[11px] text-slate-600">
              <span class="font-semibold block">{{ item.security.networkType }}</span>
              <code class="text-[10px] text-slate-400 font-mono">{{ item.security.deviceFingerprint }}</code>
            </div>
          </td>

          <td>
            <span v-if="item.firstClassification" class="text-xs text-slate-700">
              {{ item.firstClassification.material }}
            </span>
            <span v-else-if="item.status === 'verified_pending_recycle'" class="text-xs text-amber-700 italic">
              Pendiente en acopio
            </span>
            <span v-else class="text-xs text-rose-600 italic">
              No aplica (Bloqueado)
            </span>
          </td>

          <td class="text-right font-black text-xs tabular-nums">
            <span :class="item.pointsAwarded > 0 ? 'text-emerald-700' : 'text-slate-400'">
              {{ item.pointsAwarded > 0 ? `+${item.pointsAwarded} Pts` : '0 Pts' }}
            </span>
          </td>

          <td class="text-right">
            <button
              v-if="item.status === 'verified_pending_recycle'"
              type="button"
              @click="$emit('simulate-recycle', item.id)"
              class="sg-btn sg-btn--sm sg-btn--secondary"
            >
              <span>Simular</span>
            </button>
            <span v-else class="text-slate-300 text-xs">—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import SafeImage from '@/shared/components/SafeImage.vue';

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

defineEmits(['simulate-recycle']);
</script>

<style src="./ReferralTable.css"></style>
