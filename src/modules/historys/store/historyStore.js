import { defineStore } from 'pinia';
import { historyService } from '../services/historyService';
import { CURRENT_USER } from '@/shared/data/initialData';

export const useHistoryStore = defineStore('history', {
  state: () => ({
    stories: [],
    currentUser: CURRENT_USER,
    isCreateModalOpen: false,
    viewer: {
      isOpen: false,
      initialIndex: 0,
    },
  }),

  actions: {
    async loadStories() {
      if (this.stories.length > 0) return;
      this.stories = await historyService.fetchStories();
    },

    openStoryViewer(index) {
      this.viewer = {
        isOpen: true,
        initialIndex: index,
      };
    },

    closeStoryViewer() {
      this.viewer.isOpen = false;
    },

    openCreateModal() {
      this.isCreateModalOpen = true;
    },

    closeCreateModal() {
      this.isCreateModalOpen = false;
    },

    async addStoryItem(storyItem) {
      const createdItem = await historyService.createStory(storyItem, this.currentUser);
      const userStory = this.stories.find((s) => s.authorId === this.currentUser.id);

      if (userStory) {
        userStory.items.unshift(createdItem);
      } else {
        this.stories.unshift({
          id: `story_${Date.now()}`,
          authorId: this.currentUser.id,
          authorName: this.currentUser.name,
          authorAvatar: this.currentUser.avatar,
          hasUnseen: false,
          items: [createdItem],
        });
      }
    },

    deleteStoryItem(storyId, itemId) {
      const story = this.stories.find((s) => s.id === storyId || s.authorId === this.currentUser.id);
      if (!story) return;
      story.items = story.items.filter((it) => it.id !== itemId);
      if (story.items.length === 0) {
        this.stories = this.stories.filter((s) => s.id !== story.id);
        this.closeStoryViewer();
      }
    },
  },
});
