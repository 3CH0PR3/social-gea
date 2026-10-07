import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useLightboxStore = defineStore('social.lightbox', () => {
  const isOpen = ref(false);
  const images = ref([]);
  const activeIndex = ref(0);
  const postId = ref(null);

  const currentImage = computed(() => {
    if (!isOpen.value || images.value.length === 0) return null;
    return images.value[activeIndex.value] || null;
  });

  const open = (imageList = [], index = 0, targetPostId = null) => {
    images.value = Array.isArray(imageList) ? imageList : [imageList];
    activeIndex.value = Math.max(0, Math.min(index, images.value.length - 1));
    postId.value = targetPostId;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    images.value = [];
    activeIndex.value = 0;
    postId.value = null;
  };

  const next = () => {
    if (images.value.length <= 1) return;
    activeIndex.value = (activeIndex.value + 1) % images.value.length;
  };

  const prev = () => {
    if (images.value.length <= 1) return;
    activeIndex.value = (activeIndex.value - 1 + images.value.length) % images.value.length;
  };

  const setIndex = (index) => {
    if (images.value.length === 0) return;
    activeIndex.value = Math.max(0, Math.min(index, images.value.length - 1));
  };

  return {
    isOpen,
    images,
    activeIndex,
    postId,
    currentImage,
    open,
    close,
    next,
    prev,
    setIndex,
  };
});
