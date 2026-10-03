<template>
  <div class="feed-container">
    <!-- Stories Carousel Bar -->
    <StoriesBar />

    <!-- Create Post Card Trigger -->
    <div class="feed-composer-card">
      <div class="feed-composer-inner">
        <RouterLink :to="`/profiles/${currentUser.id}`" class="cursor-pointer shrink-0">
          <SafeImage
            :src="currentUser.avatar"
            :alt="currentUser.name"
            imgClass="w-full h-full object-cover"
            containerClass="feed-composer-avatar"
          />
        </RouterLink>

        <button
          type="button"
          @click="isComposerOpen = true"
          class="feed-composer-prompt-btn"
        >
          ¿Qué estás pensando, {{ currentUser.name.split(' ')[0] }}?
        </button>

        <!-- Only photo and feeling icons beside the input -->
        <button
          type="button"
          @click="isComposerOpen = true"
          class="feed-composer-icon-btn photo"
          title="Foto"
          aria-label="Foto"
        >
          <ImageIcon class="w-5 h-5 stroke-[2.2]" />
        </button>

        <button
          type="button"
          @click="isComposerOpen = true"
          class="feed-composer-icon-btn feeling"
          title="Sentimiento"
          aria-label="Sentimiento"
        >
          <Smile class="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>

    <!-- Posts Feed Stream -->
    <div class="space-y-4">
      <div v-if="filteredPosts.length === 0" class="feed-empty-state">
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

const { filteredPosts } = useFeed();
const feedStore = useFeedStore();
const historyStore = useHistoryStore();
const currentUser = feedStore.currentUser;

const isComposerOpen = ref(false);
</script>
