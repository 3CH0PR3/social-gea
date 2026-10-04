import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { historyService } from '../services/historyService';
import { CURRENT_USER } from '@/shared/data/initialData';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

export const useStoriesStore = defineStore('social.stories', () => {
  const eventBus = useEventBus();

  const stories = ref([]);
  const currentUser = ref(CURRENT_USER);
  const isCreateModalOpen = ref(false);
  const viewer = ref({
    isOpen: false,
    initialIndex: 0,
  });
  const isLoading = ref(false);
  const errorMsg = ref(null);

  const isViewerOpen = computed(() => viewer.value.isOpen);
  const viewerStartIndex = computed(() => viewer.value.initialIndex);

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err?.message || 'Error inesperado';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const loadStories = async () => {
    if (stories.value.length > 0) return stories.value;
    return executeAsync(async () => {
      const data = await historyService.fetchStories();
      stories.value = data;
      return data;
    });
  };

  const openStoryViewer = (index) => {
    viewer.value = {
      isOpen: true,
      initialIndex: index,
    };
  };

  const closeStoryViewer = () => {
    viewer.value.isOpen = false;
  };

  const openCreateModal = () => {
    isCreateModalOpen.value = true;
  };

  const closeCreateModal = () => {
    isCreateModalOpen.value = false;
  };

  const hasStoryForUser = (userId) => {
    if (!userId) return false;
    const story = stories.value.find(
      (s) =>
        s.authorId === userId ||
        (userId === currentUser.value?.id &&
          (s.authorId === 'user_current' || s.authorName === 'Tu historia'))
    );
    return Boolean(story && story.items && story.items.length > 0);
  };

  const openStoryForUser = (userId) => {
    if (!userId) return false;
    const idx = stories.value.findIndex(
      (s) =>
        s.authorId === userId ||
        (userId === currentUser.value?.id &&
          (s.authorId === 'user_current' || s.authorName === 'Tu historia'))
    );
    if (idx !== -1) {
      openStoryViewer(idx);
      return true;
    }
    return false;
  };

  const addStory = (storyItem) => {
    let myStory = stories.value.find(
      (s) =>
        s.authorId === currentUser.value.id ||
        s.authorId === 'user_current' ||
        s.authorName === 'Tu historia'
    );

    const newItem = {
      id: 'st_item_' + Date.now(),
      type: storyItem.type || 'image',
      mediaUrl: storyItem.mediaUrl,
      caption: storyItem.caption || '',
      textContent: storyItem.textContent || '',
      backgroundColor: storyItem.backgroundGradient || storyItem.backgroundColor || '',
      textColor: storyItem.textColor || '#ffffff',
      timestamp: 'Ahora',
      duration: 5,
    };

    if (myStory) {
      myStory.items.push(newItem);
      myStory.unseen = true;
    } else {
      myStory = {
        id: 'st_me_' + Date.now(),
        authorId: currentUser.value.id,
        authorName: 'Tu historia',
        authorAvatar: currentUser.value.avatar,
        unseen: true,
        items: [newItem],
      };
      stories.value.unshift(myStory);
    }

    eventBus.emit(EVENTS.STORY_CREATED, newItem);
    closeCreateModal();
  };

  const addStoryItem = addStory;
  const createStory = addStory;

  const deleteStoryItem = (storyId, itemId) => {
    const story = stories.value.find((s) => s.id === storyId);
    if (story) {
      story.items = story.items.filter((it) => it.id !== itemId);
      if (story.items.length === 0) {
        stories.value = stories.value.filter((s) => s.id !== storyId);
        closeStoryViewer();
      }
    }
  };

  return {
    stories,
    currentUser,
    isCreateModalOpen,
    viewer,
    isViewerOpen,
    viewerStartIndex,
    isLoading,
    errorMsg,
    executeAsync,
    loadStories,
    openStoryViewer,
    closeStoryViewer,
    openCreateModal,
    closeCreateModal,
    hasStoryForUser,
    openStoryForUser,
    addStory,
    addStoryItem,
    createStory,
    deleteStoryItem,
  };
});

export const useHistoryStore = useStoriesStore;
