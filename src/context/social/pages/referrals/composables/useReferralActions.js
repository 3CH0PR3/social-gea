import { ref, computed } from 'vue';
import { useReferralsStore } from '../store/useReferrals.store';

export function useReferralActions() {
  const store = useReferralsStore();
  const copied = ref(false);
  const showSecurityModal = ref(false);
  const showSimulatorModal = ref(false);

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(store.inviteUrl);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2500);
    } catch (e) {
      // fallback
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(store.referralCode);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2500);
    } catch (e) {
      // fallback
    }
  };

  return {
    copied,
    showSecurityModal,
    showSimulatorModal,
    copyInviteLink,
    copyCode,
  };
}
