import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { feedService } from '../services/feedService';
import { CURRENT_USER } from '@/shared/data/initialData';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';
import { useLightboxStore } from './useLightbox.store';
import { usePostReactionsStore } from './usePostReactions.store';
import { usePostCommentsStore } from './usePostComments.store';

export const useFeedStore = defineStore('social.feed', () => {
  const eventBus = useEventBus();
  const lightboxStore = useLightboxStore();
  const reactionsStore = usePostReactionsStore();
  const commentsStore = usePostCommentsStore();

  // State
  const posts = ref([]);
  const isLoading = ref(false);
  const errorMsg = ref(null);
  const filter = ref('all'); // 'all' | 'friends' | 'popular' | 'saved'
  const searchQuery = ref('');
  const currentUser = ref(CURRENT_USER);

  // Computeds (en reemplazo de getters de versión 2)
  const filteredPosts = computed(() => {
    return posts.value.filter((p) => {
      const q = searchQuery.value.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        (p.content && p.content.toLowerCase().includes(q)) ||
        (p.authorName && p.authorName.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filter.value === 'friends') {
        return p.authorId !== currentUser.value.id;
      }
      if (filter.value === 'popular') {
        const totalReactions = p.reactions
          ? Object.values(p.reactions).reduce((a, b) => a + b, 0)
          : 0;
        return totalReactions > 40;
      }
      if (filter.value === 'saved') {
        return p.isSaved;
      }
      return true;
    });
  });

  const savedPosts = computed(() => posts.value.filter((p) => p.isSaved));

  // Lightbox delegator computeds
  const currentLightboxImage = computed(() => lightboxStore.currentImage);
  const currentLightboxPost = computed(() => {
    if (!lightboxStore.isOpen) return null;
    if (lightboxStore.postId) {
      return posts.value.find((p) => p.id === lightboxStore.postId) || null;
    }
    const activeImg = lightboxStore.images[lightboxStore.activeIndex];
    if (activeImg) {
      return posts.value.find((p) => p.images && p.images.includes(activeImg)) || null;
    }
    return null;
  });

  // Async helper
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

  // Methods
  const loadPosts = async () => {
    return executeAsync(async () => {
      const data = await feedService.fetchPosts();
      posts.value = data;
      return data;
    });
  };

  const createPost = async (postData) => {
    return executeAsync(async () => {
      const newPost = {
        id: 'post_' + Date.now(),
        authorId: currentUser.value.id,
        authorName: currentUser.value.name,
        authorAvatar: currentUser.value.avatar,
        content: postData.content,
        images: postData.images || [],
        timestamp: 'Justo ahora',
        reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        userReaction: null,
        commentsCount: 0,
        sharesCount: 0,
        isSaved: false,
        comments: [],
      };

      posts.value.unshift(newPost);
      eventBus.emit(EVENTS.POST_CREATED, newPost);
      return newPost;
    });
  };

  const deletePost = (postId) => {
    posts.value = posts.value.filter((p) => p.id !== postId);
    eventBus.emit(EVENTS.POST_DELETED, { postId });
  };

  const toggleSave = (postId) => {
    const post = posts.value.find((p) => p.id === postId);
    if (post) {
      post.isSaved = !post.isSaved;
      eventBus.emit(EVENTS.POST_SAVED, { postId, isSaved: post.isSaved });
    }
  };

  const toggleLike = (postId, reactionType = 'like') => {
    const post = posts.value.find((p) => p.id === postId);
    if (post) {
      reactionsStore.handleToggleReaction(post, reactionType);
    }
  };

  const setFilter = (newFilter) => {
    filter.value = newFilter;
  };

  const setSearch = (query) => {
    searchQuery.value = query;
  };

  // Delegados de Lightbox
  const openLightbox = (imageOrImages, index = 0, targetPostId = null) => {
    lightboxStore.open(imageOrImages, index, targetPostId);
  };

  const closeLightbox = () => {
    lightboxStore.close();
  };

  const nextLightboxImage = () => {
    lightboxStore.next();
  };

  const prevLightboxImage = () => {
    lightboxStore.prev();
  };

  return {
    // State
    posts,
    isLoading,
    errorMsg,
    filter,
    searchQuery,
    currentUser,
    lightbox: lightboxStore,

    // Computeds
    filteredPosts,
    savedPosts,
    currentLightboxImage,
    currentLightboxPost,

    // Methods
    executeAsync,
    loadPosts,
    createPost,
    deletePost,
    toggleSave,
    toggleLike,
    setFilter,
    setSearch,

    // Lightbox methods
    openLightbox,
    closeLightbox,
    nextLightboxImage,
    prevLightboxImage,
  };
});
