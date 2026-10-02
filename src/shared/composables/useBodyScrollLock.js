import { watch, onBeforeUnmount, isRef } from 'vue';

let lockCount = 0;

export function useBodyScrollLock(isOpen) {
  const getOpen = () => (isRef(isOpen) ? isOpen.value : typeof isOpen === 'function' ? isOpen() : isOpen);

  watch(
    () => getOpen(),
    (open) => {
      if (open) {
        lockCount++;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
      } else {
        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.body.style.touchAction = '';
        }
      }
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    if (getOpen()) {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      }
    }
  });
}
