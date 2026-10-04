<template>
  <div class="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Android Top App Bar with Back Button (Hiding global navbar on mobile) -->
    <div class="sm:hidden sticky top-0 z-30 bg-white border-b border-slate-200/90 px-3.5 py-3 flex items-center justify-between shadow-2xs">
      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="handleBack"
          class="p-1.5 -ml-1 text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Volver"
        >
          <ArrowLeft class="w-5 h-5 stroke-[2.4]" />
        </button>
        <div>
          <h2 class="text-base font-bold text-slate-900 leading-tight">
            Historias de amigos
          </h2>
          <span class="text-[10.5px] text-slate-500 font-medium">
            Momentos 24 horas
          </span>
        </div>
      </div>

      <button
        type="button"
        @click="historyStore.openCreateModal"
        class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>Crear</span>
      </button>
    </div>

    <!-- Desktop Header -->
    <div class="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-xs border border-slate-200/90">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
          <span>Historias 24h</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Historias de amigos
        </h2>
        <p class="text-xs text-slate-500 mt-1">
          Momentos efímeros compartidos por tus amigos conectados
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

    <!-- Grid of Stories -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-0">
      <!-- Create Card -->
      <div
        @click="historyStore.openCreateModal"
        class="relative h-60 sm:h-64 rounded-2xl overflow-hidden bg-white border-2 border-dashed border-emerald-300 hover:border-emerald-500 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all hover:bg-emerald-50/30 group"
      >
        <div class="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
          <Plus class="w-6 h-6 stroke-[2.5]" />
        </div>
        <h4 class="text-xs font-bold text-slate-800">Comparte tu día</h4>
        <p class="text-[10.5px] sm:text-[11px] text-slate-500 mt-1">
          Sube una foto o comparte un texto con tus amigos
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
        class="relative h-60 sm:h-64 rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 cursor-pointer group flex flex-col justify-between p-3.5 select-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <div v-if="story.items[0]?.type === 'image' && story.items[0]?.mediaUrl" class="absolute inset-0 w-full h-full overflow-hidden bg-black">
          <SafeImage
            :src="story.items[0].mediaUrl"
            :alt="story.authorName"
            imgClass="w-full h-full object-cover block"
            containerClass="absolute inset-0 w-full h-full"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 pointer-events-none" />
        </div>

        <div
          v-else
          class="absolute inset-0 w-full h-full p-4 flex items-center justify-center text-center font-bold text-xs"
          :style="{
            background: story.items[0]?.backgroundColor || 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: story.items[0]?.textColor || '#ffffff'
          }"
        >
          <p class="line-clamp-4 leading-relaxed font-sans px-2">
            {{ story.items[0]?.textContent }}
          </p>
        </div>

        <!-- Top Author Avatar & Name -->
        <div class="relative z-10 flex items-center gap-2">
          <div
            :class="[
              'w-9 h-9 rounded-full p-0.5 shrink-0',
              story.hasUnseen
                ? 'bg-gradient-to-tr from-emerald-400 to-teal-400 ring-2 ring-emerald-500'
                : 'ring-1 ring-white/60 bg-white/20'
            ]"
          >
            <SafeImage
              :src="story.authorAvatar"
              :alt="story.authorName"
              imgClass="w-full h-full rounded-full object-cover"
              containerClass="w-full h-full"
            />
          </div>
          <span class="text-xs font-bold text-white drop-shadow-sm truncate">
            {{ story.authorName }}
          </span>
        </div>

        <!-- Bottom Preview text & indicator -->
        <div class="relative z-10">
          <p v-if="story.items[0]?.textContent && story.items[0]?.type === 'image'" class="text-[11px] text-white/90 drop-shadow-sm line-clamp-1 mb-1 font-medium">
            {{ story.items[0].textContent }}
          </p>
          <span class="text-[10px] text-white/70 block">
            {{ story.items[0]?.createdAt || 'Reciente' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateStoryModal
      :isOpen="isCreateModalOpen"
      @close="historyStore.closeCreateModal"
    />

    <StoryViewer
      :isOpen="isViewerOpen"
      :initialIndex="viewerStartIndex"
      :stories="stories"
      @close="historyStore.closeStoryViewer"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Sparkles, Plus, ArrowLeft } from 'lucide-vue-next';
import { useHistoryStore } from '../store/historyStore';
import CreateStoryModal from '../components/CreateStoryModal.vue';
import StoryViewer from '../components/StoryViewer.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const router = useRouter();
const historyStore = useHistoryStore();

const stories = computed(() => historyStore.stories);
const isCreateModalOpen = computed(() => historyStore.isCreateModalOpen);
const isViewerOpen = computed(() => historyStore.isViewerOpen);
const viewerStartIndex = computed(() => historyStore.viewerStartIndex);

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/feeds');
  }
}
</script>
