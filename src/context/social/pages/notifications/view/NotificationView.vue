<template>
  <component
    :is="isMobile ? 'div' : 'section'"
    class="sg-notifications"
    :class="{ 'fixed inset-0 z-50 bg-white w-full h-[100dvh]': isMobile }"
  >
    <!-- Top App Bar -->
    <header class="sg-notifications__appbar">
      <div class="sg-notifications__title-wrap">
        <button
          v-if="isMobile"
          type="button"
          @click="handleBack"
          class="sg-icon-btn -ml-1.5"
          aria-label="Volver"
        >
          <ArrowLeft :size="20" />
        </button>

        <h1 class="sg-notifications__title">Notificaciones</h1>

        <span
          v-if="unreadCount > 0"
          class="sg-notifications__counter"
          aria-label="Notificaciones no leídas"
        >
          {{ unreadCount }}
        </span>
      </div>

      <button
        type="button"
        @click="markAllAsRead"
        class="sg-btn sg-btn--sm sg-btn--secondary"
        title="Marcar todas como leídas"
      >
        <CheckCheck :size="16" class="text-emerald-700" />
        <span>Marcar leídas</span>
      </button>
    </header>

    <!-- Filter Tabs Bar -->
    <nav class="sg-notifications__tabs" aria-label="Filtro de notificaciones">
      <button
        type="button"
        @click="setFilter('all')"
        class="sg-notifications__tab"
        :class="{ 'sg-notifications__tab--active': filter === 'all' }"
      >
        <span>Todas</span>
        <span class="sg-notifications__tab-badge">
          {{ notifications.length }}
        </span>
      </button>

      <button
        type="button"
        @click="setFilter('unread')"
        class="sg-notifications__tab"
        :class="{ 'sg-notifications__tab--active': filter === 'unread' }"
      >
        <span>No leídas</span>
        <span v-if="unreadCount > 0" class="sg-notifications__tab-badge">
          {{ unreadCount }}
        </span>
      </button>
    </nav>

    <!-- Notifications List -->
    <div class="sg-notifications__list">
      <div v-if="filteredNotifications.length === 0" class="sg-notifications__empty">
        <div class="sg-notifications__empty-icon">
          <Bell :size="24" />
        </div>
        <h2 class="sg-notifications__empty-title">No tienes notificaciones pendientes</h2>
        <p class="sg-notifications__empty-desc">
          Te avisaremos cuando tus amigos o empresas aliadas de reciclaje interactúen contigo.
        </p>
      </div>

      <NotificationCard
        v-for="item in filteredNotifications"
        :key="item.id"
        :notification="item"
        @click="handleClick(item)"
      />
    </div>
  </component>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-vue-next';
import { useIsMobile } from '@/shared/composables/useIsMobile';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import { useNotifications } from '../composables/useNotifications';
import NotificationCard from '../components/NotificationCard.vue';

const router = useRouter();
const { isMobile } = useIsMobile();

// En móvil se bloquea el scroll del body porque la pantalla ocupa 100dvh
useBodyScrollLock(isMobile);

const {
  notifications,
  filteredNotifications,
  unreadCount,
  filter,
  loadNotifications,
  markAllAsRead,
  markAsRead,
  setFilter,
} = useNotifications();

onMounted(() => {
  loadNotifications();
});

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/feeds');
  }
}

function handleClick(item) {
  markAsRead(item.id);
  router.push(item.link || '/feeds');
}
</script>

<style src="./NotificationView.css"></style>
