<template>
  <BaseModal
    :modelValue="modelValue"
    :title="isEditing ? 'Editar Producto del Catálogo' : 'Crear Nuevo Premio / Recompensa'"
    size="xl"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" id="rewardForm" class="p-4 sm:p-6 space-y-5 text-xs">
      <!-- Section A: Basic Info -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div class="sm:col-span-8 space-y-1">
          <label class="block font-bold text-slate-700">Título del Producto / Premio *</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Ej. Freidora de Aire 4.5L Digital Eco-Inverter"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-semibold"
          />
        </div>

        <div class="sm:col-span-4 space-y-1">
          <label class="block font-bold text-slate-700">Categoría *</label>
          <select
            v-model="form.category"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-semibold cursor-pointer"
          >
            <option value="Electrodomésticos">Electrodomésticos</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Hogar">Hogar</option>
            <option value="Movilidad">Movilidad</option>
            <option value="Cuidado Personal">Cuidado Personal</option>
          </select>
        </div>
      </div>

      <!-- Section B: Image Slots (1 grande + 3 cuadritos de miniaturas) -->
      <div class="p-4 rounded-md border border-slate-200 bg-slate-50/60 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h4 class="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Camera class="w-4 h-4 text-emerald-700" />
              <span>Galería de Imágenes del Producto (1 Grande + 3 Miniaturas)</span>
            </h4>
            <p class="text-[11px] text-slate-500 font-medium">
              Agrega las fotos haciendo clic en cada cuadrito (puedes subir fotos de tu equipo, pegar URL o usar fotos sugeridas).
            </p>
          </div>
          <span class="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
            Estilo Catálogo Amazon
          </span>
        </div>

        <!-- 4 Image Boxes Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <!-- Slot 1: Foto Principal (Grande) -->
          <div class="space-y-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              1. Foto Principal *
            </span>
            <div
              @click="openImageSelector(0)"
              :class="[
                'relative h-28 sm:h-32 rounded-md overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center text-center p-2',
                imageSlots[0]
                  ? 'border-2 border-emerald-600 shadow-2xs bg-white'
                  : 'border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/30'
              ]"
            >
              <template v-if="imageSlots[0]">
                <img :src="imageSlots[0]" alt="Foto principal" class="w-full h-full object-cover rounded" />
                <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <span class="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded">Cambiar</span>
                </div>
                <button
                  type="button"
                  @click.stop="removeImage(0)"
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer text-[10px]"
                  title="Eliminar foto"
                >
                  ✕
                </button>
              </template>
              <template v-else>
                <ImagePlus class="w-6 h-6 text-slate-400 mb-1" />
                <span class="text-[11px] font-bold text-slate-700 block">+ Foto Principal</span>
                <span class="text-[9.5px] text-slate-400">Clic para agregar</span>
              </template>
            </div>
          </div>

          <!-- Slot 2: Miniatura 1 -->
          <div class="space-y-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              2. Miniatura A
            </span>
            <div
              @click="openImageSelector(1)"
              :class="[
                'relative h-28 sm:h-32 rounded-md overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center text-center p-2',
                imageSlots[1]
                  ? 'border-2 border-amber-500 shadow-2xs bg-white'
                  : 'border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/30'
              ]"
            >
              <template v-if="imageSlots[1]">
                <img :src="imageSlots[1]" alt="Miniatura A" class="w-full h-full object-cover rounded" />
                <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <span class="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded">Cambiar</span>
                </div>
                <button
                  type="button"
                  @click.stop="removeImage(1)"
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer text-[10px]"
                  title="Eliminar foto"
                >
                  ✕
                </button>
              </template>
              <template v-else>
                <ImagePlus class="w-5 h-5 text-slate-400 mb-1" />
                <span class="text-[11px] font-bold text-slate-700 block">+ Miniatura 1</span>
                <span class="text-[9.5px] text-slate-400">Clic para agregar</span>
              </template>
            </div>
          </div>

          <!-- Slot 3: Miniatura 2 -->
          <div class="space-y-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              3. Miniatura B
            </span>
            <div
              @click="openImageSelector(2)"
              :class="[
                'relative h-28 sm:h-32 rounded-md overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center text-center p-2',
                imageSlots[2]
                  ? 'border-2 border-amber-500 shadow-2xs bg-white'
                  : 'border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/30'
              ]"
            >
              <template v-if="imageSlots[2]">
                <img :src="imageSlots[2]" alt="Miniatura B" class="w-full h-full object-cover rounded" />
                <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <span class="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded">Cambiar</span>
                </div>
                <button
                  type="button"
                  @click.stop="removeImage(2)"
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer text-[10px]"
                  title="Eliminar foto"
                >
                  ✕
                </button>
              </template>
              <template v-else>
                <ImagePlus class="w-5 h-5 text-slate-400 mb-1" />
                <span class="text-[11px] font-bold text-slate-700 block">+ Miniatura 2</span>
                <span class="text-[9.5px] text-slate-400">Clic para agregar</span>
              </template>
            </div>
          </div>

          <!-- Slot 4: Miniatura 3 -->
          <div class="space-y-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              4. Miniatura C
            </span>
            <div
              @click="openImageSelector(3)"
              :class="[
                'relative h-28 sm:h-32 rounded-md overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center text-center p-2',
                imageSlots[3]
                  ? 'border-2 border-amber-500 shadow-2xs bg-white'
                  : 'border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/30'
              ]"
            >
              <template v-if="imageSlots[3]">
                <img :src="imageSlots[3]" alt="Miniatura C" class="w-full h-full object-cover rounded" />
                <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <span class="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded">Cambiar</span>
                </div>
                <button
                  type="button"
                  @click.stop="removeImage(3)"
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer text-[10px]"
                  title="Eliminar foto"
                >
                  ✕
                </button>
              </template>
              <template v-else>
                <ImagePlus class="w-5 h-5 text-slate-400 mb-1" />
                <span class="text-[11px] font-bold text-slate-700 block">+ Miniatura 3</span>
                <span class="text-[9.5px] text-slate-400">Clic para agregar</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Section C: EcoPuntos & Business Logic (How many points users must collect) -->
      <div class="p-4 rounded-md border border-amber-200 bg-amber-50/50 space-y-3">
        <div class="flex items-center gap-2">
          <Coins class="w-4 h-4 text-amber-700" />
          <h4 class="font-extrabold text-amber-950 text-xs">
            Reglas de Canje & EcoPuntos Requeridos
          </h4>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1">
            <label class="block font-bold text-slate-800">
              Puntos a recaudar por el usuario *
            </label>
            <input
              v-model.number="form.pointsPrice"
              type="number"
              min="10"
              required
              placeholder="Ej. 1850"
              class="w-full px-3 py-2 bg-white border border-amber-300 rounded-md outline-none focus:border-amber-600 text-slate-900 font-extrabold text-sm tabular-nums shadow-2xs"
            />
            <span class="text-[10.5px] text-slate-500 font-medium block">
              Puntos exactos que se le descuentan al usuario.
            </span>
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-800">Valor Comercial en COP *</label>
            <input
              v-model.number="form.priceCOP"
              type="number"
              min="1000"
              required
              placeholder="Ej. 277500"
              class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-900 font-bold tabular-nums"
            />
            <span class="text-[10.5px] text-slate-500 font-medium block">
              Aparecerá como "{{ formattedCopPrice }}".
            </span>
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-800">Stock Inicial *</label>
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              required
              placeholder="Ej. 15"
              class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-900 font-bold tabular-nums"
            />
            <span class="text-[10.5px] text-slate-500 font-medium block">
              Unidades físicas disponibles para entrega.
            </span>
          </div>
        </div>
      </div>

      <!-- Section D: Sponsor, Equivalent, Delivery & Status -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div class="sm:col-span-6 space-y-1">
          <label class="block font-bold text-slate-700">Empresa Patrocinadora / Proveedor *</label>
          <input
            v-model="form.supplier"
            type="text"
            required
            placeholder="Ej. Recicladora Metropolitana Bogotá"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-semibold"
          />
        </div>

        <div class="sm:col-span-6 space-y-1">
          <label class="block font-bold text-slate-700">Equivalencia de Reciclaje *</label>
          <input
            v-model="form.recyclingEquivalent"
            type="text"
            required
            placeholder="Ej. Equivale a 20 kg de PET transparente"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
          />
        </div>

        <div class="sm:col-span-8 space-y-1">
          <label class="block font-bold text-slate-700">Método de Entrega / Despacho *</label>
          <input
            v-model="form.deliveryInfo"
            type="text"
            required
            placeholder="Ej. Retiro gratuito en sedes aliadas o despacho nacional a domicilio"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900"
          />
        </div>

        <div class="sm:col-span-4 space-y-1">
          <label class="block font-bold text-slate-700">Estado del Producto *</label>
          <select
            v-model="form.status"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-semibold cursor-pointer"
          >
            <option value="active">Activo en catálogo</option>
            <option value="draft">Borrador / Oculto</option>
            <option value="out_of_stock">Agotado</option>
          </select>
        </div>
      </div>

      <!-- Section E: Descripción & Ficha Técnica -->
      <div class="space-y-1">
        <label class="block font-bold text-slate-700">Descripción & Ficha Técnica del Producto</label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Características técnicas, garantía oficial, ahorro energético, materiales de upcycling..."
          class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 text-xs leading-relaxed"
        />
      </div>
    </form>

    <!-- Submodal / Picker para subir o pegar foto en el cuadrito seleccionado -->
    <Teleport to="body">
      <div
        v-if="activeSlotModal !== null"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        @click.self="activeSlotModal = null"
      >
        <div class="w-full max-w-lg bg-white rounded-md border border-slate-200 shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">
                {{ activeSlotModal === 0 ? 'Foto Principal (Portada Grande)' : `Miniatura ${activeSlotModal}` }}
              </h3>
              <span class="text-xs text-slate-500 font-medium">
                Sube un archivo de tu equipo, pega una URL o selecciona una sugerida.
              </span>
            </div>
            <button
              type="button"
              @click="activeSlotModal = null"
              class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Opciones de carga -->
          <div class="space-y-3 text-xs">
            <!-- Opción 1: Subir archivo local -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
              <label class="block font-bold text-slate-800">Opción 1: Subir imagen desde tu dispositivo</label>
              <input
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
              />
            </div>

            <!-- Opción 2: Pegar URL -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
              <label class="block font-bold text-slate-800">Opción 2: Pegar URL directa de imagen</label>
              <div class="flex gap-2">
                <input
                  v-model="tempUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  class="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-mono outline-none focus:border-emerald-700"
                />
                <button
                  type="button"
                  @click="applyTempUrl"
                  class="sg-btn sg-btn--primary sg-btn--sm"
                >
                  Asignar
                </button>
              </div>
            </div>

            <!-- Opción 3: Fotos sugeridas por categoría (1 clic) -->
            <div class="space-y-1.5">
              <span class="block font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                Fotos sugeridas para esta categoría:
              </span>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="(sugUrl, sIdx) in suggestedPhotos"
                  :key="sIdx"
                  type="button"
                  @click="selectSuggested(sugUrl)"
                  class="relative h-16 rounded-md overflow-hidden border border-slate-200 hover:border-emerald-600 hover:ring-2 hover:ring-emerald-400/50 cursor-pointer bg-slate-100"
                >
                  <img :src="sugUrl" alt="Sugerencia" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <template #actions>
      <div class="flex items-center justify-end gap-2.5">
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="sg-btn sg-btn--secondary sg-btn--sm"
        >
          Cancelar
        </button>

        <button
          type="submit"
          form="rewardForm"
          class="sg-btn sg-btn--primary sg-btn--sm"
          :disabled="isSubmitting"
        >
          <span>{{ isEditing ? 'Guardar Cambios' : 'Publicar Producto' }}</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { Camera, ImagePlus, Coins } from 'lucide-vue-next';
