<template>
  <div class="soc-layout">
    <!-- Top Navbar -->
    <Navbar @open-create-post="isComposerOpen = true" />

    <!-- Main Layout Container -->
    <div
      :class="[
        'soc-container',
        isStandaloneMobileRoute ? 'p-0 sm:px-4 sm:py-6' : 'px-2 sm:px-4 py-4 sm:py-6'
      ]"
    >
      <!-- Left Sidebar (Contextual for Empresas, Radar/Amigos, Marketplace or General Feeds) -->
      <SidebarEmpresas v-if="isEmpresasRoute" />
      <SidebarFriends v-else-if="isFriendsRoute" />
      <SidebarMarketplace v-else-if="isMarketplaceRoute" />
      <SidebarLeft v-else-if="!isProfileRoute" />

      <!-- Center Dynamic Router Stage -->
      <main :class="['flex-1 w-full min-w-0', isProfileRoute ? 'w-full max-w-5xl xl:max-w-6xl mx-auto' : isWideRoute ? 'max-w-7xl' : 'max-w-2xl']">
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

    <!-- Global Story Viewer (Teleported to body) -->
    <StoryViewer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Navbar from '@/shared/components/Navbar.vue';
import SidebarLeft from '@/shared/components/SidebarLeft.vue';
import SidebarRight from '@/shared/components/SidebarRight.vue';
import SidebarEmpresas from '@/context/social/pages/empresas/components/SidebarEmpresas.vue';
import SidebarFriends from '@/context/social/pages/radar/components/SidebarFriends.vue';
import SidebarMarketplace from '@/context/social/pages/marketplace/components/SidebarMarketplace.vue';
import MessengerDrawer from '@/context/social/pages/messenger/components/MessengerDrawer.vue';
import PostComposer from '@/context/social/pages/feed/components/PostComposer.vue';
import ImageLightbox from '@/context/social/pages/feed/components/ImageLightbox.vue';
import StoryViewer from '@/context/social/pages/historys/components/StoryViewer.vue';
import { useFeedStore } from '@/context/social/pages/feed/store/feedStore';
import { useHistoryStore } from '@/context/social/pages/historys/store/historyStore';
import { useNotificationStore } from '@/context/social/pages/notifications/store/notificationStore';
import { useMessengerStore } from '@/context/social/pages/messenger/store/messengerStore';

const route = useRoute();
const isEmpresasRoute = computed(() => route.path.startsWith('/empresas'));
const isFriendsRoute = computed(() => route.path.startsWith('/radar') || route.path.startsWith('/friends'));
const isMarketplaceRoute = computed(() => route.path.startsWith('/marketplace'));
const isProfileRoute = computed(() => route.path.startsWith('/profiles'));
const isStandaloneMobileRoute = computed(() => {
  return route.path.startsWith('/profiles') || route.path.startsWith('/historys');
});
const isWideRoute = computed(() => {
  return (
    route.path.startsWith('/empresas') ||
    route.path.startsWith('/radar') ||
    route.path.startsWith('/friends') ||
    route.path.startsWith('/marketplace') ||
    route.path.startsWith('/referrals') ||
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
