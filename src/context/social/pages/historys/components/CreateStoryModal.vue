<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex flex-col md:flex-row md:items-center md:justify-center p-0 md:p-4 bg-white md:bg-black/75 md:backdrop-blur-sm animate-in fade-in duration-150"
      @click="$emit('close')"
    >
      <!-- On mobile: full screen view (100% viewport width and height, border-0, rounded-none). On desktop: centered modal dialog -->
      <div
        class="relative w-full h-[100dvh] md:h-auto md:max-h-[92vh] md:max-w-2xl bg-white md:rounded-2xl shadow-none md:shadow-2xl overflow-hidden border-0 md:border md:border-slate-200 flex flex-col animate-in slide-in-from-bottom-2 md:slide-in-from-bottom-0 duration-150"
        @click.stop
      >
        <!-- Header: Mobile Native App Bar with Back Arrow and Share Button; Desktop with Title and Close X -->
        <div class="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-white shrink-0 select-none">
          <div class="flex items-center gap-2">
            <!-- Back button on mobile (Android App style) -->
            <button
              type="button"
              @click="$emit('close')"
              class="md:hidden p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Volver"
            >
              <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
            </button>

            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 hidden sm:flex items-center justify-center">
              <Sparkles class="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-base sm:text-lg leading-tight">Crear una Historia</h3>
              <p class="text-[11px] text-slate-400 hidden sm:block">Visible para tus amigos durante 24 horas</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Mobile Share button directly in header -->
            <button
              type="button"
              @click="publish"
              :disabled="mode === 'image' ? !imageUrl.trim() : !textContent.trim()"
              class="md:hidden px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
            >
              Compartir
            </button>

            <!-- Desktop Close X button -->
            <button
              type="button"
              @click="$emit('close')"
              class="hidden md:flex p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Mode Selector -->
        <div class="flex border-b border-slate-100 px-3 sm:px-6 pt-2 bg-slate-50/70 shrink-0">
          <button
            type="button"
            @click="mode = 'image'"
            :class="[
              'flex items-center gap-2 pb-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
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
              'flex items-center gap-2 pb-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
              mode === 'text'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            ]"
          >
            <Type class="w-4 h-4" />
            <span>Historia de Texto</span>
          </button>
        </div>

        <!-- Body: items-start keeps controls strictly at the top and prevents vertical jump -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <!-- Controls Column: Pinned at top -->
          <div class="space-y-4 flex flex-col justify-start">
            <template v-if="mode === 'image'">
              <!-- Sub-tabs: Galería HD | Vincular URL | Subir archivo -->
              <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  @click="activeMediaTab = 'presets'"
                  :class="[
                    'flex-1 py-1.5 rounded-lg text-center transition-colors cursor-pointer',
                    activeMediaTab === 'presets' ? 'bg-white shadow-xs text-slate-800 font-semibold' : 'text-slate-600 hover:text-slate-800'
                  ]"
                >
                  Galería HD
                </button>
                <button
                  type="button"
                  @click="activeMediaTab = 'url'"
                  :class="[
                    'flex-1 py-1.5 rounded-lg text-center transition-colors cursor-pointer',
                    activeMediaTab === 'url' ? 'bg-white shadow-xs text-slate-800 font-semibold' : 'text-slate-600 hover:text-slate-800'
                  ]"
                >
                  Vincular URL
                </button>
                <button
                  type="button"
                  @click="activeMediaTab = 'upload'"
                  :class="[
                    'flex-1 py-1.5 rounded-lg text-center transition-colors cursor-pointer',
                    activeMediaTab === 'upload' ? 'bg-white shadow-xs text-slate-800 font-semibold' : 'text-slate-600 hover:text-slate-800'
                  ]"
                >
                  Subir archivo
                </button>
              </div>

              <!-- Dynamic Media Source Panels (Consistent min-height prevents layout shift) -->
              <div class="min-h-[170px] flex flex-col justify-start">
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
                        'relative rounded-xl overflow-hidden h-16 border-2 transition-all group cursor-pointer',
                        imageUrl === img.url ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-slate-200 hover:border-slate-300'
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
                  <div class="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                    <LinkIcon class="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="url"
                      v-model="imageUrl"
                      placeholder="https://ejemplo.com/foto.jpg"
                      class="w-full text-xs bg-transparent outline-none text-slate-800"
                    />
                  </div>
                  <p class="text-[11px] text-slate-400 leading-normal">
                    Puedes copiar y pegar el enlace directo de cualquier foto pública de internet.
                  </p>
                </div>

                <!-- Upload -->
                <div v-if="activeMediaTab === 'upload'" class="space-y-2">
                  <label class="text-xs font-semibold text-slate-600 block">
                    Selecciona una imagen desde tu dispositivo:
                  </label>
                  <label class="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors">
                    <Upload class="w-6 h-6 text-slate-400 mb-1.5" />
                    <span class="text-xs text-slate-600 font-medium">Haz clic para subir foto</span>
                    <span class="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP hasta 10MB</span>
                    <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
                  </label>
                </div>
              </div>

              <!-- Caption -->
              <div>
                <label class="text-xs font-semibold text-slate-600 block mb-1">
                  Texto o pie de foto (opcional):
                </label>
                <input
                  type="text"
                  v-model="imageCaption"
                  placeholder="Escribe algo sobre esta foto..."
                  class="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white transition-all"
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
                  class="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-28 bg-slate-50 focus:bg-white transition-all"
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
                      'w-8 h-8 rounded-full transition-transform cursor-pointer',
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
                      'w-7 h-7 rounded-full border border-slate-300 transition-transform cursor-pointer',
                      textColor === col ? 'ring-2 ring-emerald-500 scale-110' : ''
                    ]"
                    :style="{ backgroundColor: col }"
                  />
                </div>
              </div>
            </template>
          </div>

          <!-- Live Preview Column: Positioned at top -->
          <div class="flex flex-col items-center justify-start">
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

        <!-- Footer on Desktop (Mobile uses the header share button) -->
        <div class="hidden md:flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="publish"
            :disabled="mode === 'image' ? !imageUrl.trim() : !textContent.trim()"
            class="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles class="w-4 h-4" />
            <span>Compartir en Historia</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import {
  X,
  ArrowLeft,
  Image as ImageIcon,
  Type,
  Check,
  Sparkles,
  Upload,
  Link as LinkIcon
} from 'lucide-vue-next';
import { PRESET_IMAGE_GALLERY } from '@/shared/data/initialData';
import { useHistoryStore } from '../store/historyStore';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);
const historyStore = useHistoryStore();

