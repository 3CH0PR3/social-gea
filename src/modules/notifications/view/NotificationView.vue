<template>
  <div class="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden pb-8 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="p-5 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-extrabold text-slate-900 tracking-tight font-display">
          Notificaciones
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Mantente al día con lo que sucede en tu comunidad
        </p>
      </div>

      <button
        type="button"
        @click="markAllAsRead"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
      >
        <CheckCheck class="w-4 h-4 text-emerald-600" />
        <span>Marcar leídas</span>
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-1 px-5 py-2.5 bg-slate-50/60 border-b border-slate-100">
      <button
        type="button"
        @click="setFilter('all')"
        :class="[
          'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
          filter === 'all'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-200/60'
        ]"
      >
        Todas ({{ notifications.length }})
      </button>
      <button
        type="button"
        @click="setFilter('unread')"
        :class="[
          'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
          filter === 'unread'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-200/60'
        ]"
      >
        No leídas ({{ unreadCount }})
      </button>
    </div>

    <!-- List -->
    <div class="divide-y divide-slate-100">
      <div v-if="filteredNotifications.length === 0" class="text-center py-16 text-slate-400 space-y-2">
        <Bell class="w-10 h-10 mx-auto stroke-slate-300" />
        <p class="text-sm font-medium">No tienes notificaciones pendientes</p>
      </div>

      <NotificationCard
        v-for="item in filteredNotifications"
        :key="item.id"
        :notification="item"
        @click="handleClick(item)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bell, CheckCheck } from 'lucide-vue-next';
import { useNotifications } from '../composables/useNotifications';
import NotificationCard from '../components/NotificationCard.vue';

const router = useRouter();
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

function handleClick(item) {
  markAsRead(item.id);
  router.push('/feeds');
}
</script>
