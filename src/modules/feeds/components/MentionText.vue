<template>
  <span class="inline leading-relaxed">
    <template v-for="(segment, index) in parsedSegments" :key="index">
      <RouterLink
        v-if="segment.isMention"
        :to="segment.userId ? `/profiles/${segment.userId}` : '/feeds'"
        @click="handleClick"
        class="text-blue-600 hover:text-blue-800 font-bold hover:underline transition-colors inline-block mr-0.5 cursor-pointer"
      >
        {{ segment.text }}
      </RouterLink>
      <span v-else>{{ segment.text }}</span>
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { COMMUNITY_USERS, CURRENT_USER } from '@/shared/data/initialData';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  onMentionClick: {
    type: Function,
    default: null,
  },
});

const allUsers = [CURRENT_USER, ...COMMUNITY_USERS];

const parsedSegments = computed(() => {
  const text = props.content || '';
  if (!text) return [];

  // Match @Name or @username (e.g. @Elena Rostova, @Alejandro Morales, @alexmorales, etc.)
  // Build regex dynamically from known users to support multi-word names reliably
  const namePatterns = allUsers
    .flatMap((u) => [u.name, u.username])
    .filter(Boolean)
    .sort((a, b) => b.length - a.length); // match longest first

  if (namePatterns.length === 0) {
    return [{ text, isMention: false }];
  }

  const escaped = namePatterns.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(@(?:${escaped})|@[a-zA-Z0-9_]+)`, 'g');

  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        isMention: false,
      });
    }

    const mentionStr = match[0];
    const rawName = mentionStr.replace(/^@/, '').trim().toLowerCase();
    const matchedUser = allUsers.find(
      (u) => u.name.toLowerCase() === rawName || u.username.toLowerCase() === rawName
    );

    segments.push({
      text: mentionStr,
      isMention: true,
      userId: matchedUser ? matchedUser.id : null,
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isMention: false,
    });
  }

  return segments;
});

function handleClick() {
  if (props.onMentionClick) {
    props.onMentionClick();
  }
}
</script>
