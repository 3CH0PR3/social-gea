<template>
  <div class="space-y-4">
    <!-- Stories Carousel Bar -->
    <StoriesBar />

    <!-- Create Post Card Trigger (Only Photo & Feeling icons beside the input) -->
    <div class="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-3.5 sm:p-4">
      <div class="flex items-center gap-2.5 sm:gap-3">
        <RouterLink :to="`/profiles/${currentUser.id}`" class="cursor-pointer shrink-0">
          <SafeImage
            :src="currentUser.avatar"
            :alt="currentUser.name"
            imgClass="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/80"
            containerClass="w-10 h-10 rounded-full"
          />
        </RouterLink>

        <button
          type="button"
          @click="isComposerOpen = true"
          class="flex-1 text-left bg-slate-100 hover:bg-slate-200/70 text-slate-500 text-xs sm:text-sm px-4 py-2.5 rounded-full transition-colors font-medium truncate cursor-pointer"
        >
          ¿Qué estás pensando, {{ currentUser.name.split(' ')[0] }}?
        </button>

        <!-- Only photo and feeling icons beside the input -->
        <button
          type="button"
          @click="isComposerOpen = true"
          class="p-2 sm:p-2.5 rounded-full hover:bg-slate-100 text-emerald-600 transition-colors cursor-pointer shrink-0"
          title="Foto"
          aria-label="Foto"
        >
          <ImageIcon class="w-5 h-5 stroke-[2.2]" />
        </button>

        <button
          type="button"
          @click="isComposerOpen = true"
          class="p-2 sm:p-2.5 rounded-full hover:bg-slate-100 text-amber-500 transition-colors cursor-pointer shrink-0"
          title="Sentimiento"
          aria-label="Sentimiento"
        >
          <Smile class="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>

    <!-- Posts Feed Stream -->
    <div class="space-y-4">
      <div v-if="filteredPosts.length === 0" class="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
        No se encontraron publicaciones.
      </div>

      <PostCard
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
      />
    </div>

    <!-- Modals -->
    <PostComposer
      :isOpen="isComposerOpen"
      @close="isComposerOpen = false"
    />

    <CreateStoryModal
      :isOpen="historyStore.isCreateModalOpen"
      @close="historyStore.closeCreateModal"
    />

    <StoryViewer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Image as ImageIcon, Smile } from 'lucide-vue-next';
import { useFeed } from '../composables/useFeed';
import { useFeedStore } from '../store/feedStore';
import { useHistoryStore } from '@/modules/historys/store/historyStore';
import StoriesBar from '@/modules/historys/components/StoriesBar.vue';
import StoryViewer from '@/modules/historys/components/StoryViewer.vue';
import CreateStoryModal from '@/modules/historys/components/CreateStoryModal.vue';
import PostCard from '../components/PostCard.vue';
import PostComposer from '../components/PostComposer.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const { filteredPosts, filter, setFilter } = useFeed();
const feedStore = useFeedStore();
const historyStore = useHistoryStore();
const currentUser = feedStore.currentUser;

const isComposerOpen = ref(false);
</script>
