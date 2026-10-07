<template>
  <div class="sg-referrals-page animate-in fade-in duration-200">
    <!-- 1. Header con estadísticas y enlace de invitación -->
    <ReferralHeader
      @open-security="showSecurityModal = true"
      @open-simulator="showSimulatorModal = true"
    />

    <!-- 2. Switcher de vista: Línea de Tiempo (Mapa de progreso) vs Tabla de datos -->
    <div class="sg-referrals-view-switch">
      <h2 class="sg-referrals-view-switch__title">
        Mis Amigos Referidos ({{ store.items.length }})
      </h2>

      <div class="sg-referrals-view-switch__tabs" role="tablist">
        <button
          type="button"
          @click="store.activeView = 'timeline'"
          class="sg-referrals-tab"
          :class="{ 'sg-referrals-tab--active': store.activeView === 'timeline' }"
          role="tab"
          aria-label="Ver línea de tiempo"
        >
          <GitCommit :size="14" />
          <span>Línea de tiempo</span>
        </button>

        <button
          type="button"
          @click="store.activeView = 'table'"
          class="sg-referrals-tab"
          :class="{ 'sg-referrals-tab--active': store.activeView === 'table' }"
          role="tab"
          aria-label="Ver tabla"
        >
          <Table :size="14" />
          <span>Tabla</span>
        </button>
      </div>
    </div>

    <!-- 3. Contenido condicional -->
    <ReferralTimeline
      v-if="store.activeView === 'timeline'"
      :items="store.items"
      @simulate-recycle="handleSimulateRecycle"
    />

    <ReferralTable
      v-else
      :items="store.items"
      @simulate-recycle="handleSimulateRecycle"
    />

    <!-- 4. Modales de seguridad y simulación -->
    <ReferralSecurityModal v-model="showSecurityModal" />
    <ReferralSimulatorModal v-model="showSimulatorModal" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { GitCommit, Table } from 'lucide-vue-next';
import { useReferralsStore } from '../store/useReferrals.store';
import { useReferralActions } from '../composables/useReferralActions';
import ReferralHeader from '../components/ReferralHeader.vue';
import ReferralTimeline from '../components/ReferralTimeline.vue';
import ReferralTable from '../components/ReferralTable.vue';
import ReferralSecurityModal from '../components/ReferralSecurityModal.vue';
import ReferralSimulatorModal from '../components/ReferralSimulatorModal.vue';

const store = useReferralsStore();
const { showSecurityModal, showSimulatorModal } = useReferralActions();

onMounted(() => {
  store.loadReferrals();
});

async function handleSimulateRecycle(referralId) {
  try {
    await store.completeFirstRecycle(referralId);
  } catch (err) {
    // handled in store
  }
}
</script>

<style src="./ReferralsView.css"></style>
