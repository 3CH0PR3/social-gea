<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sg-admin-header">
      <div>
        <h1 class="sg-admin-title">Dashboard & Analíticas Globales</h1>
        <p class="sg-admin-sub">
          Métricas de impacto ambiental, balance de EcoPuntos y trazabilidad en Colombia.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="loadData"
          class="sg-btn sg-btn--secondary sg-btn--sm"
          :disabled="dashboardStore.isLoading"
        >
          <RefreshCw :class="{ 'animate-spin': dashboardStore.isLoading }" class="w-3.5 h-3.5 text-slate-500" />
          <span>Actualizar</span>
        </button>

        <RouterLink to="/admin/rewards" class="sg-btn sg-btn--primary sg-btn--sm">
          <Plus class="w-3.5 h-3.5" />
          <span>Nuevo Producto</span>
        </RouterLink>
      </div>
    </div>

    <!-- 4 KPI Metrics -->
    <div v-if="dashboardStore.data" class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      <MetricCard
        label="Material Recuperado"
        :value="`${dashboardStore.data.summary.totalTonnesRecycled} Ton`"
        :delta="dashboardStore.data.summary.tonnesMonthlyDelta"
        :icon="Recycle"
        iconBg="bg-emerald-100 text-emerald-800"
      />

      <MetricCard
        label="EcoPuntos Emitidos"
        :value="dashboardStore.data.summary.totalEcoPointsIssued.toLocaleString('es-CO')"
        :delta="dashboardStore.data.summary.ecoPointsMonthlyDelta"
        :icon="Coins"
        iconBg="bg-amber-100 text-amber-900"
      />

      <MetricCard
        label="EcoPuntos Canjeados"
        :value="dashboardStore.data.summary.totalEcoPointsRedeemed.toLocaleString('es-CO')"
        :delta="dashboardStore.data.summary.ecoPointsRedeemedDelta"
        :icon="Gift"
        iconBg="bg-blue-100 text-blue-800"
      />

      <MetricCard
        label="Usuarios Activos"
        :value="dashboardStore.data.summary.activeUsers.toLocaleString('es-CO')"
        :delta="dashboardStore.data.summary.usersMonthlyDelta"
        :icon="Users"
        iconBg="bg-purple-100 text-purple-800"
      />
    </div>

    <!-- Charts & Distribution Grid -->
    <div v-if="dashboardStore.data" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7">
        <MaterialsChart :materials="dashboardStore.data.materialsRecycledKg" />
      </div>

      <div class="lg:col-span-5">
        <TopMunicipalitiesList :municipalities="dashboardStore.data.topMunicipalities" />
      </div>
    </div>

    <!-- Recent Activity Table -->
    <div v-if="dashboardStore.data">
      <RecentActivityTable :activities="dashboardStore.data.recentActivities" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Recycle,
  Coins,
  Gift,
  Users,
  RefreshCw,
  Plus
} from 'lucide-vue-next';
import { useAdminDashboardStore } from '../store/useAdminDashboard.store';
import MetricCard from '../components/MetricCard.vue';
import MaterialsChart from '../components/MaterialsChart.vue';
import TopMunicipalitiesList from '../components/TopMunicipalitiesList.vue';
import RecentActivityTable from '../components/RecentActivityTable.vue';

const dashboardStore = useAdminDashboardStore();

function loadData() {
  dashboardStore.fetchDashboard();
}

onMounted(() => {
  if (!dashboardStore.data) {
    loadData();
  }
});
</script>
