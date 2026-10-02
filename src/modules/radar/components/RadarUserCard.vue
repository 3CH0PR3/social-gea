<template>
  <div v-if="user" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4 animate-in fade-in duration-150">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-emerald-500" />
        En tu radar ({{ user.radarDistance || 'Cerca' }})
      </span>
      <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
        <X class="w-4 h-4" />
      </button>
    </div>

    <div class="flex items-start gap-4">
      <SafeImage
        :src="user.avatar"
        :alt="user.name"
        imgClass="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-sm"
        containerClass="w-16 h-16 rounded-2xl shrink-0"
      />
      <div>
        <h3 class="font-bold text-slate-900 text-lg">{{ user.name }}</h3>
        <p class="text-xs text-slate-500">@{{ user.username }}</p>
        <p class="text-xs text-slate-600 flex items-center gap-1 mt-1">
          <MapPin class="w-3.5 h-3.5 text-slate-400" />
          {{ user.location }}
        </p>
      </div>
    </div>

    <p class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
      {{ user.bio }}
    </p>

    <div class="grid grid-cols-2 gap-2 text-center text-xs">
      <div class="bg-slate-50 p-2 rounded-xl">
        <span class="block font-bold text-slate-800">{{ user.friendsCount }}</span>
        <span class="text-[11px] text-slate-500">Amigos</span>
      </div>
      <div class="bg-slate-50 p-2 rounded-xl">
        <span class="block font-bold text-slate-800">{{ user.followersCount }}</span>
        <span class="text-[11px] text-slate-500">Seguidores</span>
      </div>
    </div>

    <div class="flex items-center gap-2 pt-2">
      <button
        type="button"
        @click="$emit('open-chat', user)"
        class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
      >
        <MessageCircle class="w-4 h-4" />
        <span>Enviar Mensaje</span>
      </button>
      <RouterLink
        :to="`/profiles/${user.id}`"
        class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
      >
        Ver Perfil
      </RouterLink>
    </div>
  </div>

  <div v-else class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 text-center py-10 space-y-3">
    <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
      <Radar class="w-6 h-6 animate-radar-ping" />
    </div>
    <h4 class="font-bold text-slate-800 text-sm">Selecciona una señal en el radar</h4>
    <p class="text-xs text-slate-500 max-w-xs mx-auto">
      Haz clic en cualquier nodo o usuario en el radar para inspeccionar su perfil y enviarle un mensaje.
    </p>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { X, MapPin, MessageCircle, Radar } from 'lucide-vue-next';
import SafeImage from '@/shared/components/SafeImage.vue';

defineProps({
  user: {
    type: Object,
    default: null,
  },
});

defineEmits(['close', 'open-chat']);
</script>
