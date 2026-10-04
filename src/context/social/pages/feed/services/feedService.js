import { INITIAL_POSTS, PRESET_IMAGE_GALLERY } from '@/shared/data/initialData';

// Simulated REST Service for Feeds
export const feedService = {
  async fetchPosts() {
    // Simulates GET /api/posts
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...INITIAL_POSTS]);
      }, 50);
    });
  },

  async createPost(postData, currentUser) {
    // Simulates POST /api/posts
    return new Promise((resolve) => {
      const newPost = {
        id: `post_${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorUsername: currentUser.username,
        authorAvatar: currentUser.avatar,
        authorVerified: true,
        timestamp: 'Justo ahora',
        privacy: postData.privacy || 'public',
        content: postData.content || '',
        images: postData.images || [],
        location: postData.location,
        feeling: postData.feeling,
        reactions: {
          like: 0,
          love: 0,
          care: 0,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0,
        },
        reactionsList: [],
        comments: [],
        sharesCount: 0,
        isSaved: false,
      };
      resolve(newPost);
    });
  },

  async getPresetImages() {
    return Promise.resolve(PRESET_IMAGE_GALLERY);
  }
};
