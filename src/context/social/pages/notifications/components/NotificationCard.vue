<template>
  <article
    @click="$emit('click', notification)"
    class="sg-notif-card"
    :class="{ 'sg-notif-card--unread': !notification.isRead }"
  >
    <div class="sg-notif-card__avatar-wrap">
      <SafeImage
        :src="notification.actorAvatar"
        :alt="notification.actorName"
        imgClass="sg-notif-card__avatar"
        containerClass="w-full h-full rounded-full"
      />
      <span class="sg-notif-card__badge">
        <Heart v-if="notification.type === 'like'" class="w-3 h-3 text-rose-600 fill-rose-600" />
        <MessageCircle v-else-if="notification.type === 'comment'" class="w-3 h-3 text-sky-600 fill-sky-600" />
        <UserPlus v-else-if="notification.type === 'friend_request'" class="w-3 h-3 text-emerald-700" />
        <Sparkles v-else-if="notification.type === 'points'" class="w-3 h-3 text-amber-600 fill-amber-500" />
        <Gift v-else-if="notification.type === 'redeem'" class="w-3 h-3 text-amber-700" />
        <Bell v-else class="w-3 h-3 text-slate-600" />
      </span>
    </div>

    <div class="sg-notif-card__content">
      <p class="sg-notif-card__text">
        <span class="sg-notif-card__actor">{{ notification.actorName }}</span>
        <span class="sg-notif-card__preview">{{ notification.targetPreview }}</span>
      </p>
      <time class="sg-notif-card__time">{{ notification.timestamp }}</time>
    </div>

    <span v-if="!notification.isRead" class="sg-notif-card__dot" aria-label="No leída" />
  </article>
</template>

<script setup>
import { Heart, MessageCircle, UserPlus, Sparkles, Gift, Bell } from 'lucide-vue-next';
import SafeImage from '@/shared/components/SafeImage.vue';

defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

defineEmits(['click']);
</script>

<style src="./NotificationCard.css"></style>
