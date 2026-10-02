<template>
  <div
    v-if="isOpen"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-white sm:bg-black/60 sm:backdrop-blur-sm animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border border-slate-200 flex flex-col animate-in slide-in-from-bottom duration-200"
      @click.stop
    >
      <!-- Header (Mobile app bar with back button & header publish button; Desktop with centered title & X) -->
      <div class="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-slate-200 bg-white sticky top-0 z-20 select-none">
        <div class="flex items-center gap-2">
          <!-- Back button on mobile (App style) -->
          <button
            type="button"
            @click="$emit('close')"
            class="sm:hidden p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
          </button>
          <h3 class="font-bold text-slate-900 text-sm sm:text-base">Crear publicación</h3>
        </div>

        <div class="flex items-center gap-2">
          <!-- Mobile Publish button in header (app style like Facebook Android) -->
          <button
            type="button"
            @click="handleSubmit"
            :disabled="!content.trim() && imageUrls.length === 0"
            class="sm:hidden px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-40 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            Publicar
          </button>

          <!-- Desktop close X button -->
          <button
            type="button"
            @click="$emit('close')"
            class="hidden sm:flex p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Author info -->
        <div class="flex items-center gap-3">
          <SafeImage
            :src="currentUser.avatar"
            :alt="currentUser.name"
            imgClass="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
            containerClass="w-10 h-10 rounded-full"
          />
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-semibold text-slate-900">{{ currentUser.name }}</span>
              <span v-if="selectedFeeling" class="text-xs text-slate-500 flex items-center gap-1">
                está <span>{{ selectedFeeling.emoji }}</span> {{ selectedFeeling.text }}
              </span>
            </div>

            <div class="flex items-center gap-1 mt-0.5">
              <select
                v-model="privacy"
                class="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md outline-none cursor-pointer"
              >
                <option value="public">🌐 Público</option>
                <option value="friends">👥 Solo amigos</option>
                <option value="only_me">🔒 Solo yo</option>
              </select>
              <span v-if="location" class="text-[11px] text-slate-500 truncate max-w-[150px]">
                · en {{ location }}
              </span>
            </div>
          </div>
        </div>

        <!-- Text Area -->
        <textarea
          v-model="content"
          :placeholder="`¿Qué estás pensando, ${currentUser.name.split(' ')[0]}?`"
          class="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent resize-none outline-none min-h-[90px] border-none focus:ring-0"
          autofocus
        />

        <!-- Attached Images Grid Preview -->
        <div v-if="imageUrls.length > 0" class="space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Fotos vinculadas ({{ imageUrls.length }}/4)</span>
            <button
              type="button"
              @click="imageUrls = []"
              class="text-red-500 hover:underline"
            >
              Quitar todas
            </button>
          </div>

          <div
            :class="[
              'grid gap-2 rounded-xl overflow-hidden',
              imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            ]"
          >
            <div
              v-for="(url, idx) in imageUrls"
              :key="idx"
              class="relative group rounded-lg overflow-hidden bg-slate-100 h-40"
            >
              <SafeImage
                :src="url"
                :alt="`Foto ${idx + 1}`"
                imgClass="w-full h-full object-cover"
                fallbackText="Imagen no disponible"
              />
              <button
                type="button"
                @click="removeImage(idx)"
                class="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                title="Eliminar foto"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Image Linking Tool Accordion -->
        <div
          v-if="showImageTool"
          class="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3 animate-in fade-in duration-150"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <ImageIcon class="w-4 h-4 text-emerald-600" />
              Vincular imágenes a la publicación
            </span>
            <button
              type="button"
              @click="showImageTool = false"
              class="text-slate-400 hover:text-slate-600"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="flex items-center gap-1 p-1 bg-white rounded-lg border border-emerald-100 text-xs font-medium">
            <button
              type="button"
              @click="activeMediaTab = 'presets'"
              :class="[
                'flex-1 py-1 rounded-md transition-colors',
                activeMediaTab === 'presets' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
              ]"
            >
              Galería HD
            </button>
            <button
              type="button"
              @click="activeMediaTab = 'url'"
              :class="[
                'flex-1 py-1 rounded-md transition-colors',
                activeMediaTab === 'url' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
              ]"
            >
              Pegar URL
            </button>
            <button
              type="button"
              @click="activeMediaTab = 'upload'"
              :class="[
                'flex-1 py-1 rounded-md transition-colors',
                activeMediaTab === 'upload' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
              ]"
            >
              Subir archivo
            </button>
          </div>

          <!-- Presets -->
          <div v-if="activeMediaTab === 'presets'" class="grid grid-cols-3 gap-2 pt-1">
            <button
              v-for="item in PRESET_IMAGE_GALLERY"
              :key="item.url"
              type="button"
              @click="addImageUrl(item.url)"
              class="relative rounded-lg overflow-hidden h-16 group border border-slate-200 hover:border-emerald-500 transition-colors"
            >
              <img
                :src="item.url"
                :alt="item.label"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus class="w-5 h-5 text-white" />
              </div>
              <span class="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium truncate drop-shadow-md">
                {{ item.label }}
              </span>
            </button>
          </div>

          <!-- URL Input -->
          <div v-if="activeMediaTab === 'url'" class="flex items-center gap-2 pt-1">
            <div class="flex-1 flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-1.5 bg-white">
              <LinkIcon class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="url"
                v-model="currentUrlInput"
                placeholder="https://ejemplo.com/imagen.jpg o enlace web..."
                class="w-full text-xs outline-none bg-transparent"
                @keydown.enter.prevent="addImageUrl(currentUrlInput)"
              />
            </div>
            <button
              type="button"
              @click="addImageUrl(currentUrlInput)"
              :disabled="!currentUrlInput.trim()"
              class="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg transition-colors shrink-0"
            >
              Vincular
            </button>
          </div>

          <!-- File Upload -->
          <div v-if="activeMediaTab === 'upload'">
            <label class="flex items-center justify-center gap-2 p-4 border border-dashed border-emerald-300 bg-white rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors">
              <Upload class="w-4 h-4 text-emerald-600" />
              <span class="text-xs font-medium text-slate-700">Seleccionar imagen de tu equipo</span>
              <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
            </label>
          </div>
        </div>

        <!-- Feeling Picker -->
        <div v-if="showFeelingPicker" class="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-amber-900">¿Cómo te sientes?</span>
            <button type="button" @click="showFeelingPicker = false" class="text-slate-400 hover:text-slate-600">
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="f in FEELINGS"
              :key="f.text"
              type="button"
              @click="toggleFeeling(f)"
              :class="[
                'px-2.5 py-1 text-xs rounded-full border transition-colors flex items-center gap-1',
                selectedFeeling?.text === f.text
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white border-slate-200 hover:bg-amber-100 text-slate-700'
              ]"
            >
              <span>{{ f.emoji }}</span>
              <span class="capitalize">{{ f.text }}</span>
            </button>
          </div>
        </div>

        <!-- Location Input -->
        <div v-if="showLocationInput" class="p-3 rounded-xl border border-sky-200 bg-sky-50/50 flex items-center gap-2">
          <MapPin class="w-4 h-4 text-sky-600 shrink-0" />
          <input
            type="text"
            v-model="location"
            placeholder="Ingresa ubicación (ej: Madrid, Parque del Retiro)..."
            class="w-full text-xs bg-transparent outline-none text-slate-800"
          />
          <button type="button" @click="showLocationInput = false" class="text-slate-400 hover:text-slate-600">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Bottom Action Bar -->
        <div class="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/70">
          <span class="text-xs font-semibold text-slate-700">Agregar a tu post:</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="showImageTool = !showImageTool"
              :class="[
                'p-2 rounded-lg transition-colors',
                showImageTool ? 'bg-emerald-100 text-emerald-700' : 'text-emerald-600 hover:bg-emerald-50'
              ]"
              title="Vincular fotos o imágenes"
            >
              <ImageIcon class="w-5 h-5" />
            </button>
            <button
              type="button"
              @click="showFeelingPicker = !showFeelingPicker"
              :class="[
                'p-2 rounded-lg transition-colors',
                showFeelingPicker ? 'bg-amber-100 text-amber-700' : 'text-amber-500 hover:bg-amber-50'
              ]"
              title="Sentimiento o actividad"
            >
              <Smile class="w-5 h-5" />
            </button>
            <button
              type="button"
              @click="showLocationInput = !showLocationInput"
              :class="[
                'p-2 rounded-lg transition-colors',
                showLocationInput ? 'bg-sky-100 text-sky-700' : 'text-sky-600 hover:bg-sky-50'
              ]"
              title="Agregar ubicación"
            >
              <MapPin class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!content.trim() && imageUrls.length === 0"
          class="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors shadow-xs"
        >
          Publicar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  X,
  ArrowLeft,
  Image as ImageIcon,
  Smile,
  MapPin,
  Trash2,
  Plus,
  Link as LinkIcon,
  Upload
} from 'lucide-vue-next';
import { PRESET_IMAGE_GALLERY } from '@/shared/data/initialData';
import SafeImage from '@/shared/components/SafeImage.vue';
import { useFeedStore } from '../store/feedStore';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

