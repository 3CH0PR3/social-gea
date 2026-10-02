<template>
  <div class="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
    <ProfileHeader
      :user="activeProfile"
      :activeTab="activeTab"
      :postsCount="userPosts.length"
      :photosCount="userPhotos.length"
      @select-tab="activeTab = $event"
      @open-chat="openChat"
    />

    <!-- Posts Tab -->
    <div v-if="activeTab === 'posts'" class="space-y-4">
      <div v-if="userPosts.length === 0" class="bg-white rounded-3xl p-10 text-center text-slate-400 border border-slate-200">
        No hay publicaciones en este perfil aún.
      </div>
      <PostCard
        v-for="post in userPosts"
        :key="post.id"
        :post="post"
      />
    </div>

    <!-- Photos Tab -->
    <ProfilePhotos
      v-else-if="activeTab === 'photos'"
      :photos="userPhotos"
    />

    <!-- Info Tab -->
    <ProfileInfo
      v-else-if="activeTab === 'about'"
      :user="activeProfile"
    />
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfile } from '../composables/useProfile';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import ProfileHeader from '../components/ProfileHeader.vue';
import ProfilePhotos from '../components/ProfilePhotos.vue';
import ProfileInfo from '../components/ProfileInfo.vue';
import PostCard from '@/modules/feeds/components/PostCard.vue';

const route = useRoute();
const router = useRouter();
const { activeProfile, activeTab, loadProfile } = useProfile();
const feedStore = useFeedStore();
const messengerStore = useMessengerStore();

onMounted(() => {
  feedStore.loadPosts();
  loadProfile(route.params.id);
});

watch(() => route.params.id, (newId) => {
  loadProfile(newId);
});

const userPosts = computed(() => {
  return feedStore.posts.filter((p) => p.authorId === activeProfile.value.id);
});

const userPhotos = computed(() => {
  return userPosts.value.flatMap((p) => p.images || []);
});

function openChat(user) {
  messengerStore.openWithUser(user);
}
</script>
