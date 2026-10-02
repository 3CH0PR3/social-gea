import { defineStore } from 'pinia';
import { feedService } from '../services/feedService';
import { CURRENT_USER } from '@/shared/data/initialData';

export const useFeedStore = defineStore('feed', {
  state: () => ({
    posts: [],
    isLoading: false,
    filter: 'all', // 'all' | 'friends' | 'popular' | 'saved'
    searchQuery: '',
    currentUser: CURRENT_USER,
    lightbox: {
      isOpen: false,
      images: [],
      activeIndex: 0,
    },
    lightboxImage: null, // backwards compatibility
  }),

  getters: {
    currentLightboxImage: (state) => {
      if (!state.lightbox.isOpen || state.lightbox.images.length === 0) return null;
      return state.lightbox.images[state.lightbox.activeIndex] || null;
    },
    filteredPosts: (state) => {
      return state.posts.filter((p) => {
        const matchesSearch =
          state.searchQuery === '' ||
          p.content.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          p.authorName.toLowerCase().includes(state.searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (state.filter === 'friends') {
          return p.authorId !== state.currentUser.id;
        }
        if (state.filter === 'popular') {
          const totalReactions = Object.values(p.reactions).reduce((a, b) => a + b, 0);
          return totalReactions > 40;
        }
        if (state.filter === 'saved') {
          return p.isSaved;
        }
        return true;
      });
    },

    savedPosts: (state) => state.posts.filter((p) => p.isSaved),
  },

  actions: {
    async loadPosts() {
      if (this.posts.length > 0) return;
      this.isLoading = true;
      try {
        this.posts = await feedService.fetchPosts();
      } finally {
        this.isLoading = false;
      }
    },

    async addPost(postData) {
      const newPost = await feedService.createPost(postData, this.currentUser);
      this.posts.unshift(newPost);
    },

    removePost(postId) {
      this.posts = this.posts.filter((p) => p.id !== postId);
    },

    toggleReaction(postId, reactionType) {
      const post = this.posts.find((p) => p.id === postId);
      if (!post) return;

      const previous = post.userReaction;

      // Decrement previous if existed
      if (previous) {
        post.reactions[previous] = Math.max(0, post.reactions[previous] - 1);
        const idx = post.reactionsList.findIndex((r) => r.userId === this.currentUser.id);
        if (idx !== -1) post.reactionsList.splice(idx, 1);
      }

      // If clicked the same, remove reaction
      if (previous === reactionType || !reactionType) {
        post.userReaction = null;
      } else {
        // Apply new reaction
        post.userReaction = reactionType;
        post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
        post.reactionsList.unshift({
          userId: this.currentUser.id,
          userName: this.currentUser.name,
          userAvatar: this.currentUser.avatar,
          type: reactionType,
        });
      }
    },

    addComment(postId, content, imageUrl = null, parentCommentId = null) {
      const post = this.posts.find((p) => p.id === postId);
      if (!post) return;

      const newComment = {
        id: `comm_${Date.now()}`,
        authorId: this.currentUser.id,
        authorName: this.currentUser.name,
        authorAvatar: this.currentUser.avatar,
        content,
        imageUrl,
        timestamp: 'Justo ahora',
        likesCount: 0,
        isLiked: false,
      };

      if (parentCommentId) {
        const parent = post.comments.find((c) => c.id === parentCommentId);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(newComment);
        }
      } else {
        post.comments.push(newComment);
      }
    },

    toggleLikeComment(postId, commentId) {
      const post = this.posts.find((p) => p.id === postId);
      if (!post) return;

      for (const comment of post.comments) {
        if (comment.id === commentId) {
          comment.isLiked = !comment.isLiked;
          comment.likesCount += comment.isLiked ? 1 : -1;
          return;
        }
        if (comment.replies) {
          for (const reply of comment.replies) {
            if (reply.id === commentId) {
              reply.isLiked = !reply.isLiked;
              reply.likesCount += reply.isLiked ? 1 : -1;
              return;
            }
          }
        }
      }
    },

    deleteComment(postId, commentId) {
      const post = this.posts.find((p) => p.id === postId);
      if (!post) return;
      post.comments = post.comments.filter((c) => c.id !== commentId);
    },

    toggleSavePost(postId) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.isSaved = !post.isSaved;
      }
    },

    sharePost(originalPost, quote = '') {
      originalPost.sharesCount++;

      if (quote) {
        const repost = {
          id: `repost_${Date.now()}`,
          authorId: this.currentUser.id,
          authorName: this.currentUser.name,
          authorUsername: this.currentUser.username,
          authorAvatar: this.currentUser.avatar,
          authorVerified: true,
          timestamp: 'Justo ahora',
          privacy: 'public',
          content: `"${quote}"\n\nCompartiendo publicación de @${originalPost.authorUsername}:`,
          images: originalPost.images,
          reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
          reactionsList: [],
          comments: [],
          sharesCount: 0,
          isSaved: false,
        };
        this.posts.unshift(repost);
      }
    },

    openLightbox(images, startIndex = 0) {
      const list = Array.isArray(images) ? images : [images].filter(Boolean);
      if (list.length === 0) return;
      this.lightbox = {
        isOpen: true,
        images: list,
        activeIndex: Math.max(0, Math.min(startIndex, list.length - 1)),
      };
      this.lightboxImage = list[this.lightbox.activeIndex];
    },

    closeLightbox() {
      this.lightbox.isOpen = false;
      this.lightboxImage = null;
    },

    nextLightboxImage() {
      if (this.lightbox.images.length <= 1) return;
      this.lightbox.activeIndex = (this.lightbox.activeIndex + 1) % this.lightbox.images.length;
      this.lightboxImage = this.lightbox.images[this.lightbox.activeIndex];
    },

    prevLightboxImage() {
      if (this.lightbox.images.length <= 1) return;
      this.lightbox.activeIndex =
        (this.lightbox.activeIndex - 1 + this.lightbox.images.length) % this.lightbox.images.length;
      this.lightboxImage = this.lightbox.images[this.lightbox.activeIndex];
    },

    setLightboxIndex(index) {
      if (index >= 0 && index < this.lightbox.images.length) {
        this.lightbox.activeIndex = index;
        this.lightboxImage = this.lightbox.images[index];
      }
    },

    setLightbox(imgUrl) {
      if (!imgUrl) {
        this.closeLightbox();
      } else {
        this.openLightbox([imgUrl], 0);
      }
    },

    setFilter(filterName) {
      this.filter = filterName;
    },

    setSearch(query) {
      this.searchQuery = query;
    },
  },
});
