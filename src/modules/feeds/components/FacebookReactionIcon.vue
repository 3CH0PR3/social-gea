<template>
  <span :class="['inline-flex items-center justify-center shrink-0 select-none', sizeClasses]">
    <!-- 1. LIKE (Facebook Blue Circle with Crisp White Thumb) -->
    <svg
      v-if="type === 'like'"
      viewBox="0 0 36 36"
      class="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="#1877F2" />
      <path
        d="M10 24.5C10 25.33 10.67 26 11.5 26H13.5C14.33 26 15 25.33 15 24.5V17.5C15 16.67 14.33 16 13.5 16H11.5C10.67 16 10 16.67 10 17.5V24.5ZM16.5 16.5V25.2C16.5 25.64 16.86 26 17.3 26H23.13C24.09 26 24.9 25.33 25.07 24.39L26.02 19.35C26.25 18.16 25.33 17.1 24.12 17.1H20.7V12.6C20.7 11.16 19.54 10 18.1 10C17.78 10 17.48 10.14 17.27 10.38L16.5 11.24V16.5Z"
        fill="#FFFFFF"
      />
    </svg>

    <!-- 2. LOVE (Facebook Red Circle with Crisp White Heart) -->
    <svg
      v-else-if="type === 'love'"
      viewBox="0 0 36 36"
      class="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="#F02849" />
      <path
        d="M18 26.5L16.29 24.94C10.24 19.46 6.25 15.84 6.25 11.4C6.25 7.82 9.07 5 12.65 5C14.67 5 16.61 5.94 18 7.42C19.39 5.94 21.33 5 23.35 5C26.93 5 29.75 7.82 29.75 11.4C29.75 15.84 25.76 19.46 19.71 24.95L18 26.5Z"
        fill="#FFFFFF"
      />
    </svg>

    <!-- 3. CARE (Facebook Warm Amber Hugging Face with Red Heart) -->
    <svg
      v-else-if="type === 'care'"
      viewBox="0 0 36 36"
      class="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="#F7B125" />
      <!-- Blushing Cheeks -->
      <circle cx="9" cy="19" r="3.5" fill="#FFA39E" fill-opacity="0.6" />
      <circle cx="27" cy="19" r="3.5" fill="#FFA39E" fill-opacity="0.6" />
      <!-- Curved closed happy eyes -->
      <path d="M10.5 13.5C11.5 11.5 14.5 11.5 15.5 13.5" stroke="#7A3900" stroke-width="2.2" stroke-linecap="round" />
      <path d="M20.5 13.5C21.5 11.5 24.5 11.5 25.5 13.5" stroke="#7A3900" stroke-width="2.2" stroke-linecap="round" />
      <!-- Smile -->
      <path d="M15 18C16 19.5 20 19.5 21 18" stroke="#7A3900" stroke-width="2" stroke-linecap="round" />
      <!-- Hugged Red Heart -->
      <path
        d="M18 27.5C18 27.5 12.5 23.5 12.5 19.8C12.5 18 13.8 16.5 15.5 16.5C16.6 16.5 17.5 17.2 18 17.2C18.5 17.2 19.4 16.5 20.5 16.5C22.2 16.5 23.5 18 23.5 19.8C23.5 23.5 18 27.5 18 27.5Z"
        fill="#F02849"
      />
      <!-- Arms -->
      <path d="M8.5 21.5C11 24.5 14 25.5 16.5 24.5" stroke="#FDC732" stroke-width="3" stroke-linecap="round" />
      <path d="M27.5 21.5C25 24.5 22 25.5 19.5 24.5" stroke="#FDC732" stroke-width="3" stroke-linecap="round" />
    </svg>

    <!-- 4. HAHA (Facebook Yellow Face with Open Laughing Mouth) -->
    <svg
      v-else-if="type === 'haha'"
      viewBox="0 0 36 36"
      class="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="#F7B125" />
      <!-- Closed Joyful Eyes (V-shaped) -->
      <path d="M9.5 13.5L14 16L9.5 18.5" stroke="#7A3900" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M26.5 13.5L22 16L26.5 18.5" stroke="#7A3900" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Wide Open Laughing Mouth -->
      <path d="M9.5 19C9.5 24.8 13.2 29 18 29C22.8 29 26.5 24.8 26.5 19H9.5Z" fill="#5E2000" />
      <!-- White Upper Teeth -->
      <path d="M11.5 19C11.5 21.5 14.5 22.5 18 22.5C21.5 22.5 24.5 21.5 24.5 19H11.5Z" fill="#FFFFFF" />
      <!-- Pink Tongue -->
      <path d="M14 25.5C15.2 27 16.6 28 18 28C19.4 28 20.8 27 22 25.5H14Z" fill="#F02849" />
    </svg>

    <!-- 5. WOW (Facebook Yellow Face with Big Eyes and O Mouth) -->
    <svg
      v-else-if="type === 'wow'"
      viewBox="0 0 36 36"
      class="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="#F7B125" />
      <!-- Raised Curved Eyebrows -->
      <path d="M9.5 10C11.5 8 15 8 16.5 10" stroke="#7A3900" stroke-width="2.2" stroke-linecap="round" />
      <path d="M19.5 10C21 8 24.5 8 26.5 10" stroke="#7A3900" stroke-width="2.2" stroke-linecap="round" />
      <!-- Big Round Surprised Eyes -->
      <ellipse cx="13" cy="14.5" rx="2.5" ry="4" fill="#3D1800" />
      <ellipse cx="23" cy="14.5" rx="2.5" ry="4" fill="#3D1800" />
      <!-- Eye Reflections -->
      <circle cx="12" cy="13" r="1" fill="#FFFFFF" />
      <circle cx="22" cy="13" r="1" fill="#FFFFFF" />
      <!-- O Mouth -->
      <ellipse cx="18" cy="24" rx="4.5" ry="6" fill="#3D1800" />
      <ellipse cx="18" cy="25" rx="3.5" ry="4.5" fill="#5E2000" />
    </svg>

    <!-- 6. SAD (Facebook Yellow Face with Tear) -->
    <svg
      v-else-if="type === 'sad'"
      viewBox="0 0 36 36"
      class="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="#F7B125" />
      <!-- Slanted Sad Eyebrows -->
      <path d="M10 11C12 12.5 15.5 11 16.5 9.5" stroke="#7A3900" stroke-width="2.2" stroke-linecap="round" />
      <path d="M26 11C24 12.5 20.5 11 19.5 9.5" stroke="#7A3900" stroke-width="2.2" stroke-linecap="round" />
      <!-- Closed Downturned Eyes -->
      <path d="M10.5 16C12 14.5 15 14.5 16.5 16" stroke="#5E2000" stroke-width="2.4" stroke-linecap="round" />
      <path d="M19.5 16C21 14.5 24 14.5 25.5 16" stroke="#5E2000" stroke-width="2.4" stroke-linecap="round" />
      <!-- Downturned Frown -->
      <path d="M13.5 25.5C15.5 23 20.5 23 22.5 25.5" stroke="#5E2000" stroke-width="2.4" stroke-linecap="round" />
      <!-- Shiny Blue Tear Drop -->
      <path
        d="M26.5 19.5C26.5 19.5 24 23 24 24.8C24 26.2 25.1 27.3 26.5 27.3C27.9 27.3 29 26.2 29 24.8C29 23 26.5 19.5 26.5 19.5Z"
        fill="#1877F2"
      />
      <circle cx="25.8" cy="24.5" r="0.8" fill="#FFFFFF" />
    </svg>

    <!-- 7. ANGRY (Facebook Red-Orange Face with Furious Scowl) -->
    <svg
      v-else-if="type === 'angry'"
      viewBox="0 0 36 36"
      class="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="#E44134" />
      <!-- Furrowed Angry Eyebrows -->
      <path d="M8.5 10L16.5 13.5" stroke="#3D0000" stroke-width="2.8" stroke-linecap="round" />
      <path d="M27.5 10L19.5 13.5" stroke="#3D0000" stroke-width="2.8" stroke-linecap="round" />
      <!-- Glaring Eyes -->
      <ellipse cx="13" cy="16.5" rx="2.2" ry="2.8" fill="#3D0000" />
      <ellipse cx="23" cy="16.5" rx="2.2" ry="2.8" fill="#3D0000" />
      <circle cx="12.5" cy="15.8" r="0.8" fill="#FFFFFF" />
      <circle cx="22.5" cy="15.8" r="0.8" fill="#FFFFFF" />
      <!-- Furious Downturned Mouth -->
      <path d="M12.5 25.5C15 23 21 23 23.5 25.5" stroke="#3D0000" stroke-width="2.6" stroke-linecap="round" />
    </svg>

    <!-- DEFAULT THUMB UP OUTLINE (Idle unreacted state) -->
    <svg
      v-else
      viewBox="0 0 24 24"
      class="w-full h-full text-slate-600"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  },
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-4 h-4';
    case 'sm':
      return 'w-5 h-5';
    case 'md':
      return 'w-7 h-7';
    case 'lg':
      return 'w-8 h-8';
    case 'xl':
      return 'w-9 h-9';
    default:
      return 'w-5 h-5';
  }
});
</script>
