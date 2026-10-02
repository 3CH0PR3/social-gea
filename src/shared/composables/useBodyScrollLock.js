import { watch, onUnmounted } from 'vue';

/**
 * Universal body scroll lock composable.
 * Ensures document.body and document.documentElement cannot scroll while a modal/fullscreen view is active.
 * Restores original overflow when closed or unmounted.
 */
export function useBodyScrollLock(isOpenSource) {
  const getIsOpen = () => {
    if (typeof isOpenSource === 'function') {
      return Boolean(isOpenSource());
    }
    return Boolean(isOpenSource?.value);
  };

  watch(
    getIsOpen,
    (isOpen) => {
      if (typeof document !== 'undefined') {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  });
}
