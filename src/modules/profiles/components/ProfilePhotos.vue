<template>
  <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-slate-900 text-sm">Galería de fotos vinculadas</h3>
      <span class="text-xs text-slate-500">{{ photos.length }} fotos</span>
    </div>

    <p v-if="photos.length === 0" class="text-xs text-slate-400 text-center py-8">
      Aún no se han compartido fotos en este perfil.
    </p>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div
        v-for="(url, i) in photos"
        :key="i"
        @click="feedStore.openLightbox(photos, i)"
        class="relative group h-36 rounded-xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200 hover:shadow-md transition-shadow"
      >
        <SafeImage
          :src="url"
          :alt="`Foto ${i + 1}`"
          imgClass="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          containerClass="w-full h-full"
        />
        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
          <span class="text-xs font-semibold">Ver</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import SafeImage from '@/shared/components/SafeImage.vue';

defineProps({
  photos: {
    type: Array,
    default: () => [],
  },
});

const feedStore = useFeedStore();
</script>
