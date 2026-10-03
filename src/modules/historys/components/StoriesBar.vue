<template>
  <div
    class="w-full overflow-x-auto no-scrollbar py-2 select-none"
    style="scrollbar-width: none; -ms-overflow-style: none;"
  >
    <div class="flex items-center gap-3 min-w-max pb-1">
      <!-- Create Story Button Card -->
      <button
        type="button"
        @click="historyStore.openCreateModal"
        class="relative w-32 sm:w-36 md:w-40 h-52 sm:h-56 rounded-md overflow-hidden bg-white shadow-xs border border-slate-200 flex flex-col group text-left cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        <div class="h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
          <SafeImage
            :src="currentUser.avatar"
            :alt="currentUser.name"
            containerClass="w-full h-full"
            imgClass="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div class="absolute top-32 sm:top-36 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center text-white shadow-sm transition-colors group-hover:bg-emerald-800">
          <Plus class="w-5 h-5 stroke-[2.5]" />
        </div>

        <div class="flex-1 flex items-end justify-center pb-3 pt-4 px-2 text-center">
          <span class="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
            Crear historia
          </span>
        </div>
      </button>

      <!-- Existing Stories -->
      <div
        v-for="(story, idx) in stories"
        :key="story.id"
        role="button"
        tabindex="0"
        @click="historyStore.openStoryViewer(idx)"
        @keydown.enter="historyStore.openStoryViewer(idx)"
        class="relative w-32 sm:w-36 md:w-40 h-52 sm:h-56 rounded-md overflow-hidden shadow-xs border border-slate-200 flex flex-col justify-between p-3 group cursor-pointer shrink-0 text-left select-none focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        <!-- Background Preview: Fully covers the card -->
        <template v-if="story.items[0]?.type === 'image' && story.items[0]?.mediaUrl">
          <div class="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black">
            <SafeImage
              :src="story.items[0].mediaUrl"
              :alt="story.authorName"
              containerClass="absolute inset-0 w-full h-full"
              imgClass="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
              fallbackText="Historia"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />
          </div>
        </template>
        <template v-else>
          <div
            class="absolute inset-0 z-0 w-full h-full flex items-center justify-center p-3 text-center"
            :style="{
              background: story.items[0]?.backgroundColor || 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            }"
          >
            <p v-if="story.items[0]?.textContent" class="text-xs sm:text-sm font-bold text-white line-clamp-4 drop-shadow-sm px-1">
              {{ story.items[0].textContent }}
            </p>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </template>

        <!-- Avatar Ring -->
        <div class="relative z-10">
          <button
            type="button"
            @click.stop="goToProfile(story.authorId)"
            class="w-10 h-10 rounded-full p-0.5 cursor-pointer focus:outline-none hover:ring-2 hover:ring-white transition-all shadow-sm"
            :class="[
              story.hasUnseen
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-300 ring-2 ring-emerald-400'
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
        </div>

        <!-- Author Name -->
        <div class="relative z-10">
          <span class="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-md line-clamp-2">
            {{ story.authorName }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Plus } from 'lucide-vue-next';
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

<style scoped>
div::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
</style>
