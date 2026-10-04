<template>
  <div v-if="isOpen" class="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150" @click.self="$emit('close')">
    <div
      class="w-full bg-white text-slate-900 rounded-t-3xl shadow-2xl flex flex-col max-h-[75vh] sm:max-h-[70vh] overflow-hidden animate-in slide-in-from-bottom duration-200 border-t border-slate-100"
      @click.stop
    >
      <!-- Drag handle indicator -->
      <div class="py-2.5 flex justify-center shrink-0 cursor-pointer" @click="$emit('close')">
        <div class="w-12 h-1.5 bg-slate-300 rounded-full hover:bg-slate-400 transition-colors" />
      </div>

      <!-- Header -->
      <div class="px-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye class="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900 leading-tight">
              Visto por {{ viewersList.length }} personas
            </h3>
            <p class="text-[11px] text-slate-400">
              Amigos que han visto tu historia
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X class="w-4.5 h-4.5" />
        </button>
      </div>

      <!-- Quick Search / Filter Input -->
      <div v-if="viewersList.length > 3" class="px-4 py-2 border-b border-slate-100 bg-slate-50/60">
        <div class="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-slate-200 text-xs">
          <Search class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar espectadores..."
            class="w-full bg-transparent outline-none text-slate-800"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-slate-400 p-0.5">
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- Viewers List -->
      <div class="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-0.5 overscroll-contain">
        <div v-if="filteredViewers.length === 0" class="text-center py-12 text-slate-400 text-xs">
          No se encontraron espectadores.
        </div>

        <div
          v-for="viewer in filteredViewers"
          :key="viewer.id"
          class="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
          @click="handleSelect(viewer)"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">
              <SafeImage
                :src="viewer.avatar"
                :alt="viewer.name"
                imgClass="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200"
                containerClass="w-11 h-11 rounded-full bg-slate-100"
              />
              <span
                v-if="viewer.reaction"
                class="absolute -bottom-1 -right-1 text-sm bg-white rounded-full px-0.5 shadow-2xs"
              >
                {{ viewer.reaction }}
              </span>
            </div>

            <div class="min-w-0">
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                {{ viewer.name }}
              </h4>
              <p class="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                <span>{{ viewer.timeAgo || 'Reciente' }}</span>
                <span v-if="viewer.reaction" class="text-emerald-600 font-medium">· Reaccionó</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 text-slate-700 text-xs font-semibold transition-colors"
            >
              Ver perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Eye, X, Search } from 'lucide-vue-next';
import defaultViewers from '@/shared/data/storyViewers.json';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  viewers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'select-user']);

const searchQuery = ref('');

const viewersList = computed(() => {
  return props.viewers && props.viewers.length > 0 ? props.viewers : defaultViewers;
});

const filteredViewers = computed(() => {
  if (!searchQuery.value.trim()) return viewersList.value;
  const q = searchQuery.value.toLowerCase().trim();
  return viewersList.value.filter((v) => v.name.toLowerCase().includes(q));
});

function handleSelect(viewer) {
  emit('select-user', viewer);
}
</script>
