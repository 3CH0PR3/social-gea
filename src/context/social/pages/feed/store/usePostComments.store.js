import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

export const usePostCommentsStore = defineStore('social.comments', () => {
  const eventBus = useEventBus();

  const isCommentsModalOpen = ref(false);
  const activePostForComments = ref(null);

  const openCommentsModal = (post) => {
    activePostForComments.value = post;
    isCommentsModalOpen.value = true;
  };

  const closeCommentsModal = () => {
    isCommentsModalOpen.value = false;
    activePostForComments.value = null;
  };

  const addCommentToPost = (post, commentText, currentUser) => {
    if (!post || !commentText.trim()) return null;

    if (!post.comments) {
      post.comments = [];
    }

    const newComment = {
      id: 'cmt_' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: commentText.trim(),
      timestamp: 'Justo ahora',
      likes: 0,
      userLiked: false,
    };

    post.comments.push(newComment);
    post.commentsCount = (post.commentsCount || 0) + 1;

    eventBus.emit(EVENTS.COMMENT_CREATED, {
      postId: post.id,
      comment: newComment,
      commentsCount: post.commentsCount,
    });

    return newComment;
  };

  const toggleCommentLike = (comment) => {
    if (!comment) return;
    comment.userLiked = !comment.userLiked;
    comment.likes = (comment.likes || 0) + (comment.userLiked ? 1 : -1);
  };

  return {
    isCommentsModalOpen,
    activePostForComments,
    openCommentsModal,
    closeCommentsModal,
    addCommentToPost,
    toggleCommentLike,
  };
});
