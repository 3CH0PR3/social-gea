<template>
  <div class="min-h-screen bg-[#f0f2f5] text-slate-900 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
    <!-- Navbar -->
    <Navbar @open-create-post="isComposerOpen = true" />

    <!-- Main Responsive Layout -->
    <div
      :class="[
        'max-w-7xl mx-auto w-full flex items-start justify-center gap-6',
        isProfileRoute ? 'p-0 sm:px-4 sm:py-6' : 'px-2 sm:px-4 py-4 sm:py-6'
      ]"
    >
      <!-- Left Sidebar (Contextual for Empresas, Radar/Amigos, Marketplace or General Feeds) -->
      <SidebarEmpresas v-if="isEmpresasRoute" />
      <SidebarFriends v-else-if="isFriendsRoute" />
      <SidebarMarketplace v-else-if="isMarketplaceRoute" />
      <SidebarLeft v-else-if="!isProfileRoute" />

      <!-- Center Dynamic Router Stage -->
      <main :class="['flex-1 w-full min-w-0', isProfileRoute ? 'w-full max-w-full sm:max-w-4xl' : isWideRoute ? 'max-w-7xl' : 'max-w-2xl']">
        <RouterView />
      </main>

      <!-- Right Sidebar -->
      <SidebarRight v-if="!isWideRoute && !isProfileRoute" />
    </div>

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
import SidebarFriends from '@/modules/radar/components/SidebarFriends.vue';
import SidebarMarketplace from '@/modules/marketplace/components/SidebarMarketplace.vue';
import MessengerDrawer from '@/modules/messenger/components/MessengerDrawer.vue';
import PostComposer from '@/modules/feeds/components/PostComposer.vue';
import ImageLightbox from '@/modules/feeds/components/ImageLightbox.vue';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import { useHistoryStore } from '@/modules/historys/store/historyStore';
import { useNotificationStore } from '@/modules/notifications/store/notificationStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';

const route = useRoute();
const isEmpresasRoute = computed(() => route.path.startsWith('/empresas'));
const isFriendsRoute = computed(() => route.path.startsWith('/radar') || route.path.startsWith('/friends'));
const isMarketplaceRoute = computed(() => route.path.startsWith('/marketplace'));
const isProfileRoute = computed(() => route.path.startsWith('/profiles'));
const isWideRoute = computed(() => {
  return (
    route.path.startsWith('/empresas') ||
    route.path.startsWith('/radar') ||
    route.path.startsWith('/friends') ||
    route.path.startsWith('/marketplace') ||
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