import BaseModal from '@/shared/components/BaseModal.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  initialReward: { type: Object, default: null },
  isSubmitting: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'save']);

const isEditing = computed(() => Boolean(props.initialReward?.id));

const form = ref({
  title: '',
  category: 'Electrodomésticos',
  pointsPrice: 1000,
  priceCOP: 150000,
  recyclingEquivalent: 'Equivale a 50 kg de PET',
  stock: 10,
  status: 'active',
  supplier: 'Recicladora Metropolitana Bogotá',
  deliveryInfo: 'Retiro gratuito en sedes aliadas o despacho nacional a domicilio',
  description: '',
});

// 4 ranuras para fotos (1 grande + 3 miniaturas)
const imageSlots = ref([
  'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  '',
]);

const activeSlotModal = ref(null);
const tempUrl = ref('');

const suggestedPhotos = [
  'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
];

const formattedCopPrice = computed(() => {
  return new Intl.NumberFormat('es-CO').format(form.value.priceCOP || 0) + ' COP';
});

watch(
  () => props.initialReward,
  (val) => {
    if (val) {
      form.value = {
        title: val.title || '',
        category: val.category || 'Electrodomésticos',
        pointsPrice: Number(val.rawPoints ?? val.pointsPrice ?? 1000),
        priceCOP: Number(val.priceCOP ?? (typeof val.price === 'string' ? parseInt(val.price.replace(/\D/g, ''), 10) : 150000)) || 150000,
        recyclingEquivalent: val.recyclingEquivalent || 'Equivale a 50 kg de PET',
        stock: val.stock !== undefined ? val.stock : 10,
        status: val.status || 'active',
        supplier: val.partnerEnterprise || val.supplier || 'Recicladora Metropolitana Bogotá',
        deliveryInfo: val.deliveryInfo || 'Retiro gratuito en sedes aliadas o despacho nacional a domicilio',
        description: val.description || '',
      };

      const existingImages = Array.isArray(val.images) && val.images.length > 0 ? [...val.images] : [];
      if (existingImages.length === 0 && val.image) existingImages.push(val.image);
      imageSlots.value = [
        existingImages[0] || val.image || '',
        existingImages[1] || '',
        existingImages[2] || '',
        existingImages[3] || '',
      ];
    } else {
      form.value = {
        title: '',
        category: 'Electrodomésticos',
        pointsPrice: 850,
        priceCOP: 180000,
        recyclingEquivalent: 'Equivale a 42.5 kg de PET transparente',
        stock: 12,
        status: 'active',
        supplier: 'Recicladora Metropolitana Bogotá',
        deliveryInfo: 'Retiro gratuito en sedes aliadas o despacho nacional a domicilio',
        description: '',
      };
      imageSlots.value = [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        '',
      ];
    }
  },
  { immediate: true }
);

