<template>
  <div :class="['flex flex-col max-w-[80%]', isMe ? 'self-end items-end' : 'self-start items-start']">
    <div
      :class="[
        'p-2.5 rounded-2xl text-xs leading-relaxed',
        isMe
          ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
      ]"
    >
      <p v-if="message.text" class="break-words">{{ message.text }}</p>
      <div v-if="message.mediaUrl" class="mt-1 rounded-lg overflow-hidden max-w-[200px]">
        <SafeImage
          :src="message.mediaUrl"
          alt="Foto en chat"
          imgClass="w-full h-auto object-cover max-h-36"
        />
      </div>
    </div>
    <span class="text-[9px] text-slate-400 mt-0.5 px-1">{{ message.timestamp }}</span>
  </div>
</template>

<script setup>
import SafeImage from '@/shared/components/SafeImage.vue';

defineProps({
  message: {
    type: Object,
    required: true,
  },
  isMe: {
    type: Boolean,
    default: false,
  },
});
</script>
