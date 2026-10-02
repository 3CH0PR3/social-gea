<template>
  <div class="min-h-screen bg-[#f0f2f5] text-slate-900 flex flex-col antialiased selection:bg-emerald-500 selection:text-white pb-16 sm:pb-0">
    <!-- Navbar -->
    <Navbar @open-create-post="isComposerOpen = true" />

    <!-- Main Responsive Layout -->
    <div class="max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 flex items-start justify-center gap-6">
      <!-- Left Sidebar (Contextual for Empresas) -->
      <SidebarEmpresas v-if="isEmpresasRoute" />
      <SidebarLeft v-else />

      <!-- Center Dynamic Router Stage -->
      <main :class="['flex-1 w-full min-w-0 transition-all duration-200', isWideRoute ? 'max-w-5xl' : 'max-w-2xl']">
        <RouterView />
      </main>

      <!-- Right Sidebar -->
      <SidebarRight v-if="!isWideRoute" />
    </div>

    <!-- Mobile Navigation -->
    <MobileBottomNav />

    <!-- Floating Messenger Drawer -->
    <MessengerDrawer />

    <!-- Global Image Lightbox Gallery with Prev/Next Navigation -->
    <ImageLightbox />

    <!-- Global Post Composer Modal -->
    <PostComposer
      :isOpen="isComposerOpen"
      @close="isComposerOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Navbar from '@/shared/components/Navbar.vue';
import SidebarLeft from '@/shared/components/SidebarLeft.vue';
import SidebarRight from '@/shared/components/SidebarRight.vue';
import SidebarEmpresas from '@/modules/empresas/components/SidebarEmpresas.vue';
import MobileBottomNav from '@/shared/components/MobileBottomNav.vue';
import MessengerDrawer from '@/modules/messenger/components/MessengerDrawer.vue';
import PostComposer from '@/modules/feeds/components/PostComposer.vue';
import ImageLightbox from '@/modules/feeds/components/ImageLightbox.vue';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import { useHistoryStore } from '@/modules/historys/store/historyStore';
import { useNotificationStore } from '@/modules/notifications/store/notificationStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';

const route = useRoute();
const isEmpresasRoute = computed(() => route.path.startsWith('/empresas'));
const isWideRoute = computed(() => {
  return (
    route.path.startsWith('/empresas') ||
    route.path.startsWith('/profiles') ||
    route.path.startsWith('/historys')
  );
});

const feedStore = useFeedStore();
const historyStore = useHistoryStore();
const notificationStore = useNotificationStore();
const messengerStore = useMessengerStore();

const isComposerOpen = ref(false);

onMounted(() => {
  feedStore.loadPosts();
  historyStore.loadStories();
  notificationStore.loadNotifications();
  messengerStore.loadConversations();
});
</script>
