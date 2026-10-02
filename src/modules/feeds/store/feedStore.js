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
      postId: null,
    },
    lightboxImage: null, // backwards compatibility
  }),

  getters: {
    currentLightboxImage: (state) => {
      if (!state.lightbox.isOpen || state.lightbox.images.length === 0) return null;
      return state.lightbox.images[state.lightbox.activeIndex] || null;
    },
    currentLightboxPost: (state) => {
      if (!state.lightbox.isOpen) return null;
      if (state.lightbox.postId) {
        return state.posts.find((p) => p.id === state.lightbox.postId) || null;
      }
      const activeImg = state.lightbox.images[state.lightbox.activeIndex];
      if (activeImg) {
        return state.posts.find((p) => p.images && p.images.includes(activeImg)) || null;
      }
      return null;
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

    addComment(postId, content, imageUrl = null, parentCommentId = null, replyToUser = null) {
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
        userReaction: null,
        reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        reactionsList: [],
        replies: [],
        replyToUserId: replyToUser?.id || null,
        replyToUserName: replyToUser?.name || null,
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

    reactToComment(postId, commentId, reactionType = 'like') {
      const post = this.posts.find((p) => p.id === postId);
      if (!post) return;

      let target = null;
      for (const c of post.comments) {
        if (c.id === commentId) {
          target = c;
          break;
        }
        if (c.replies) {
          for (const r of c.replies) {
            if (r.id === commentId) {
              target = r;
              break;
            }
          }
          if (target) break;
        }
      }

      if (!target) return;

      if (!target.reactions) {
        target.reactions = { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
      }
      if (!target.reactionsList) {
        target.reactionsList = [];
      }

      const previous = target.userReaction;

      const updatedReactions = { ...target.reactions };
      const updatedList = [...target.reactionsList];

      if (previous) {
        updatedReactions[previous] = Math.max(0, (updatedReactions[previous] || 1) - 1);
        const idx = updatedList.findIndex((r) => r.userId === this.currentUser.id);
        if (idx !== -1) updatedList.splice(idx, 1);
      }

      if (previous === reactionType) {
        target.userReaction = null;
        target.isLiked = false;
      } else {
        target.userReaction = reactionType;
        target.isLiked = true;
        updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;
        updatedList.unshift({
          userId: this.currentUser.id,
          userName: this.currentUser.name,
          userAvatar: this.currentUser.avatar,
          type: reactionType,
        });
      }

      target.reactions = updatedReactions;
      target.reactionsList = updatedList;
      target.likesCount = Object.values(updatedReactions).reduce((acc, v) => acc + v, 0);
    },

    toggleLikeComment(postId, commentId) {
      this.reactToComment(postId, commentId, 'like');
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

    openLightbox(images, startIndex = 0, post = null) {
      const list = Array.isArray(images) ? images : [images].filter(Boolean);
      if (list.length === 0) return;

      let targetPostId = post?.id || null;
      if (!targetPostId) {
        const found = this.posts.find((p) =>
          p.images && p.images.some((img) => list.includes(img))
        );
        targetPostId = found?.id || null;
      }

      this.lightbox = {
        isOpen: true,
        images: list,
        activeIndex: Math.max(0, Math.min(startIndex, list.length - 1)),
        postId: targetPostId,
      };
      this.lightboxImage = list[this.lightbox.activeIndex];
    },

    closeLightbox() {
      this.lightbox.isOpen = false;
      this.lightbox.postId = null;
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