// System rule: Lock body scroll whenever modal is open
useBodyScrollLock(() => props.isOpen);

const mode = ref('image'); // 'image' | 'text'
const activeMediaTab = ref('presets'); // 'presets' | 'url' | 'upload'
const imageUrl = ref('');
const imageCaption = ref('');
const textContent = ref('');
const textColor = ref('#ffffff');

const GRADIENTS = [
  'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)',
  'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
  'linear-gradient(135deg, #f97316 0%, #e11d48 50%, #7c3aed 100%)',
  'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  'linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)',
];
const selectedGradient = ref(GRADIENTS[0]);

function handleFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    imageUrl.value = event.target?.result;
  };
  reader.readAsDataURL(file);
}

function publish() {
  if (mode.value === 'image' && !imageUrl.value.trim()) return;
  if (mode.value === 'text' && !textContent.value.trim()) return;

  historyStore.createStory({
    type: mode.value,
    mediaUrl: mode.value === 'image' ? imageUrl.value : null,
    caption: mode.value === 'image' ? imageCaption.value : null,
    textContent: mode.value === 'text' ? textContent.value : null,
    backgroundGradient: mode.value === 'text' ? selectedGradient.value : null,
    textColor: mode.value === 'text' ? textColor.value : null,
  });

  // Reset
  imageUrl.value = '';
  imageCaption.value = '';
  textContent.value = '';
  mode.value = 'image';
  activeMediaTab.value = 'presets';

  emit('close');
}
</script>
