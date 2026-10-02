<template>
  <div
    v-if="isOpen"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <Share2 class="w-5 h-5 text-emerald-600" />
          <h3 class="font-semibold text-slate-800 text-base">Compartir publicación</h3>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Cerrar"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-3">
        <!-- Post Preview -->
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <img
            :src="post.authorAvatar"
            :alt="post.authorName"
            class="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
          />
          <div class="flex-1 min-w-0">
            <h5 class="text-xs font-semibold text-slate-800 truncate">{{ post.authorName }}</h5>
            <p class="text-xs text-slate-600 line-clamp-2 mt-0.5">{{ post.content }}</p>
          </div>
        </div>

        <div v-if="showQuoteInput" class="mt-2 space-y-2">
          <textarea
            v-model="quoteText"
            placeholder="Escribe un pensamiento sobre esto..."
            class="w-full text-sm p-3 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-20"
            autofocus
          />
          <div class="flex justify-end gap-2">
            <button
              @click="showQuoteInput = false"
              class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              @click="handleConfirmShare"
              class="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Publicar ahora
            </button>
          </div>
        </div>

        <!-- Share Actions -->
        <div class="space-y-1.5 pt-1">
          <button
            v-if="!showQuoteInput"
            @click="showQuoteInput = true"
            class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 transition-colors text-left group"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-200 transition-colors">
                <Share2 class="w-4 h-4" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-slate-800">Compartir en tu feed</h4>
                <p class="text-xs text-slate-500">Publicar con un comentario opcional</p>
              </div>
            </div>
          </button>

          <button
            @click="copyLink"
            class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors">
                <Check v-if="copiedLink" class="w-4 h-4 text-emerald-600" />
                <Copy v-else class="w-4 h-4" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-slate-800">
                  {{ copiedLink ? '¡Enlace copiado!' : 'Copiar enlace directo' }}
                </h4>
                <p class="text-xs text-slate-500">Copia la URL para compartir en otras redes</p>
              </div>
            </div>
            <span v-if="copiedLink" class="text-xs text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-50 rounded-md">
              Copiado
            </span>
          </button>

          <!-- Embed HTML code -->
          <button
            @click="copyEmbed"
            class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                <Check v-if="copiedEmbed" class="w-4 h-4 text-emerald-600" />
                <Code v-else class="w-4 h-4" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-slate-800">
                  {{ copiedEmbed ? '¡Código HTML copiado!' : 'Vincular e insertar código HTML' }}
                </h4>
                <p class="text-xs text-slate-500">Insertar esta publicación en tu blog o web</p>
              </div>
            </div>
            <span v-if="copiedEmbed" class="text-xs text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-50 rounded-md">
              Copiado
            </span>
          </button>

          <button
            @click="shareToMessenger"
            class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 group-hover:bg-sky-200 transition-colors">
                <MessageSquare class="w-4 h-4" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-slate-800">Enviar por Mensaje privado</h4>
                <p class="text-xs text-slate-500">Enviar a un amigo en Conecta Chat</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { X, Share2, Copy, Check, MessageSquare, Code } from 'lucide-vue-next';
import { useFeedStore } from '../store/feedStore';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

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

useBodyScrollLock(() => props.isOpen);

const emit = defineEmits(['close']);
const feedStore = useFeedStore();
const router = useRouter();

const copiedLink = ref(false);
const copiedEmbed = ref(false);
const quoteText = ref('');
const showQuoteInput = ref(false);

function handleConfirmShare() {
  feedStore.sharePost(props.post, quoteText.value);
  emit('close');
}

async function copyLink() {
  const url = `${window.location.origin}/#/feeds?post=${props.post.id}`;
  try {
    await navigator.clipboard.writeText(url);
    copiedLink.value = true;
    setTimeout(() => {
      copiedLink.value = false;
    }, 2000);
  } catch {}
}

async function copyEmbed() {
  const embedHtml = `<div class="conecta-post" data-id="${props.post.id}">
  <p><strong>${props.post.authorName}</strong>: "${props.post.content.slice(0, 80)}..."</p>
  ${props.post.images && props.post.images[0] ? `<img src="${props.post.images[0]}" alt="Post media" />` : ''}
  <a href="${window.location.origin}/#/feeds">Ver en Conecta Radar</a>
</div>`;

  try {
    await navigator.clipboard.writeText(embedHtml);
    copiedEmbed.value = true;
    setTimeout(() => {
      copiedEmbed.value = false;
    }, 2000);
  } catch {}
}

function shareToMessenger() {
  emit('close');
  router.push('/messenger');
}
</script>