function openImageSelector(slotIndex) {
  activeSlotModal.value = slotIndex;
  tempUrl.value = imageSlots.value[slotIndex] || '';
}

function removeImage(slotIndex) {
  imageSlots.value[slotIndex] = '';
}

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (activeSlotModal.value !== null) {
      imageSlots.value[activeSlotModal.value] = e.target.result;
      activeSlotModal.value = null;
    }
  };
  reader.readAsDataURL(file);
}

function applyTempUrl() {
  if (activeSlotModal.value !== null && tempUrl.value) {
    imageSlots.value[activeSlotModal.value] = tempUrl.value.trim();
    activeSlotModal.value = null;
  }
}

function selectSuggested(url) {
  if (activeSlotModal.value !== null) {
    imageSlots.value[activeSlotModal.value] = url;
    activeSlotModal.value = null;
  }
}

function handleSubmit() {
  // Asegurar que al menos la foto principal esté presente
  const validImages = imageSlots.value.filter((img) => Boolean(img && img.trim()));
  const mainImage = validImages[0] || 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80';

  const payload = {
    ...form.value,
    id: props.initialReward?.id,
    rawPoints: Number(form.value.pointsPrice),
    pointsPrice: `${new Intl.NumberFormat('es-CO').format(form.value.pointsPrice)} Pts`,
    priceCOP: Number(form.value.priceCOP),
    price: new Intl.NumberFormat('es-CO').format(form.value.priceCOP) + ' COP',
    partnerEnterprise: form.value.supplier,
    supplier: form.value.supplier,
    image: mainImage,
    images: validImages.length > 0 ? validImages : [mainImage],
  };

  emit('save', payload);
}
</script>
