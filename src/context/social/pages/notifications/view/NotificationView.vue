<template>
  <!-- Full-screen Responsive Container:
       On mobile: Teleported to body as a 100dvh full-screen component (exactly like StoryViewer and PostCommentsModal)
       On desktop: Embedded clean card inside the main stage (retaining desktop layout) -->
  <Teleport to="body" :disabled="isDesktop">
    <div
      :class="[
        isDesktop
          ? 'w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden pb-8 animate-in fade-in duration-200'
          : 'fixed inset-0 z-50 bg-white w-full h-[100dvh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-200'
      ]"
    >
      <!-- Top App Bar -->
      <div
        :class="[
          'border-b border-slate-100 flex items-center justify-between select-none bg-white z-20 shrink-0',
          isDesktop ? 'p-5' : 'px-3.5 py-3 sticky top-0'
        ]"
      >
        <div class="flex items-center gap-2">
          <!-- Native Back Arrow button on mobile -->
          <button
            v-if="!isDesktop"
            type="button"
            @click="handleBack"
            class="p-2 -ml-1 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
          </button>

          <div>
            <h2 class="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
              <span>Notificaciones</span>
              <span
                v-if="unreadCount > 0"
                class="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500 text-white"
              >
                {{ unreadCount }}
              </span>
            </h2>
            <p v-if="isDesktop" class="text-xs text-slate-500 mt-0.5">
              Mantente al día con lo que sucede en tu comunidad
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="markAllAsRead"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          <CheckCheck class="w-4 h-4 text-emerald-600" />
          <span class="hidden xs:inline sm:inline">Marcar leídas</span>
        </button>
      </div>

      <!-- Filter Tabs Bar -->
      <div class="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 shrink-0 select-none">
        <button
          type="button"
          @click="setFilter('all')"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
            filter === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          ]"
        >
          <span>Todas</span>
          <span
            :class="[
              'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
              filter === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
            ]"
          >
            {{ notifications.length }}
          </span>
        </button>

        <button
          type="button"
          @click="setFilter('unread')"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
            filter === 'unread'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          ]"
        >
          <span>No leídas</span>
          <span
            v-if="unreadCount > 0"
            :class="[
              'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
              filter === 'unread' ? 'bg-emerald-700 text-white' : 'bg-rose-500 text-white'
            ]"
          >
            {{ unreadCount }}
          </span>
        </button>
      </div>

      <!-- Scrollable List (Full-screen scroll on mobile) -->
      <div
        :class="[
          'divide-y divide-slate-100 overscroll-contain',
          isDesktop ? '' : 'flex-1 overflow-y-auto pb-16'
        ]"
      >
        <div v-if="filteredNotifications.length === 0" class="text-center py-24 text-slate-400 space-y-3 px-4">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell class="w-7 h-7 stroke-[1.5]" />
          </div>
          <h4 class="font-bold text-slate-700 text-sm">No tienes notificaciones pendientes</h4>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">
            Te avisaremos cuando alguien interactúe con tus publicaciones, amigos o empresas.
          </p>
        </div>

        <NotificationCard
          v-for="item in filteredNotifications"
          :key="item.id"
          :notification="item"
          @click="handleClick(item)"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-vue-next';
import { useNotifications } from '../composables/useNotifications';
import NotificationCard from '../components/NotificationCard.vue';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const router = useRouter();
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 640 : true);

function handleResize() {
  isDesktop.value = window.innerWidth >= 640;
}

// Lock body scrolling when fullscreen on mobile
useBodyScrollLock(() => !isDesktop.value);

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
  window.addEventListener('resize', handleResize);
  loadNotifications();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
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
