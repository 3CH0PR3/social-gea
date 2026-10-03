<template>
  <header
    :class="[
      'sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs select-none',
      isFullMobileRoute ? 'hidden sm:block' : ''
    ]"
  >
    <!-- ========================================================
         1. ANDROID / MOBILE NAVBAR (MATCHING FACEBOOK LAYOUT FROM USER IMAGE 2)
         - Line 1: Brand "socialgea" on left, Search & Hamburger Menu on right
         - Line 2: 6 Top Navigation Tabs directly underneath (Feed, Amigos, Mensajes, Empresas, Notificaciones, Marketplace)
         ======================================================== -->
    <div class="sm:hidden">
      <!-- Line 1: Brand & Action Buttons -->
      <div class="px-4 pt-2.5 pb-1 flex items-center justify-between">
        <RouterLink
          to="/feeds"
          class="text-2xl font-black text-emerald-600 font-display tracking-tight hover:opacity-90 transition-opacity"
        >
          socialgea
        </RouterLink>

        <div class="flex items-center gap-2">
          <!-- Round Search Button (Opens unified MobileSearchModal matching Image 3) -->
          <button
            type="button"
            @click="isSearchModalOpen = true"
            class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Buscar personas"
          >
            <Search class="w-4.5 h-4.5 stroke-[2.2]" />
          </button>

          <!-- Round Hamburger Menu Button (Opens Android Menu from Image 1) -->
          <button
            type="button"
            @click="isMobileMenuOpen = true"
            class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Menú principal"
          >
            <Menu class="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      <!-- Quick Mobile Search Bar (Toggleable) -->
      <div v-if="showMobileSearch" class="px-4 py-2 bg-slate-50 border-t border-b border-slate-200/80 animate-in fade-in duration-150">
        <div class="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-slate-200 shadow-2xs">
          <Search class="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            :value="feedStore.searchQuery"
            @input="feedStore.setSearch($event.target.value)"
            placeholder="Buscar publicaciones, amigos o premios..."
            class="w-full bg-transparent text-xs text-slate-800 outline-none"
            autofocus
          />
          <button v-if="feedStore.searchQuery" @click="feedStore.setSearch('')" class="text-slate-400 p-0.5">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Line 2: 6 Top Tabs (Facebook Android Layout from Image 2) -->
      <div class="grid grid-cols-6 items-center border-t border-slate-100">
        <!-- 1. Feed -->
        <RouterLink
          to="/feeds"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isFeedActive ? '!text-emerald-600' : ''"
          title="Feed"
        >
          <Home class="w-5.5 h-5.5 stroke-[2]" />
          <span
            v-if="isFeedActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <!-- 2. Amigos -->
        <RouterLink
          to="/radar"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isFriendsActive ? '!text-emerald-600' : ''"
          title="Amigos"
        >
          <Users class="w-5.5 h-5.5 stroke-[2]" />
          <span
            v-if="isFriendsActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <!-- 3. Mensajes (Messenger) -->
        <button
          type="button"
          @click="messengerStore.toggleDrawer"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Mensajes"
        >
          <div class="relative">
            <MessageCircle class="w-5.5 h-5.5 stroke-[2]" />
            <span
              v-if="unreadMessages > 0"
              class="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ unreadMessages }}
            </span>
          </div>
        </button>

        <!-- 4. Empresas (Recycling Centers, replaces video icon) -->
        <RouterLink
          to="/empresas"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isEmpresasActive ? '!text-emerald-600' : ''"
          title="Empresas de Reciclaje"
        >
          <Building2 class="w-5.5 h-5.5 stroke-[2]" />
          <span
            v-if="isEmpresasActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <!-- 5. Notificaciones -->
        <RouterLink
          to="/notifications"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isNotificationsActive ? '!text-emerald-600' : ''"
          title="Notificaciones"
        >
          <div class="relative">
            <Bell class="w-5.5 h-5.5 stroke-[2]" />
            <span
              v-if="unreadNotifs > 0"
              class="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ unreadNotifs }}
            </span>
          </div>
          <span
            v-if="isNotificationsActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <!-- 6. Marketplace (Premios & Recompensas) -->
        <RouterLink
          to="/marketplace"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isMarketplaceActive ? '!text-emerald-600' : ''"
          title="Marketplace"
        >
          <Store class="w-5.5 h-5.5 stroke-[2]" />
          <span
            v-if="isMarketplaceActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>
      </div>
    </div>

    <!-- ========================================================
         2. DESKTOP NAVBAR (PRESERVED FOR DESKTOP >= sm)
         - Dock shows only the round icon and search input (no text)
         ======================================================== -->
    <div class="hidden sm:flex max-w-7xl mx-auto px-4 h-14 items-center justify-between gap-4">
      <!-- Zone 1: Logo & Search (Only icon and search, no text) -->
      <div class="flex items-center gap-2.5 shrink-0">
        <RouterLink to="/feeds" class="flex items-center focus:outline-none" aria-label="Ir a Inicio">
          <RadarLogo :size="38" :showText="false" />
        </RouterLink>

        <!-- Compact Search Bar -->
        <div class="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 rounded-full px-2.5 py-1.5 transition-all w-36 sm:w-44 md:w-52 border border-transparent focus-within:border-emerald-400">
          <Search class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            :value="feedStore.searchQuery"
            @input="feedStore.setSearch($event.target.value)"
            placeholder="Buscar en Socialgea..."
            class="w-full bg-transparent text-xs text-slate-800 outline-none placeholder-slate-400"
          />
          <button v-if="feedStore.searchQuery" @click="feedStore.setSearch('')" class="text-slate-400 p-0.5">
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- Zone 2: Navigation Links for Desktop -->
      <nav class="flex items-center gap-1 md:gap-2 h-full">
        <RouterLink
          to="/feeds"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Inicio"
        >
          <Home class="w-5 h-5" />
          <span
            v-if="isFeedActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/radar"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Amigos"
        >
          <Users class="w-5 h-5" />
          <span
            v-if="isFriendsActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/historys"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Historias de amigos"
        >
          <Sparkles class="w-5 h-5" />
          <span
            v-if="route.path === '/historys'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/empresas"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Empresas de Reciclaje"
        >
          <Building2 class="w-5 h-5" />
          <span
            v-if="isEmpresasActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/marketplace"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Premios & Recompensas"
        >
          <Store class="w-5 h-5" />
          <span
            v-if="isMarketplaceActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>
      </nav>

      <!-- Zone 3: Actions (Notifications, Messages, User Profile) -->
      <div class="flex items-center gap-2">
        <!-- Notifications button -->
        <RouterLink
          to="/notifications"
          class="relative w-9.5 h-9.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          title="Notificaciones"
        >
          <Bell class="w-5 h-5" />
          <span
            v-if="unreadNotifs > 0"
            class="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ unreadNotifs }}
          </span>
        </RouterLink>

        <!-- Messenger trigger button -->
        <button
          type="button"
          @click="messengerStore.toggleDrawer"
          class="relative w-9.5 h-9.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          title="Mensajes de Socialgea"
        >
          <MessageCircle class="w-5 h-5" />
          <span
            v-if="unreadMessages > 0"
            class="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ unreadMessages }}
          </span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="relative">
          <button
            type="button"
            @click="showDropdown = !showDropdown"
            class="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          >
            <div class="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400">
              <SafeImage
                :src="currentUser.avatar"
                :alt="currentUser.name"
                imgClass="w-full h-full rounded-full object-cover"
                containerClass="w-full h-full"
              />
            </div>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div
            v-if="showDropdown"
            class="absolute right-0 top-11 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            @click="showDropdown = false"
          >
            <RouterLink
              :to="`/profiles/${currentUser.id}`"
              class="px-4 py-2 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
            >
              <img
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-500"
              />
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-slate-900 truncate">{{ currentUser.name }}</h4>
                <span class="text-[11px] text-emerald-600 font-medium">Ver mi perfil</span>
              </div>
            </RouterLink>

            <div class="py-1">
              <RouterLink
                :to="`/profiles/${currentUser.id}`"
                class="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left"
              >
                <UserIcon class="w-4 h-4 text-slate-400" />
                <span>Tu perfil</span>
              </RouterLink>

              <RouterLink
                to="/feeds"
                @click="feedStore.setFilter('saved')"
                class="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left"
              >
                <Bookmark class="w-4 h-4 text-slate-400" />
                <span>Publicaciones guardadas</span>
              </RouterLink>

              <button
                type="button"
                @click="showDropdown = false"
                class="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer"
              >
                <Settings class="w-4 h-4 text-slate-400" />
                <span>Configuración y privacidad</span>
              </button>

              <div class="my-1 border-t border-slate-100" />

              <button
                type="button"
                @click="showDropdown = false"
                class="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 text-left font-semibold cursor-pointer"
              >
                <LogOut class="w-4 h-4 text-rose-500" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================
         3. ANDROID MENU SCREEN (FROM USER IMAGE 1)
         ======================================================== -->
    <MobileMenuDrawer
      :isOpen="isMobileMenuOpen"
      @close="isMobileMenuOpen = false"
    />

    <!-- ========================================================
         4. ANDROID SEARCH SCREEN (FROM USER IMAGE 3)
         ======================================================== -->
    <MobileSearchModal
      :isOpen="isSearchModalOpen"
      @close="isSearchModalOpen = false"
    />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
  Search,
  Home,
  Users,
  Sparkles,
  Building2,
  Store,
  Bell,
  MessageCircle,
  User as UserIcon,
  Bookmark,
  ChevronDown,
  Menu,
  LogOut,
  X
} from 'lucide-vue-next';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import { useNotificationStore } from '@/modules/notifications/store/notificationStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import MobileMenuDrawer from './MobileMenuDrawer.vue';
import MobileSearchModal from './MobileSearchModal.vue';
import RadarLogo from './RadarLogo.vue';
import SafeImage from './SafeImage.vue';

defineEmits(['open-create-post']);

const feedStore = useFeedStore();
const notificationStore = useNotificationStore();
const messengerStore = useMessengerStore();
const route = useRoute();

const showDropdown = ref(false);
const showMobileSearch = ref(false);
const isMobileMenuOpen = ref(false);
const isSearchModalOpen = ref(false);

const currentUser = feedStore.currentUser;

const unreadNotifs = computed(() => notificationStore.unreadCount);
const unreadMessages = computed(() => messengerStore.unreadCount);

const isFeedActive = computed(() => route.path === '/' || route.path === '/feeds');
const isFriendsActive = computed(() => route.path.startsWith('/radar') || route.path.startsWith('/friends'));
const isEmpresasActive = computed(() => route.path.startsWith('/empresas'));
const isNotificationsActive = computed(() => route.path.startsWith('/notifications'));
const isMarketplaceActive = computed(() => route.path.startsWith('/marketplace'));
const isProfileRoute = computed(() => route.path.startsWith('/profiles'));
const isFullMobileRoute = computed(() => {
  return route.path.startsWith('/profiles') || route.path.startsWith('/historys');
});
</script>
