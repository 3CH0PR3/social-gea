<template>
  <div class="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
    <!-- Top Cover & Avatar -->
    <div class="relative">
      <div class="h-24 sm:h-28 w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700">
        <img
          v-if="user.coverImage"
          :src="user.coverImage"
          :alt="user.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
        />
      </div>

      <!-- Avatar with Online Ring -->
      <div class="absolute -bottom-8 left-4 flex items-end">
        <RouterLink :to="`/profiles/${user.id}`" class="relative cursor-pointer block">
          <SafeImage
            :src="user.avatar"
            :alt="user.name"
            imgClass="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
            containerClass="w-16 h-16 rounded-2xl shrink-0"
          />
          <span
            v-if="user.isOnline"
            class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white"
            title="En línea"
          />
        </RouterLink>
      </div>

      <!-- Status badge on top right -->
      <div class="absolute top-2.5 right-2.5">
        <span
          v-if="user.status === 'friend'"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-white/90 backdrop-blur-md text-emerald-800 shadow-xs"
        >
          <UserCheck class="w-3 h-3 text-emerald-600" />
          Amigo
        </span>
        <span
          v-else-if="user.status === 'request_received'"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-rose-500 text-white shadow-xs"
        >
          <Clock class="w-3 h-3" />
          Solicitud
        </span>
      </div>
    </div>

    <!-- Body Information -->
    <div class="pt-10 p-4 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex items-start justify-between gap-2">
          <div>
            <RouterLink
              :to="`/profiles/${user.id}`"
              class="font-bold text-slate-900 text-sm hover:text-emerald-700 hover:underline line-clamp-1 cursor-pointer"
            >
              {{ user.name }}
            </RouterLink>
            <p class="text-xs text-slate-400">@{{ user.username }}</p>
          </div>
        </div>

        <!-- Colombian Location Tag -->
        <div class="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <MapPin class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span class="truncate">{{ user.city }}, {{ user.department }}</span>
        </div>

        <!-- Area / Interest Tag -->
        <div class="mt-2 flex items-center gap-1.5 flex-wrap">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
            <Briefcase class="w-3 h-3 text-emerald-600 shrink-0" />
            <span class="truncate">{{ user.area }}</span>
          </span>
        </div>

        <!-- Bio snippet -->
        <p v-if="user.bio" class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {{ user.bio }}
        </p>
      </div>

      <!-- Mutual friends count -->
      <div class="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
        <Users class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{{ user.mutualFriends }} amigos en común</span>
      </div>

      <!-- Action Buttons based on status -->
      <div class="mt-3.5 flex items-center gap-2">
        <!-- Status: Friend -->
        <template v-if="user.status === 'friend'">
          <button
            type="button"
            @click="handleOpenChat"
            class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
          >
            <MessageCircle class="w-3.5 h-3.5" />
            <span>Mensaje</span>
          </button>
          <RouterLink
            :to="`/profiles/${user.id}`"
            class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
          >
            Perfil
          </RouterLink>
        </template>

        <!-- Status: Request Received -->
        <template v-else-if="user.status === 'request_received'">
          <button
            type="button"
            @click="radarStore.acceptRequest(user.id)"
            class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
          >
            <Check class="w-3.5 h-3.5" />
            <span>Confirmar</span>
          </button>
          <button
            type="button"
            @click="radarStore.declineRequest(user.id)"
            class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer active:scale-98"
          >
            Eliminar
          </button>
        </template>

        <!-- Status: Suggestion -->
        <template v-else-if="user.status === 'suggestion'">
          <button
            type="button"
            @click="radarStore.sendRequest(user.id)"
            class="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
          >
            <UserPlus class="w-3.5 h-3.5" />
            <span>Agregar amigo</span>
          </button>
          <button
            type="button"
            @click="radarStore.cancelRequest(user.id)"
            class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-semibold transition-colors cursor-pointer"
            title="Quitar sugerencia"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </template>

        <!-- Status: Request Sent -->
        <template v-else-if="user.status === 'request_sent'">
          <button
            type="button"
            @click="radarStore.cancelRequest(user.id)"
            class="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check class="w-3.5 h-3.5 text-emerald-600" />
            <span>Solicitud enviada (Cancelar)</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import {
  MapPin,
  Briefcase,
  Users,
  MessageCircle,
  Check,
  UserPlus,
  UserCheck,
  X,
  Clock
} from 'lucide-vue-next';
import { useRadarStore } from '../store/radarStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const radarStore = useRadarStore();
const messengerStore = useMessengerStore();

function handleOpenChat() {
  messengerStore.openChatWithUser({
    id: props.user.id,
    name: props.user.name,
    avatar: props.user.avatar,
  });
}
</script>
