import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

export const usePostReactionsStore = defineStore('social.reactions', () => {
  const eventBus = useEventBus();

  const isReactionsModalOpen = ref(false);
  const activePostForReactions = ref(null);
  const activeTab = ref('all');

  const openReactionsModal = (post, initialTab = 'all') => {
    activePostForReactions.value = post;
    activeTab.value = initialTab;
    isReactionsModalOpen.value = true;
  };

  const closeReactionsModal = () => {
    isReactionsModalOpen.value = false;
    activePostForReactions.value = null;
    activeTab.value = 'all';
  };

  const setActiveTab = (tab) => {
    activeTab.value = tab;
  };

  const handleToggleReaction = (post, reactionType = 'like') => {
    if (!post) return;

    if (!post.reactions) {
      post.reactions = { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
    }

    const currentReaction = post.userReaction;

    if (!reactionType || currentReaction === reactionType) {
      // Remover reacción
      if (currentReaction && post.reactions[currentReaction] > 0) {
        post.reactions[currentReaction]--;
      }
      post.userReaction = null;
    } else {
      // Cambiar o agregar reacción
      if (currentReaction && post.reactions[currentReaction] > 0) {
        post.reactions[currentReaction]--;
      }
      post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
      post.userReaction = reactionType;
    }

    eventBus.emit(EVENTS.REACTION_UPDATED, {
      postId: post.id,
      userReaction: post.userReaction,
      reactions: { ...post.reactions },
    });
  };

  return {
    isReactionsModalOpen,
    activePostForReactions,
    activeTab,
    openReactionsModal,
    closeReactionsModal,
    setActiveTab,
    handleToggleReaction,
  };
});
