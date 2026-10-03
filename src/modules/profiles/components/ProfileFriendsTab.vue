<template>
  <div class="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
      <div>
        <h3 class="font-extrabold text-slate-900 text-lg font-display">Amigos</h3>
        <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
          {{ friendList.length }} amigos en total
        </p>
      </div>

      <!-- Search input -->
      <div class="relative w-full sm:w-72">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar amigos..."
          class="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
        />
      </div>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="toastMessage"
      class="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <span>{{ toastMessage }}</span>
      <button type="button" @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 cursor-pointer">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Friends Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="friend in filteredFriends"
        :key="friend.id"
        class="relative flex items-center justify-between p-3.5 rounded-md border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all group"
      >
        <div
          class="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
          @click="handleGoToProfile(friend.id)"
        >
          <div class="w-14 h-14 rounded-md overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0 group-hover:ring-emerald-600 transition-all">
            <SafeImage
              :src="friend.avatar"
              :alt="friend.name"
              imgClass="w-full h-full object-cover"
              containerClass="w-full h-full"
            />
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
              {{ friend.name }}
            </h4>
            <p class="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">
              {{ friend.mutualInfo || 'Amigo en Socialgea' }}
            </p>
          </div>
        </div>

        <!-- Options Menu Button -->
        <div class="relative shrink-0">
          <button
            type="button"
            @click.stop="toggleMenu(friend.id)"
            class="p-2 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Opciones"
          >
            <MoreHorizontal class="w-4.5 h-4.5" />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="activeMenuFriendId === friend.id"
            class="absolute right-0 top-10 w-48 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-left"
            @click.stop
          >
            <!-- 1. Ver perfil (Always available) -->
            <button
              type="button"
              @click="handleGoToProfile(friend.id)"
              class="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
            >
              <User class="w-4 h-4 text-slate-400" />
              <span>Ver perfil</span>
            </button>

            <!-- 2. Enviar mensaje (Always available) -->
            <button
              type="button"
              @click="handleOpenChat(friend)"
              class="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
            >
              <MessageCircle class="w-4 h-4 text-emerald-600" />
              <span>Enviar mensaje</span>
            </button>

            <div class="my-1 border-t border-slate-100" />

            <!-- 3. If in OWN PROFILE: Eliminar amigo -->
            <button
              v-if="isOwnProfile"
              type="button"
              @click="handleRemoveFriend(friend)"
              class="w-full px-3.5 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-semibold"
            >
              <UserMinus class="w-4 h-4 text-rose-500" />
              <span>Eliminar amigo</span>
            </button>

            <!-- 4. If in SOMEONE ELSE'S PROFILE: Agregar amigo -->
            <button
              v-else
              type="button"
              @click="handleAddFriend(friend)"
              class="w-full px-3.5 py-2 text-xs sm:text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 cursor-pointer font-semibold"
            >
              <UserPlus class="w-4 h-4 text-emerald-600" />
              <span>Agregar amigo</span>
            </button>

            <!-- 5. Reportar perfil -->
            <button
              type="button"
              @click="handleReportFriend(friend)"
              class="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
            >
              <ShieldAlert class="w-4 h-4 text-amber-500" />
              <span>Reportar perfil</span>
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="filteredFriends.length === 0"
        class="col-span-full py-10 text-center text-xs sm:text-sm text-slate-400"
      >
        No se encontraron amigos que coincidan con la búsqueda.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Search,
  MoreHorizontal,
  User,
  MessageCircle,
  UserMinus,
  UserPlus,
  ShieldAlert,
  X
} from 'lucide-vue-next';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  friends: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['go-to-profile', 'remove-friend']);
const route = useRoute();
const router = useRouter();
const feedStore = useFeedStore();
const messengerStore = useMessengerStore();

const searchQuery = ref('');
const activeMenuFriendId = ref(null);
const toastMessage = ref('');
const friendList = ref([...props.friends]);

watch(
  () => props.friends,
  (newFriends) => {
    friendList.value = [...newFriends];
  },
  { deep: true, immediate: true }
);

const isOwnProfile = computed(() => {
  const currentId = feedStore.currentUser.id;
  return !route.params.id || route.params.id === currentId || route.params.id === 'user_current';
});

const filteredFriends = computed(() => {
  if (!searchQuery.value.trim()) return friendList.value;
  const q = searchQuery.value.toLowerCase().trim();
  return friendList.value.filter(
    (f) => f.name.toLowerCase().includes(q) || (f.mutualInfo && f.mutualInfo.toLowerCase().includes(q))
  );
});

function handleGoToProfile(friendId) {
  activeMenuFriendId.value = null;
  emit('go-to-profile', friendId);
  router.push(`/profiles/${friendId}`);
}

function handleOpenChat(friend) {
  activeMenuFriendId.value = null;
  messengerStore.openWithUser(friend);
}

function toggleMenu(friendId) {
  activeMenuFriendId.value = activeMenuFriendId.value === friendId ? null : friendId;
}

function handleRemoveFriend(friend) {
  activeMenuFriendId.value = null;
  friendList.value = friendList.value.filter((f) => f.id !== friend.id);
  toastMessage.value = `${friend.name} ha sido eliminado de tu lista de amigos.`;
  emit('remove-friend', friend.id);
}

function handleAddFriend(friend) {
  activeMenuFriendId.value = null;
  toastMessage.value = `Has enviado una solicitud de amistad a ${friend.name}.`;
}

function handleReportFriend(friend) {
  activeMenuFriendId.value = null;
  toastMessage.value = `Se ha enviado el reporte sobre ${friend.name}. Gracias por ayudar a mantener Socialgea segura.`;
}

function closeMenuOnClickOutside() {
  activeMenuFriendId.value = null;
}

onMounted(() => {
  window.addEventListener('click', closeMenuOnClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', closeMenuOnClickOutside);
});
</script>
