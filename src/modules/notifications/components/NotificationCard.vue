<template>
  <div
    @click="$emit('click', notification)"
    :class="[
      'p-4 flex items-start gap-3.5 hover:bg-slate-50 transition-colors cursor-pointer',
      !notification.isRead ? 'bg-emerald-50/30' : ''
    ]"
  >
    <div class="relative shrink-0">
      <SafeImage
        :src="notification.actorAvatar"
        :alt="notification.actorName"
        imgClass="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200"
        containerClass="w-11 h-11 rounded-full"
      />
      <span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center border border-slate-100">
        <Heart v-if="notification.type === 'like'" class="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <MessageCircle v-else-if="notification.type === 'comment'" class="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
        <UserPlus v-else-if="notification.type === 'friend_request'" class="w-3.5 h-3.5 text-emerald-500" />
        <Radar v-else-if="notification.type === 'radar_match'" class="w-3.5 h-3.5 text-emerald-500 animate-spin" style="animation-duration: 4s;" />
        <Sparkles v-else class="w-3.5 h-3.5 text-amber-500" />
      </span>
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-xs text-slate-800 leading-snug">
        <strong class="font-bold text-slate-900">{{ notification.actorName }}</strong>
        {{ notification.targetPreview }}
      </p>
      <span class="text-[11px] text-slate-400 font-medium block mt-1">
        {{ notification.timestamp }}
      </span>
    </div>

    <span v-if="!notification.isRead" class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
  </div>
</template>

<script setup>
import { Heart, MessageCircle, UserPlus, Radar, Sparkles } from 'lucide-vue-next';
import SafeImage from '@/shared/components/SafeImage.vue';

defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

defineEmits(['click']);
</script>
