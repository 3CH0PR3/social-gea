import { ref, onMounted, onBeforeUnmount } from 'vue';

const QUERY = '(max-width: 639px)'; // < 640px = Android / mobile web (breakpoint sm de Tailwind)

export function useIsMobile() {
  const isMobile = ref(false);
  let mql;
  const update = (e) => {
    isMobile.value = e.matches;
  };

  onMounted(() => {
    mql = window.matchMedia(QUERY);
    isMobile.value = mql.matches;
    mql.addEventListener('change', update);
  });

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', update);
  });

  return { isMobile };
}
