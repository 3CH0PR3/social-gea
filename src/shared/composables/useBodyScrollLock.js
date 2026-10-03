import { watch, onUnmounted } from 'vue';

let scrollY = 0;
let activeLocks = 0;

/**
 * Robust universal body scroll lock composable for mobile WebViews, iOS, Android & Desktop.
 * Uses position: fixed on body with exact scroll offset to guarantee background cannot scroll on touch drag.
 * Accurately supports nested modals (e.g. comments modal -> reactions modal).
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
      if (typeof document === 'undefined') return;

      if (isOpen) {
        activeLocks++;
        if (activeLocks === 1) {
          scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          document.documentElement.classList.add('modal-open');
          document.body.classList.add('modal-open');
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollY}px`;
          document.body.style.left = '0';
          document.body.style.right = '0';
          document.body.style.width = '100%';
          document.body.style.overflow = 'hidden';
        }
      } else {
        if (activeLocks > 0) {
          activeLocks--;
          if (activeLocks === 0) {
            document.documentElement.classList.remove('modal-open');
            document.body.classList.remove('modal-open');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
          }
        }
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (typeof document === 'undefined') return;
    if (getIsOpen()) {
      if (activeLocks > 0) activeLocks--;
      if (activeLocks === 0) {
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      }
    }
  });
}
