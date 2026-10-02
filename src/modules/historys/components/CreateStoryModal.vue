<template>
  <div
    v-if="isOpen"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-emerald-600" />
          <h3 class="font-semibold text-slate-800 text-lg">Crear una Historia</h3>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Mode Selector -->
      <div class="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50">
        <button
          type="button"
          @click="mode = 'image'"
          :class="[
            'flex items-center gap-2 pb-3 px-4 text-xs font-semibold border-b-2 transition-colors',
            mode === 'image'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          ]"
        >
          <ImageIcon class="w-4 h-4" />
          <span>Historia con Foto / Imagen</span>
        </button>
        <button
          type="button"
          @click="mode = 'text'"
          :class="[
            'flex items-center gap-2 pb-3 px-4 text-xs font-semibold border-b-2 transition-colors',
            mode === 'text'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          ]"
        >
          <Type class="w-4 h-4" />
          <span>Historia de Texto</span>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <!-- Controls Column -->
        <div class="space-y-4">
          <template v-if="mode === 'image'">
            <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                @click="activeMediaTab = 'presets'"
                :class="[
                  'flex-1 py-1.5 rounded-md text-center transition-colors',
                  activeMediaTab === 'presets' ? 'bg-white shadow-xs text-slate-800 font-semibold' : 'text-slate-600'
                ]"
              >
                Galería HD
              </button>
              <button
                type="button"
                @click="activeMediaTab = 'url'"
                :class="[
                  'flex-1 py-1.5 rounded-md text-center transition-colors',
                  activeMediaTab === 'url' ? 'bg-white shadow-xs text-slate-800 font-semibold' : 'text-slate-600'
                ]"
              >
                Vincular URL
              </button>
              <button
                type="button"
                @click="activeMediaTab = 'upload'"
                :class="[
                  'flex-1 py-1.5 rounded-md text-center transition-colors',
                  activeMediaTab === 'upload' ? 'bg-white shadow-xs text-slate-800 font-semibold' : 'text-slate-600'
                ]"
              >
                Subir archivo
              </button>
            </div>

            <!-- Presets -->
            <div v-if="activeMediaTab === 'presets'" class="space-y-2">
              <label class="text-xs font-semibold text-slate-600 block">
                Selecciona una foto de alta calidad:
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="img in PRESET_IMAGE_GALLERY"
                  :key="img.url"
                  type="button"
                  @click="imageUrl = img.url"
                  :class="[
                    'relative rounded-lg overflow-hidden h-16 border-2 transition-all group',
                    imageUrl === img.url ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-slate-200'
                  ]"
                >
                  <img
                    :src="img.url"
                    :alt="img.label"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div
                    v-if="imageUrl === img.url"
                    class="absolute inset-0 bg-emerald-600/30 flex items-center justify-center"
                  >
                    <Check class="w-5 h-5 text-white stroke-[3]" />
                  </div>
                </button>
              </div>
            </div>

            <!-- URL -->
            <div v-if="activeMediaTab === 'url'" class="space-y-2">
              <label class="text-xs font-semibold text-slate-600 block">
                Pega la URL de cualquier imagen web:
              </label>
              <div class="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500">
                <LinkIcon class="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="url"
                  v-model="imageUrl"
                  placeholder="https://ejemplo.com/foto.jpg"
                  class="w-full text-xs bg-transparent outline-none text-slate-800"
                />
              </div>
            </div>

            <!-- Upload -->
            <div v-if="activeMediaTab === 'upload'" class="space-y-2">
              <label class="text-xs font-semibold text-slate-600 block">
                Selecciona una imagen desde tu dispositivo:
              </label>
              <label class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors">
                <Upload class="w-6 h-6 text-slate-400 mb-2" />
                <span class="text-xs text-slate-600 font-medium">Haz clic para subir foto</span>
                <span class="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP hasta 10MB</span>
                <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
              </label>
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-600 block mb-1">
                Texto o pie de foto (opcional):
              </label>
              <input
                type="text"
                v-model="imageCaption"
                placeholder="Escribe algo sobre esta foto..."
                class="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                maxlength="140"
              />
            </div>
          </template>

          <template v-else>
            <div>
              <label class="text-xs font-semibold text-slate-600 block mb-1">
                Tu mensaje:
              </label>
              <textarea
                v-model="textContent"
                placeholder="Comienza a escribir tu historia..."
                class="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-28"
                maxlength="200"
              />
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-600 block mb-2">
                Color de fondo degradado:
              </label>
              <div class="flex items-center gap-2">
                <button
                  v-for="(grad, i) in GRADIENTS"
                  :key="i"
                  type="button"
                  @click="selectedGradient = grad"
                  :class="[
                    'w-8 h-8 rounded-full transition-transform',
                    selectedGradient === grad ? 'scale-110 ring-2 ring-emerald-500 ring-offset-2' : ''
                  ]"
                  :style="{ background: grad }"
                />
              </div>
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-600 block mb-2">
                Color de letra:
              </label>
              <div class="flex items-center gap-2">
                <button
                  v-for="col in ['#ffffff', '#fef08a', '#a7f3d0', '#fed7aa']"
                  :key="col"
                  type="button"
                  @click="textColor = col"
                  :class="[
                    'w-7 h-7 rounded-full border border-slate-300 transition-transform',
                    textColor === col ? 'ring-2 ring-emerald-500 scale-110' : ''
                  ]"
                  :style="{ backgroundColor: col }"
                />
              </div>
            </div>
          </template>
        </div>

        <!-- Live Preview -->
        <div class="flex flex-col items-center">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Vista previa
          </span>
          <div class="w-[200px] h-[350px] rounded-2xl overflow-hidden shadow-xl border border-slate-300 relative flex flex-col justify-center items-center bg-slate-900 text-white select-none">
            <template v-if="mode === 'image'">
              <div v-if="imageUrl" class="relative w-full h-full">
                <SafeImage
                  :src="imageUrl"
                  alt="Preview"
                  imgClass="w-full h-full object-cover"
                  fallbackText="URL no válida"
                />
                <div v-if="imageCaption" class="absolute bottom-4 left-2 right-2 p-2 bg-black/60 backdrop-blur-xs rounded-lg text-[11px] text-center font-medium">
                  {{ imageCaption }}
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center p-4 text-center text-slate-400">
                <ImageIcon class="w-8 h-8 mb-2 stroke-slate-500" />
                <span class="text-xs">Selecciona o vincula una imagen</span>
              </div>
            </template>

            <template v-else>
              <div
                class="w-full h-full flex items-center justify-center p-4 text-center transition-all duration-300"
                :style="{ background: selectedGradient }"
              >
                <p
                  class="text-sm font-bold leading-relaxed break-words max-w-[170px]"
                  :style="{ color: textColor }"
                >
                  {{ textContent || 'Escribe tu texto...' }}
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="publish"
          :disabled="mode === 'image' ? !imageUrl.trim() : !textContent.trim()"
          class="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Sparkles class="w-4 h-4" />
          <span>Compartir en Historia</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  X,
  Image as ImageIcon,
  Type,
  Check,
  Sparkles,
  Upload,
  Link as LinkIcon
} from 'lucide-vue-next';
import { PRESET_IMAGE_GALLERY } from '@/shared/data/initialData';
import { useHistoryStore } from '../store/historyStore';
import SafeImage from '@/shared/components/SafeImage.vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);
const historyStore = useHistoryStore();

const mode = ref('image');
const imageUrl = ref('');
const imageCaption = ref('');
const textContent = ref('');
const selectedGradient = ref('linear-gradient(135deg, #10b981 0%, #047857 100%)');
const textColor = ref('#ffffff');
const activeMediaTab = ref('presets');

const GRADIENTS = [
  'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
  'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
];

function handleFileUpload(e) {
  const file = e.target.files?.[0];
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
  }
}

function publish() {
  if (mode.value === 'image') {
    if (!imageUrl.value.trim()) return;
    historyStore.addStoryItem({
      type: 'image',
      mediaUrl: imageUrl.value.trim(),
      textContent: imageCaption.value.trim() || undefined,
      createdAt: 'Justo ahora',
    });
  } else {
    if (!textContent.value.trim()) return;
    historyStore.addStoryItem({
      type: 'text',
      textContent: textContent.value.trim(),
      backgroundColor: selectedGradient.value,
      textColor: textColor.value,
      createdAt: 'Justo ahora',
    });
  }
  emit('close');
}
</script>