useBodyScrollLock(() => props.isOpen);

const emit = defineEmits(['close']);
const feedStore = useFeedStore();
const currentUser = feedStore.currentUser;

const content = ref('');
const privacy = ref('public');
const selectedFeeling = ref(null);
const location = ref('');
const imageUrls = ref([]);
const currentUrlInput = ref('');
const showImageTool = ref(false);
const showFeelingPicker = ref(false);
const showLocationInput = ref(false);
const activeMediaTab = ref('presets');

const FEELINGS = [
  { emoji: '😄', text: 'feliz' },
  { emoji: '🚀', text: 'motivado' },
  { emoji: '🌿', text: 'en paz' },
  { emoji: '💻', text: 'programando' },
  { emoji: '☕', text: 'con café' },
  { emoji: '🎉', text: 'celebrando' },
  { emoji: '✈️', text: 'de viaje' },
];

function addImageUrl(url) {
  const trimmed = (url || '').trim();
  if (!trimmed) return;
  if (imageUrls.value.length >= 4) {
    alert('Máximo 4 imágenes por publicación');
    return;
  }
  if (!imageUrls.value.includes(trimmed)) {
    imageUrls.value.push(trimmed);
  }
  currentUrlInput.value = '';
}

function removeImage(idx) {
  imageUrls.value.splice(idx, 1);
}

function handleFileUpload(e) {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    addImageUrl(url);
  }
}

function toggleFeeling(f) {
  selectedFeeling.value = selectedFeeling.value?.text === f.text ? null : f;
  showFeelingPicker.value = false;
}

function handleSubmit() {
  if (!content.value.trim() && imageUrls.value.length === 0) return;

  feedStore.addPost({
    content: content.value.trim(),
    images: [...imageUrls.value],
    privacy: privacy.value,
    location: location.value.trim() || undefined,
    feeling: selectedFeeling.value || undefined,
  });

  content.value = '';
  imageUrls.value = [];
  selectedFeeling.value = null;
  location.value = '';
  showImageTool.value = false;
  emit('close');
}
</script>
