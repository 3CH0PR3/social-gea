<template>
  <div class="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-xs border border-slate-200/90">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
          <span>Historias 24h</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Historias de tu comunidad
        </h2>
        <p class="text-xs text-slate-500 mt-1">
          Momentos efímeros compartidos por tus amigos y contactos en el radar
        </p>
      </div>

      <button
        type="button"
        @click="historyStore.openCreateModal"
        class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Crear Historia</span>
      </button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <!-- Create Card -->
      <div
        @click="historyStore.openCreateModal"
        class="relative h-64 rounded-2xl overflow-hidden bg-white border-2 border-dashed border-emerald-300 hover:border-emerald-500 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all hover:bg-emerald-50/30 group"
      >
        <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Plus class="w-6 h-6 stroke-[2.5]" />
        </div>
        <h4 class="text-xs font-bold text-slate-800">Comparte tu día</h4>
        <p class="text-[11px] text-slate-500 mt-1">
          Sube una foto o comparte un texto con fondo degradado
        </p>
      </div>

      <!-- Stories Items -->
      <div
        v-for="(story, idx) in stories"
        :key="story.id"
        role="button"
        tabindex="0"
        @click="historyStore.openStoryViewer(idx)"
        @keydown.enter="historyStore.openStoryViewer(idx)"
        class="relative h-64 rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 cursor-pointer group flex flex-col justify-between p-3.5 select-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <div v-if="story.items[0]?.type === 'image' && story.items[0]?.mediaUrl" class="absolute inset-0 w-full h-full overflow-hidden bg-black">
          <SafeImage
            :src="story.items[0].mediaUrl"
            :alt="story.authorName"
            imgClass="w-full h-full object-cover block"
            containerClass="absolute inset-0 w-full h-full"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />
        </div>
        <div
          v-else
          class="absolute inset-0 w-full h-full flex items-center justify-center p-4 text-center"
          :style="{
            background: story.items[0]?.backgroundColor || 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          }"
        >
          <p v-if="story.items[0]?.textContent" class="text-xs font-bold text-white line-clamp-4 drop-shadow-sm">
            "{{ story.items[0].textContent }}"
          </p>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <!-- Top Avatar (Click goes to profile) -->
        <div class="relative z-10 flex items-center justify-between">
          <button
            type="button"
            @click.stop="goToProfile(story.authorId)"
            class="w-10 h-10 rounded-full p-0.5 cursor-pointer focus:outline-none hover:ring-2 hover:ring-white transition-all shadow-xs"
            :class="[
              story.hasUnseen
                ? 'bg-gradient-to-tr from-emerald-400 to-teal-200 ring-2 ring-emerald-500'
                : 'bg-white/40 ring-1 ring-white/60'
            ]"
            :title="`Ver perfil de ${story.authorName}`"
            aria-label="Ver perfil"
          >
            <img
              :src="story.authorAvatar"
              :alt="story.authorName"
              class="w-full h-full rounded-full object-cover"
            />
          </button>
          <span class="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
            {{ story.items.length }} {{ story.items.length === 1 ? 'historia' : 'historias' }}
          </span>
        </div>

        <!-- Bottom Name -->
        <div class="relative z-10 space-y-1">
          <p v-if="story.items[0]?.textContent && story.items[0]?.type === 'image'" class="text-xs text-white/90 font-medium line-clamp-2 drop-shadow-sm">
            "{{ story.items[0].textContent }}"
          </p>
          <h4 class="text-xs font-bold text-white drop-shadow-md truncate">
            {{ story.authorName }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Sparkles, Plus } from 'lucide-vue-next';
import { useHistorys } from '../composables/useHistorys';
import { useHistoryStore } from '../store/historyStore';
import SafeImage from '@/shared/components/SafeImage.vue';

const router = useRouter();
const { stories, currentUser } = useHistorys();
const historyStore = useHistoryStore();

function goToProfile(authorId) {
  if (!authorId || authorId === currentUser.value?.id || authorId === 'user_current') {
    router.push('/profiles');
  } else {
    router.push(`/profiles/${authorId}`);
  }
}
</script>
