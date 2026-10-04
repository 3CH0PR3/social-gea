import { storeToRefs } from 'pinia';
import { useFeedStore } from '../store/feedStore';

export function useFeed() {
  const store = useFeedStore();
  const { posts, filteredPosts, savedPosts, filter, isLoading, searchQuery, lightboxImage, lightbox } = storeToRefs(store);

  return {
    posts,
    filteredPosts,
    savedPosts,
    filter,
    isLoading,
    searchQuery,
    lightboxImage,
    lightbox,

    loadPosts: store.loadPosts,
    addPost: store.addPost,
    removePost: store.removePost,
    toggleReaction: store.toggleReaction,
    addComment: store.addComment,
    toggleLikeComment: store.toggleLikeComment,
    deleteComment: store.deleteComment,
    toggleSavePost: store.toggleSavePost,
    sharePost: store.sharePost,
    setLightbox: store.setLightbox,
    openLightbox: store.openLightbox,
    closeLightbox: store.closeLightbox,
    nextLightboxImage: store.nextLightboxImage,
    prevLightboxImage: store.prevLightboxImage,
    setLightboxIndex: store.setLightboxIndex,
    setFilter: store.setFilter,
    setSearch: store.setSearch,
  };
}
