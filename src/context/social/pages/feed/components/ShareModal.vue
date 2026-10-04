<template>
  <BaseModal
    :modelValue="isOpen"
    title="Compartir publicación"
    size="md"
    @update:modelValue="$emit('close')"
  >
    <div class="p-4 sm:p-5 space-y-4">
      <!-- Post Preview Summary Card -->
      <div class="p-3.5 rounded-md bg-slate-50 border border-slate-200 flex items-start gap-3">
        <SafeImage
          :src="post.authorAvatar"
          :alt="post.authorName"
          imgClass="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
          containerClass="w-10 h-10 rounded-full shrink-0"
        />
        <div class="flex-1 min-w-0">
          <h5 class="text-xs sm:text-sm font-bold text-slate-900 truncate">{{ post.authorName }}</h5>
          <p class="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">{{ post.content }}</p>
        </div>
        <div v-if="post.images && post.images.length > 0" class="w-12 h-12 rounded-md overflow-hidden bg-slate-200 shrink-0">
          <SafeImage
            :src="post.images[0]"
            alt="Miniatura"
            imgClass="w-full h-full object-cover"
            containerClass="w-full h-full"
          />
        </div>
      </div>

      <!-- Quote Share Input (Only when resharing someone else's post to own feed) -->
      <div v-if="showQuoteInput" class="space-y-3 animate-in fade-in duration-150">
        <textarea
          v-model="quoteText"
          placeholder="Escribe un pensamiento sobre esta publicación..."
          class="w-full text-xs sm:text-sm p-3 border border-emerald-400/80 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none h-24 bg-white"
          autofocus
        />
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="showQuoteInput = false"
            class="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="handleConfirmShare"
            class="px-4 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-md transition-colors cursor-pointer shadow-xs"
          >
            Publicar en mi feed
          </button>
        </div>
      </div>

      <!-- Share Action Options List -->
      <div class="space-y-1.5">
        <!-- 1. Compartir en tu feed (ONLY if it is NOT your own post) -->
        <button
          v-if="!isOwnPost && !showQuoteInput"
          type="button"
          @click="showQuoteInput = true"
          class="w-full flex items-center justify-between p-3 rounded-md hover:bg-slate-100 transition-colors text-left group cursor-pointer border border-transparent hover:border-slate-200"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition-colors shrink-0">
              <Share2 class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Compartir en tu feed
              </h4>
              <p class="text-xs text-slate-500">
                Difundir con tus amigos y añadir un comentario
              </p>
            </div>
          </div>
        </button>

        <!-- 2. Copiar enlace directo -->
        <button
          type="button"
          @click="copyLink"
          class="w-full flex items-center justify-between p-3 rounded-md hover:bg-slate-100 transition-colors text-left group cursor-pointer border border-transparent hover:border-slate-200"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors shrink-0">
              <Check v-if="copiedLink" class="w-5 h-5 text-emerald-700" />
              <Copy v-else class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-slate-900">
                {{ copiedLink ? '¡Enlace copiado al portapapeles!' : 'Copiar enlace directo' }}
              </h4>
              <p class="text-xs text-slate-500">
                Copia el enlace para compartir en WhatsApp u otras aplicaciones
              </p>
            </div>
          </div>
          <span v-if="copiedLink" class="text-xs text-emerald-700 font-bold px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-200">
            Copiado
          </span>
        </button>

        <!-- 3. Enviar por Mensaje privado -->
        <button
          type="button"
          @click="shareToMessenger"
          class="w-full flex items-center justify-between p-3 rounded-md hover:bg-slate-100 transition-colors text-left group cursor-pointer border border-transparent hover:border-slate-200"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
              <MessageSquare class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Enviar por Mensaje privado
              </h4>
              <p class="text-xs text-slate-500">
                Compartir por chat con un amigo en Socialgea
              </p>
            </div>
          </div>
        </button>

        <!-- 4. Vincular e insertar código HTML -->
        <button
          type="button"
          @click="copyEmbed"
          class="w-full flex items-center justify-between p-3 rounded-md hover:bg-slate-100 transition-colors text-left group cursor-pointer border border-transparent hover:border-slate-200"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
              <Check v-if="copiedEmbed" class="w-5 h-5 text-emerald-700" />
              <Code v-else class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-slate-900">
                {{ copiedEmbed ? '¡Código HTML copiado!' : 'Vincular e insertar código HTML' }}
              </h4>
              <p class="text-xs text-slate-500">
                Incrustar esta publicación en tu blog o sitio web
              </p>
            </div>
          </div>
          <span v-if="copiedEmbed" class="text-xs text-emerald-700 font-bold px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-200">
            Copiado
          </span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Share2, Copy, Check, MessageSquare, Code } from 'lucide-vue-next';
import { useFeedStore } from '../store/feedStore';
import BaseModal from '@/shared/components/BaseModal.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);
const feedStore = useFeedStore();
const router = useRouter();

const copiedLink = ref(false);
const copiedEmbed = ref(false);
const quoteText = ref('');
const showQuoteInput = ref(false);

const isOwnPost = computed(() => {
  const curId = feedStore.currentUser.id;
  return props.post.authorId === curId || props.post.authorId === 'user_current';
});

function handleConfirmShare() {
  feedStore.sharePost(props.post, quoteText.value);
  emit('close');
}

async function copyLink() {
  const url = `${window.location.origin}/feeds?post=${props.post.id}`;
  try {
    await navigator.clipboard.writeText(url);
    copiedLink.value = true;
    setTimeout(() => {
      copiedLink.value = false;
    }, 2500);
  } catch {}
}

async function copyEmbed() {
  const embedHtml = `<div class="socialgea-post" data-id="${props.post.id}">
  <p><strong>${props.post.authorName}</strong>: "${props.post.content.slice(0, 80)}..."</p>
  ${props.post.images && props.post.images[0] ? `<img src="${props.post.images[0]}" alt="Post media" />` : ''}
  <a href="${window.location.origin}/feeds">Ver en Socialgea</a>
</div>`;

  try {
    await navigator.clipboard.writeText(embedHtml);
    copiedEmbed.value = true;
    setTimeout(() => {
      copiedEmbed.value = false;
    }, 2500);
  } catch {}
}

function shareToMessenger() {
  emit('close');
  router.push('/messenger');
}
</script>
