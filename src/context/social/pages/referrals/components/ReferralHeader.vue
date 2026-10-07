<template>
  <header class="sg-referral-header">
    <div class="sg-referral-header__top">
      <div>
        <div class="sg-referral-badge">
          <ShieldCheck :size="14" />
          <span>Sistema Anti-Fraude & Línea de Tiempo de Referidos</span>
        </div>
        <h1 class="sg-referral-header__title">Gana EcoPuntos Invitando Amigos a Socialgea</h1>
        <p class="sg-referral-header__desc">
          Comparte tu enlace único. Cada amigo verificado con número colombiano que clasifique su primer lote de reciclaje (PET, cartón, RAEE) te acredita <strong>+150 EcoPuntos</strong>. La plataforma previene automáticamente auto-referidos por IP, VPNs, proxies y clonación de dispositivos.
        </p>
      </div>

      <!-- Quick Action: Security Policy Modal -->
      <button
        type="button"
        @click="$emit('open-security')"
        class="sg-btn sg-btn--sm sg-btn--secondary shrink-0"
        title="Ver cómo protegemos los puntos contra bots y multicuentas"
      >
        <Lock :size="14" class="text-amber-700" />
        <span>Reglas Anti-Trampa</span>
      </button>
    </div>

    <!-- Referral Link & Code Box -->
    <div class="sg-referral-share-box">
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="text-xs font-bold text-slate-700">Tu código:</span>
        <span class="sg-referral-code-chip">{{ store.referralCode }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="copyCode"
          class="sg-btn sg-btn--sm sg-btn--secondary"
        >
          <Copy :size="13" />
          <span>{{ copied ? '¡Copiado!' : 'Copiar código' }}</span>
        </button>

        <button
          type="button"
          @click="copyInviteLink"
          class="sg-btn sg-btn--sm sg-btn--primary"
        >
          <Share2 :size="13" />
          <span>{{ copied ? '¡Enlace copiado!' : 'Copiar enlace' }}</span>
        </button>

        <button
          type="button"
          @click="$emit('open-simulator')"
          class="sg-btn sg-btn--sm sg-btn--secondary"
          title="Simular intento de registro con VPN o dispositivo clonado"
        >
          <Sparkles :size="13" class="text-emerald-700" />
          <span>Simular prueba</span>
        </button>
      </div>
    </div>

    <!-- Stats Matrix -->
    <div class="sg-referral-stats">
      <div class="sg-referral-stat-card">
        <span class="sg-referral-stat-card__label">EcoPuntos Ganados</span>
        <div class="sg-referral-stat-card__val text-emerald-800">
          +{{ store.totalPointsEarned }} Pts
        </div>
      </div>

      <div class="sg-referral-stat-card">
        <span class="sg-referral-stat-card__label">Referidos Completados</span>
        <div class="sg-referral-stat-card__val text-slate-800">
          {{ store.completedCount }}
        </div>
      </div>

      <div class="sg-referral-stat-card">
        <span class="sg-referral-stat-card__label">Pendiente 1er Reciclaje</span>
        <div class="sg-referral-stat-card__val text-amber-800">
          {{ store.pendingCount }}
        </div>
      </div>

      <div class="sg-referral-stat-card">
        <span class="sg-referral-stat-card__label">Intentos Bloqueados</span>
        <div class="sg-referral-stat-card__val text-rose-700">
          {{ store.blockedCount }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ShieldCheck, Lock, Copy, Share2, Sparkles } from 'lucide-vue-next';
import { useReferralsStore } from '../store/useReferrals.store';
import { useReferralActions } from '../composables/useReferralActions';

const store = useReferralsStore();
const { copied, copyInviteLink, copyCode } = useReferralActions();

defineEmits(['open-security', 'open-simulator']);
</script>

<style src="./ReferralHeader.css"></style>
