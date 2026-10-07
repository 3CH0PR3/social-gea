import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ReferralsService } from '../services/referrals.service';
import { useMarketplaceStore } from '@/context/social/pages/marketplace/store/marketplaceStore';

export const useReferralsStore = defineStore('social.referrals', () => {
  const items = ref([]);
  const referralCode = ref('CARLOS-ECO-77');
  const isLoading = ref(false);
  const errorMsg = ref(null);
  const activeView = ref('timeline'); // 'timeline' | 'table'

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err.message || 'Error en operación de referidos';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const totalPointsEarned = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.pointsAwarded || 0), 0);
  });

  const completedCount = computed(() => {
    return items.value.filter(item => item.status === 'completed').length;
  });

  const pendingCount = computed(() => {
    return items.value.filter(item => item.status === 'verified_pending_recycle').length;
  });

  const blockedCount = computed(() => {
    return items.value.filter(item => item.status === 'blocked_fraud').length;
  });

  const loadReferrals = async () => {
    await executeAsync(async () => {
      const data = await ReferralsService.list();
      items.value = data;
      const code = await ReferralsService.getReferralCode();
      referralCode.value = code;
    });
  };

  const registerSimulatedReferral = async (payload) => {
    return await executeAsync(async () => {
      const created = await ReferralsService.processReferralInvite(payload);
      items.value.unshift(created);
      return created;
    });
  };

  const completeFirstRecycle = async (referralId) => {
    return await executeAsync(async () => {
      const updated = await ReferralsService.simulateFirstRecycle(referralId);
      const index = items.value.findIndex(r => r.id === referralId);
      if (index !== -1) {
        items.value[index] = updated;
      }
      // Acreditar los 150 puntos en el saldo global de EcoPuntos del usuario
      const marketStore = useMarketplaceStore();
      marketStore.userPoints += 150;
      return updated;
    });
  };

  const inviteUrl = computed(() => {
    if (typeof window === 'undefined') return `https://socialgea.co/register?ref=${referralCode.value}`;
    const base = window.location.origin;
    return `${base}/#/auth/register?ref=${referralCode.value}`;
  });

  return {
    items,
    referralCode,
    inviteUrl,
    isLoading,
    errorMsg,
    activeView,
    totalPointsEarned,
    completedCount,
    pendingCount,
    blockedCount,
    executeAsync,
    loadReferrals,
    registerSimulatedReferral,
    completeFirstRecycle,
  };
});
