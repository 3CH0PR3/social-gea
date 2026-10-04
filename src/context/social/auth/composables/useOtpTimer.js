import { ref, computed, onBeforeUnmount } from 'vue';

export function useOtpTimer(initialSeconds = 120) {
  const secondsLeft = ref(initialSeconds);
  const isRunning = ref(false);
  let timerId = null;

  const canResend = computed(() => secondsLeft.value === 0);

  const formattedTime = computed(() => {
    const mins = Math.floor(secondsLeft.value / 60);
    const secs = secondsLeft.value % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  });

  const startTimer = (seconds = initialSeconds) => {
    stopTimer();
    secondsLeft.value = seconds;
    isRunning.value = true;
    timerId = setInterval(() => {
      if (secondsLeft.value > 0) {
        secondsLeft.value--;
      } else {
        stopTimer();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    isRunning.value = false;
  };

  onBeforeUnmount(() => {
    stopTimer();
  });

  return {
    secondsLeft,
    isRunning,
    canResend,
    formattedTime,
    startTimer,
    stopTimer,
  };
}
