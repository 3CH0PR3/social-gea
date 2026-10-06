<template>
  <header
    :class="[
      'sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs select-none',
      isFullMobileRoute ? 'hidden sm:block' : ''
    ]"
  >
    <!-- ========================================================
         1. ANDROID / MOBILE NAVBAR (FACEBOOK ANDROID TOP NAVBAR)
         ======================================================== -->
    <div class="sm:hidden">
      <!-- Line 1: Brand & Action Buttons -->
      <div class="px-4 pt-2.5 pb-1 flex items-center justify-between">
        <RouterLink
          to="/feeds"
          class="text-2xl font-black text-emerald-700 font-display tracking-tight hover:opacity-90 transition-opacity"
        >
          socialgea
        </RouterLink>

        <div class="flex items-center gap-2">
          <!-- Round Search Button -->
          <button
            type="button"
            @click="isSearchModalOpen = true"
            class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Buscar personas"
          >
            <Search class="w-4 h-4 stroke-[2.2]" />
          </button>

          <!-- Round Hamburger Menu Button -->
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
        <div class="flex items-center gap-2 bg-white rounded-md px-3 py-1.5 border border-slate-200 shadow-2xs">
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

      <!-- Line 2: 6 Top Tabs (Facebook Android Layout) -->
      <div class="grid grid-cols-6 items-center border-t border-slate-100">
        <!-- 1. Feed -->
        <RouterLink
          to="/feeds"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isFeedActive ? '!text-emerald-700' : ''"
          title="Feed"
        >
          <Home class="w-5 h-5 stroke-[2]" />
          <span
            v-if="isFeedActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>

        <!-- 2. Amigos -->
        <RouterLink
          to="/radar"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isFriendsActive ? '!text-emerald-700' : ''"
          title="Amigos"
        >
          <Users class="w-5 h-5 stroke-[2]" />
          <span
            v-if="isFriendsActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-t-full"
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
            <MessageCircle class="w-5 h-5 stroke-[2]" />
            <span
              v-if="unreadMessages > 0"
              class="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center"
            >
              {{ unreadMessages }}
            </span>
          </div>
        </button>

        <!-- 4. Empresas -->
        <RouterLink
          to="/empresas"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isEmpresasActive ? '!text-emerald-700' : ''"
          title="Empresas de Reciclaje"
        >
          <Building2 class="w-5 h-5 stroke-[2]" />
          <span
            v-if="isEmpresasActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>

        <!-- 5. Notificaciones -->
        <RouterLink
          to="/notifications"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isNotificationsActive ? '!text-emerald-700' : ''"
          title="Notificaciones"
        >
          <div class="relative">
            <Bell class="w-5 h-5 stroke-[2]" />
            <span
              v-if="unreadNotifs > 0"
              class="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center"
            >
              {{ unreadNotifs }}
            </span>
          </div>
          <span
            v-if="isNotificationsActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>

        <!-- 6. Marketplace (Premios & Recompensas) -->
        <RouterLink
          to="/marketplace"
          class="relative flex items-center justify-center py-2.5 text-slate-500 hover:text-slate-800 transition-colors"
          :class="isMarketplaceActive ? '!text-emerald-700' : ''"
          title="Marketplace"
        >
          <Store class="w-5 h-5 stroke-[2]" />
          <span
            v-if="isMarketplaceActive"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>
      </div>
    </div>

    <!-- ========================================================
         2. DESKTOP NAVBAR (EXPANSIVE DESKTOP LAYOUT)
         ======================================================== -->
    <div class="hidden sm:flex max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 items-center justify-between gap-2 md:gap-4">
      <!-- Zone 1: Logo & Search -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <RouterLink to="/feeds" class="flex items-center focus:outline-none shrink-0" aria-label="Ir a Inicio">
          <RadarLogo :size="38" :showText="false" />
        </RouterLink>

        <!-- Search Bar with Responsive Width -->
        <div class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600 rounded-full px-3 py-1.5 sm:py-2 transition-all w-32 sm:w-40 md:w-52 lg:w-64 border border-transparent focus-within:border-emerald-600">
          <Search class="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            :value="feedStore.searchQuery"
            @input="feedStore.setSearch($event.target.value)"
            placeholder="Buscar en Socialgea..."
            class="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 outline-none placeholder-slate-400 min-w-0"
          />
          <button v-if="feedStore.searchQuery" @click="feedStore.setSearch('')" class="text-slate-400 p-0.5 cursor-pointer">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Zone 2: Navigation Links for Desktop with Responsive Padding -->
      <nav class="flex items-center gap-0.5 sm:gap-1 md:gap-2 h-full">
        <RouterLink
          to="/feeds"
          class="relative flex items-center justify-center px-2.5 sm:px-3 md:px-5 lg:px-7 h-full transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-md my-1"
          active-class="text-emerald-800 font-bold !bg-transparent"
          title="Inicio"
        >
          <Home class="w-5 sm:w-6 h-5 sm:h-6" />
          <span
            v-if="isFeedActive"
            class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/radar"
          class="relative flex items-center justify-center px-2.5 sm:px-3 md:px-5 lg:px-7 h-full transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-md my-1"
          active-class="text-emerald-800 font-bold !bg-transparent"
          title="Amigos"
        >
          <Users class="w-5 sm:w-6 h-5 sm:h-6" />
          <span
            v-if="isFriendsActive"
            class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/historys"
          class="relative flex items-center justify-center px-2.5 sm:px-3 md:px-5 lg:px-7 h-full transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-md my-1"
          active-class="text-emerald-800 font-bold !bg-transparent"
          title="Historias de amigos"
        >
          <Sparkles class="w-5 sm:w-6 h-5 sm:h-6" />
          <span
            v-if="route.path === '/historys'"
            class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/empresas"
          class="relative flex items-center justify-center px-2.5 sm:px-3 md:px-5 lg:px-7 h-full transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-md my-1"
          active-class="text-emerald-800 font-bold !bg-transparent"
          title="Empresas de Reciclaje"
        >
          <Building2 class="w-5 sm:w-6 h-5 sm:h-6" />
          <span
            v-if="isEmpresasActive"
            class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/marketplace"
          class="relative flex items-center justify-center px-2.5 sm:px-3 md:px-5 lg:px-7 h-full transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-md my-1"
          active-class="text-emerald-800 font-bold !bg-transparent"
          title="Premios & Recompensas"
        >
          <Store class="w-5 sm:w-6 h-5 sm:h-6" />
          <span
            v-if="isMarketplaceActive"
            class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-700 rounded-t-full"
          />
        </RouterLink>
      </nav>

      <!-- Zone 3: Actions (Notifications, Messages, User Profile) -->
      <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <!-- Notifications button -->
        <RouterLink
          to="/notifications"
          class="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          title="Notificaciones"
        >
          <Bell class="w-5 h-5" />
          <span
            v-if="unreadNotifs > 0"
            class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center"
          >
            {{ unreadNotifs }}
          </span>
        </RouterLink>

        <!-- Messenger trigger button -->
        <button
          type="button"
          @click="messengerStore.toggleDrawer"
          class="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          title="Mensajes de Socialgea"
        >
          <MessageCircle class="w-5 h-5" />
          <span
            v-if="unreadMessages > 0"
            class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center"
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
            <div class="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-emerald-600 to-teal-400">
              <SafeImage
                :src="currentUser.avatar"
                :alt="currentUser.name"
                imgClass="w-full h-full rounded-full object-cover"
                containerClass="w-full h-full"
              />
            </div>
            <ChevronDown class="w-4 h-4 text-slate-500" />
          </button>

          <div
            v-if="showDropdown"
            class="absolute right-0 top-12 w-72 bg-white rounded-md shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
            @click="showDropdown = false"
          >
            <RouterLink
              :to="`/profiles/${currentUser.id}`"
              class="px-4 py-3 flex items-center gap-3.5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
            >
              <img
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-600"
              />
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-slate-900 truncate">{{ currentUser.name }}</h4>
                <span class="text-xs text-emerald-700 font-semibold">Ver mi perfil</span>
              </div>
            </RouterLink>

            <div class="py-1.5">
              <RouterLink
                :to="`/profiles/${currentUser.id}`"
                class="w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 text-left"
              >
                <UserIcon class="w-5 h-5 text-slate-400" />
                <span>Tu perfil</span>
              </RouterLink>

              <RouterLink
                to="/feeds"
                @click="feedStore.setFilter('saved')"
                class="w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 text-left"
              >
                <Bookmark class="w-5 h-5 text-slate-400" />
                <span>Publicaciones guardadas</span>
              </RouterLink>

              <button
                type="button"
                @click="showDropdown = false"
                class="w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 text-left cursor-pointer"
              >
                <Settings class="w-5 h-5 text-slate-400" />
                <span>Configuración y privacidad</span>
              </button>

              <RouterLink
                to="/landing"
                @click="showDropdown = false"
                class="w-full px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 flex items-center gap-3 text-left"
              >
                <Compass class="w-5 h-5 text-emerald-700" />
                <span>Landing de Socialgea</span>
              </RouterLink>

              <div class="my-1.5 border-t border-slate-100" />

              <button
                type="button"
                @click="handleLogout"
                class="w-full px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 text-left cursor-pointer"
              >
                <LogOut class="w-5 h-5 text-rose-500" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================
         3. ANDROID MENU SCREEN
         ======================================================== -->
    <MobileMenuDrawer
      :isOpen="isMobileMenuOpen"
      @close="isMobileMenuOpen = false"
    />

    <!-- ========================================================
         4. ANDROID SEARCH SCREEN
         ======================================================== -->
    <MobileSearchModal
      :isOpen="isSearchModalOpen"
      @close="isSearchModalOpen = false"
    />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
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
  X,
  Settings,
  Compass
} from 'lucide-vue-next';
import { useFeedStore } from '@/context/social/pages/feed/store/feedStore';
import { useNotificationStore } from '@/context/social/pages/notifications/store/notificationStore';
import { useMessengerStore } from '@/context/social/pages/messenger/store/messengerStore';
import { useAuthStore } from '@/context/social/auth/stores/useAuth.store';
import MobileMenuDrawer from './MobileMenuDrawer.vue';
import MobileSearchModal from './MobileSearchModal.vue';
import RadarLogo from './RadarLogo.vue';
import SafeImage from './SafeImage.vue';

defineEmits(['open-create-post']);

const feedStore = useFeedStore();
const notificationStore = useNotificationStore();
const messengerStore = useMessengerStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const showDropdown = ref(false);
const showMobileSearch = ref(false);
const isMobileMenuOpen = ref(false);
const isSearchModalOpen = ref(false);

const currentUser = feedStore.currentUser;

function handleLogout() {
  showDropdown.value = false;
  authStore.logout();
  router.push('/auth/login');
}

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
