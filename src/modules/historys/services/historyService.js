import { INITIAL_STORIES } from '@/shared/data/initialData';

export const historyService = {
  async fetchStories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...INITIAL_STORIES]);
      }, 50);
    });
  },

  async createStory(storyItem, currentUser) {
    return Promise.resolve({
      id: `story_item_${Date.now()}`,
      ...storyItem,
    });
  }
};
