<template>
  <div
    v-if="isOpen"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-white sm:bg-black/65 sm:backdrop-blur-xs animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-[620px] bg-white sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border border-slate-200/90 flex flex-col animate-in slide-in-from-bottom-2 sm:zoom-in-95 duration-200"
      @click.stop
    >
      <!-- 1. Modal Top Bar (Mobile: native app bar with back button; Desktop: centered title with close X) -->
      <div class="relative py-3 px-3.5 sm:py-3.5 sm:px-4 border-b border-slate-200/80 flex items-center justify-between sm:justify-center bg-white sticky top-0 z-30 select-none">
        <!-- Native Back Arrow for Mobile/Android -->
        <button
          type="button"
          @click="$emit('close')"
          class="sm:hidden p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Volver al feed"
        >
          <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
        </button>

        <h3 class="font-bold text-sm sm:text-base text-slate-900 tracking-tight truncate max-w-[240px] sm:max-w-none">
          Publicación de {{ post.authorName }}
        </h3>

        <!-- Desktop Close Button -->
        <button
          type="button"
          @click="$emit('close')"
          class="hidden sm:flex absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 items-center justify-center transition-colors cursor-pointer"
          title="Cerrar (Esc)"
          aria-label="Cerrar"
        >
          <X class="w-5 h-5 stroke-[2.2]" />
        </button>

        <!-- Placeholder for mobile symmetric spacing -->
        <div class="w-7 sm:hidden" />
      </div>

      <!-- 2. Scrollable Body: Full Post Details + Comments Stream -->
      <div class="flex-1 overflow-y-auto" ref="scrollContainer">
        <!-- Post Header: Author, Community, Time, 3-dots -->
        <div class="p-4 flex items-start justify-between">
          <div class="flex items-center gap-3">
            <RouterLink
              :to="`/profiles/${post.authorId}`"
              @click="$emit('close')"
              class="relative cursor-pointer shrink-0"
            >
              <SafeImage
                :src="post.authorAvatar"
                :alt="post.authorName"
                imgClass="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                containerClass="w-10 h-10 rounded-full"
              />
            </RouterLink>

            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <RouterLink
                  :to="`/profiles/${post.authorId}`"
                  @click="$emit('close')"
                  class="text-sm font-bold text-slate-900 hover:underline cursor-pointer"
                >
                  {{ post.authorName }}
                </RouterLink>

                <span
                  v-if="post.authorVerified"
                  title="Verificado"
                  class="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]"
                >
                  ✓
                </span>

                <span v-if="post.feeling" class="text-xs text-slate-500">
                  está {{ post.feeling.emoji }} {{ post.feeling.text }}
                </span>
              </div>

              <div class="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-normal">
                <span>{{ post.authorUsername ? `@${post.authorUsername}` : post.authorName }}</span>
                <span>·</span>
                <span>{{ post.timestamp }}</span>
                <span>·</span>
                <Globe class="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          <div class="relative">
            <button
              type="button"
              @click="showOptionsMenu = !showOptionsMenu"
              class="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Opciones"
            >
              <MoreHorizontal class="w-5 h-5" />
            </button>

            <div
              v-if="showOptionsMenu"
              class="absolute right-0 top-8 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
              @click="showOptionsMenu = false"
            >
              <button
                type="button"
                @click="feedStore.toggleSavePost(post.id)"
                class="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer"
              >
                <Bookmark :class="['w-4 h-4', post.isSaved ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400']" />
                <span>{{ post.isSaved ? 'Quitar de guardados' : 'Guardar publicación' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Post Body Content -->
        <!-- A. Colored Gradient Canvas (Like in user's screenshot) -->
        <div
          v-if="post.backgroundColor"
          class="min-h-[280px] p-8 flex items-center justify-center text-center px-6 select-none"
          :style="{ background: post.backgroundColor }"
        >
          <p
            class="text-xl sm:text-2xl font-black leading-tight max-w-lg break-words uppercase tracking-wide drop-shadow-sm"
            :style="{ color: post.textColor || '#ffffff' }"
          >
            {{ post.content }}
          </p>
        </div>

        <!-- B. Regular Text Content -->
        <div v-else-if="post.content" class="px-4 pb-3">
          <p class="text-sm text-slate-900 leading-relaxed whitespace-pre-line break-words">
            {{ post.content }}
          </p>
        </div>

        <!-- C. Linked Images Gallery (Clickable catalog with forward/backward navigation) -->
        <div
          v-if="post.images && post.images.length > 0"
          :class="[
            'bg-slate-950 overflow-hidden',
            post.images.length === 1 ? 'max-h-[460px]' : 'grid grid-cols-2 gap-1 max-h-[380px]'
          ]"
        >
          <div
            v-if="post.images.length === 1"
            class="w-full flex items-center justify-center bg-slate-900 cursor-pointer overflow-hidden"
            @click="feedStore.openLightbox(post.images, 0)"
          >
            <SafeImage
              :src="post.images[0]"
              alt="Imagen vinculada"
              imgClass="w-full max-h-[460px] object-cover hover:scale-101 transition-transform duration-300"
              containerClass="w-full"
            />
          </div>

          <template v-else>
            <div
              v-for="(img, idx) in post.images.slice(0, 4)"
              :key="idx"
              class="h-40 sm:h-48 cursor-pointer overflow-hidden bg-slate-900"
              @click="feedStore.openLightbox(post.images, idx)"
            >
              <SafeImage
                :src="img"
                :alt="`Imagen ${idx + 1}`"
                imgClass="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                containerClass="w-full h-full"
              />
            </div>
          </template>
        </div>

        <!-- 3. Modern Interaction Bar (Exact match to screenshot 1 & 2!) -->
        <div class="px-4 py-2.5 flex items-center justify-between border-t border-b border-slate-100 relative bg-white">
          <!-- Left side: [👍 51]  [💬 42]  [↗] -->
          <div class="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <!-- Like button with Facebook Popover -->
            <div
              class="relative"
              @mouseenter="delayShowPopover"
              @mouseleave="delayHidePopover"
            >
              <!-- Facebook Reactions Popover -->
              <div
                v-if="showReactionsPopover"
                class="absolute -top-12 left-0 z-40"
                @mouseenter="clearPopoverTimer"
                @mouseleave="delayHidePopover"
              >
                <FacebookReactions @select="handleSelectReaction" />
              </div>

              <button
                type="button"
                @click="handleClickReactionButton"
                :class="[
                  'flex items-center gap-1.5 transition-colors cursor-pointer',
                  currentReactionConfig ? currentReactionConfig.colorClass : 'text-slate-600 hover:text-slate-900'
                ]"
                title="Me gusta"
              >
                <!-- Authentic vector reaction icon -->
                <FacebookReactionIcon
                  :type="post.userReaction"
                  size="xs"
                  class="w-4 h-4"
                />
                <span :class="['text-xs font-bold', currentReactionConfig ? currentReactionConfig.colorClass : 'text-slate-700']">
                  {{ totalReactions }}
                </span>
              </button>
            </div>

            <!-- Comment button -->
            <button
              type="button"
              @click="focusCommentInput"
              class="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Comentar"
            >
              <MessageCircle class="w-4 h-4 text-slate-600 stroke-[2.2]" />
              <span class="text-xs font-bold">{{ post.comments.length }}</span>
            </button>

            <!-- Share button -->
            <button
              type="button"
              @click="showShareModal = true"
              class="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Compartir"
            >
              <Share2 class="w-4 h-4 text-slate-600 stroke-[2.2]" />
              <span v-if="post.sharesCount > 0" class="text-xs font-bold">{{ post.sharesCount }}</span>
            </button>
          </div>

          <!-- Right side: Stacked Reaction Badges (Vector SVGs like Facebook) -->
          <button
            type="button"
            @click="showReactionsModal = true"
            class="flex items-center hover:scale-105 transition-transform cursor-pointer"
            title="Ver quién reaccionó"
          >
            <div v-if="topReactions.length > 0" class="flex items-center -space-x-1.5">
              <FacebookReactionIcon
                v-for="t in topReactions"
                :key="t"
                :type="t"
                size="xs"
                class="ring-1.5 ring-white rounded-full drop-shadow-2xs"
              />
            </div>
            <div v-else-if="totalReactions > 0" class="flex items-center -space-x-1.5">
              <FacebookReactionIcon type="like" size="xs" class="ring-1.5 ring-white rounded-full drop-shadow-2xs" />
            </div>
          </button>
        </div>

        <!-- 4. Comments Section Header with "Más relevantes ▾" dropdown -->
        <div class="px-4 py-2 flex items-center justify-between text-xs text-slate-600 border-b border-slate-50">
          <div class="relative">
            <button
              type="button"
              @click="showSortMenu = !showSortMenu"
              class="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <span>{{ sortOptionLabel }}</span>
              <ChevronDown class="w-3.5 h-3.5" />
            </button>

            <div
              v-if="showSortMenu"
              class="absolute left-0 top-6 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30"
              @click="showSortMenu = false"
            >
              <button
                type="button"
                @click="sortOption = 'relevant'"
                :class="['w-full px-3 py-1.5 text-xs text-left cursor-pointer hover:bg-slate-50', sortOption === 'relevant' ? 'font-bold text-emerald-600' : 'text-slate-700']"
              >
                Más relevantes
              </button>
              <button
                type="button"
                @click="sortOption = 'recent'"
                :class="['w-full px-3 py-1.5 text-xs text-left cursor-pointer hover:bg-slate-50', sortOption === 'recent' ? 'font-bold text-emerald-600' : 'text-slate-700']"
              >
                Más recientes
              </button>
              <button
                type="button"
                @click="sortOption = 'all'"
                :class="['w-full px-3 py-1.5 text-xs text-left cursor-pointer hover:bg-slate-50', sortOption === 'all' ? 'font-bold text-emerald-600' : 'text-slate-700']"
              >
                Todos los comentarios
              </button>
            </div>
          </div>
        </div>

        <!-- 5. Comments Stream (Exact Facebook thread style) -->
        <div class="p-4 space-y-4">
          <div v-if="post.comments.length === 0" class="text-center py-6 text-xs text-slate-400">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </div>

          <div
            v-for="comment in post.comments"
            :key="comment.id"
            class="space-y-2 group/comment"
          >
            <!-- Main Comment -->
            <div class="flex items-start gap-2.5">
              <SafeImage
                :src="comment.authorAvatar"
                :alt="comment.authorName"
                imgClass="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                containerClass="w-9 h-9 rounded-full"
              />

              <div class="flex-1 min-w-0">
                <!-- Grey Bubble (Facebook signature look) -->
                <div class="inline-block bg-slate-100 hover:bg-slate-200/70 transition-colors px-3.5 py-2 rounded-2xl max-w-[92%]">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-900 cursor-pointer hover:underline">
                      {{ comment.authorName }}
                    </span>
                    <span class="text-[11px] text-slate-500 font-normal">
                      · {{ comment.timestamp }}
                    </span>
                  </div>

                  <p class="text-xs text-slate-900 leading-snug break-words mt-0.5">
                    {{ comment.content }}
                  </p>
                </div>

                <!-- Attached image if any -->
                <div
                  v-if="comment.imageUrl"
                  class="mt-1.5 max-w-[200px] rounded-xl overflow-hidden border border-slate-200 cursor-pointer"
                  @click="feedStore.openLightbox([comment.imageUrl], 0)"
                >
                  <SafeImage
                    :src="comment.imageUrl"
                    alt="Foto en comentario"
                    imgClass="w-full h-auto object-cover max-h-36"
                  />
                </div>

                <!-- Comment Sub-actions: 👍 | Responder | Compartir | Reactions Badge -->
                <div class="flex items-center gap-3 px-2 pt-1 text-[11px] text-slate-500 font-semibold relative">
                  <button
                    type="button"
                    @click="feedStore.toggleLikeComment(post.id, comment.id)"
                    :class="[
                      'flex items-center gap-1 hover:underline cursor-pointer',
                      comment.isLiked ? 'text-blue-600 font-bold' : 'hover:text-slate-800'
                    ]"
                  >
                    <ThumbsUp :class="['w-3.5 h-3.5', comment.isLiked ? 'fill-blue-600 text-blue-600' : 'text-slate-500']" />
                  </button>

                  <button
                    type="button"
                    @click="toggleReply(comment.id)"
                    class="hover:underline hover:text-slate-800 cursor-pointer"
                  >
                    Responder
                  </button>

                  <button
                    type="button"
                    @click="shareComment(comment)"
                    class="hover:underline hover:text-slate-800 cursor-pointer"
                  >
                    Compartir
                  </button>

                  <!-- Reaction Counter Badge (e.g. 😆👍 15) like screenshot -->
                  <div
                    v-if="comment.likesCount > 0"
                    class="ml-auto flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-full shadow-2xs border border-slate-200 text-[10px] text-slate-600 font-normal cursor-pointer"
                  >
                    <span>😆👍</span>
                    <span class="font-semibold">{{ comment.likesCount }}</span>
                  </div>

                  <button
                    v-if="comment.authorId === feedStore.currentUser.id"
                    type="button"
                    @click="feedStore.deleteComment(post.id, comment.id)"
                    class="text-red-500 hover:underline font-normal text-[10px] ml-2 cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Nested Replies Thread (Matches screenshot 2 with connecting curve line!) -->
            <div v-if="comment.replies && comment.replies.length > 0" class="pl-11 space-y-2 relative">
              <!-- Thread line connecting to parent -->
              <div class="absolute left-5 top-0 bottom-3 w-0.5 bg-slate-200 rounded-full" />

              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="flex items-start gap-2 relative pl-2"
              >
                <!-- Horizontal connector branch -->
                <div class="absolute -left-6 top-4 w-4 h-3 border-l-2 border-b-2 border-slate-200 rounded-bl-lg" />

                <SafeImage
                  :src="reply.authorAvatar"
                  :alt="reply.authorName"
                  imgClass="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                  containerClass="w-7 h-7 rounded-full"
                />

                <div class="flex-1 min-w-0">
                  <div class="inline-block bg-slate-100 hover:bg-slate-200/70 transition-colors px-3 py-1.5 rounded-2xl max-w-[92%]">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-bold text-slate-900 cursor-pointer hover:underline">
                        {{ reply.authorName }}
                      </span>
                      <span class="text-[10px] text-slate-500 font-normal">
                        · {{ reply.timestamp }}
                      </span>
                    </div>

                    <p class="text-xs text-slate-900 leading-snug break-words mt-0.5">
                      <span class="text-blue-600 font-semibold mr-1">
                        {{ comment.authorName }}
                      </span>
                      {{ reply.content }}
                    </p>
                  </div>

                  <!-- Reply sub-actions -->
                  <div class="flex items-center gap-3 px-2 pt-0.5 text-[11px] text-slate-500 font-semibold">
                    <button
                      type="button"
                      @click="feedStore.toggleLikeComment(post.id, reply.id)"
                      :class="['flex items-center gap-1 hover:underline cursor-pointer', reply.isLiked ? 'text-blue-600 font-bold' : '']"
                    >
                      <ThumbsUp :class="['w-3 h-3', reply.isLiked ? 'fill-blue-600 text-blue-600' : 'text-slate-500']" />
                    </button>
                    <button
                      type="button"
                      @click="toggleReply(comment.id)"
                      class="hover:underline cursor-pointer"
                    >
                      Responder
                    </button>
                    <button
                      type="button"
                      @click="shareComment(reply)"
                      class="hover:underline cursor-pointer"
                    >
                      Compartir
                    </button>

                    <div
                      v-if="reply.likesCount > 0"
                      class="ml-auto flex items-center gap-1 bg-white px-1.5 py-0.2 rounded-full shadow-2xs border border-slate-200 text-[10px] text-slate-600 font-normal"
                    >
                      <span>👍</span>
                      <span class="font-semibold">{{ reply.likesCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Inline Thread Reply Input Box (Screenshot 2: "Escribe una respuesta pública...") -->
            <div v-if="activeReplyCommentId === comment.id" class="pl-11 pt-1 flex items-center gap-2 relative">
              <div class="relative shrink-0">
                <SafeImage
                  :src="feedStore.currentUser.avatar"
                  :alt="feedStore.currentUser.name"
                  imgClass="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                  containerClass="w-7 h-7 rounded-full"
                />
                <span class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-slate-200 flex items-center justify-center">
                  <ChevronDown class="w-2.5 h-2.5 text-slate-600" />
                </span>
              </div>

              <div class="flex-1 bg-slate-100 rounded-3xl px-3 py-1.5 flex items-center gap-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 border border-transparent focus-within:border-slate-200 transition-all">
                <input
                  type="text"
                  v-model="replyText"
                  placeholder="Escribe una respuesta pública..."
                  class="flex-1 text-xs text-slate-900 bg-transparent outline-none placeholder-slate-500"
                  @keydown.enter.prevent="submitReply(comment.id)"
                  autofocus
                />

                <div class="flex items-center gap-1 text-slate-400">
                  <button type="button" @click="replyText += ' 🙂'" class="hover:text-amber-500 transition-colors cursor-pointer" title="Emoji">
                    <Smile class="w-4 h-4" />
                  </button>
                  <button type="button" @click="triggerPhotoUpload" class="hover:text-emerald-600 transition-colors cursor-pointer" title="Cámara / Foto">
                    <Camera class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    @click="submitReply(comment.id)"
                    :disabled="!replyText.trim()"
                    class="p-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-30 cursor-pointer ml-1"
                    title="Enviar respuesta"
                  >
                    <Send class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Fixed Sticky Bottom Comment Composer (Exact match to screenshot 1 & 2!) -->
      <div class="p-3 sm:px-4 bg-white border-t border-slate-200 z-30">
        <form @submit.prevent="submitComment" class="flex items-center gap-2.5">
          <!-- Current User Avatar with dropdown arrow -->
          <div class="relative shrink-0 cursor-pointer" title="Comentando como tú">
            <SafeImage
              :src="feedStore.currentUser.avatar"
              :alt="feedStore.currentUser.name"
              imgClass="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
              containerClass="w-9 h-9 rounded-full"
            />
            <span class="absolute -bottom-1 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center">
              <ChevronDown class="w-2.5 h-2.5 text-slate-600" />
            </span>
          </div>

          <!-- Rounded Pill Input Container -->
          <div class="flex-1 bg-slate-100 hover:bg-slate-200/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 rounded-3xl px-3.5 py-2 transition-all border border-transparent focus-within:border-slate-200 flex flex-col gap-1.5">
            <!-- Text Input -->
            <input
              ref="commentInputRef"
              type="text"
              v-model="commentText"
              placeholder="Escribe un comentario público..."
              class="w-full text-xs text-slate-900 placeholder-slate-500 bg-transparent outline-none"
              autofocus
            />

            <!-- Attached Image Preview in Comment if any -->
            <div v-if="commentImageUrl" class="relative inline-block mt-1">
              <img
                :src="commentImageUrl"
                alt="Vista previa"
                class="h-14 rounded-lg object-cover border border-slate-200"
              />
              <button
                type="button"
                @click="commentImageUrl = ''"
                class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <!-- Bottom icons row (like in Facebook: Stickers, Emoji, Camera, GIF, Send) -->
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-2 text-slate-400">
                <!-- Avatar / Sticker icon -->
                <button
                  type="button"
                  @click="commentText += ' 🎭'"
                  class="hover:text-slate-600 transition-colors cursor-pointer"
                  title="Stickers"
                >
                  <Smile class="w-4 h-4 text-slate-400" />
                </button>

                <!-- Emoji icon -->
                <button
                  type="button"
                  @click="commentText += ' 🙂'"
                  class="hover:text-amber-500 transition-colors cursor-pointer"
                  title="Insertar emoji"
                >
                  <Smile class="w-4 h-4" />
                </button>

                <!-- Camera / Photo icon -->
                <button
                  type="button"
                  @click="promptImageUrl"
                  class="hover:text-emerald-600 transition-colors cursor-pointer"
                  title="Adjuntar foto o imagen por URL"
                >
                  <Camera class="w-4 h-4" />
                </button>

                <!-- GIF icon badge -->
                <button
                  type="button"
                  @click="insertGif"
                  class="text-[10px] font-black tracking-tight border border-slate-300 rounded px-1 text-slate-500 hover:text-slate-800 hover:border-slate-500 cursor-pointer"
                  title="Insertar GIF"
                >
                  GIF
                </button>
              </div>

              <!-- Send Button -->
              <button
                type="submit"
                :disabled="!commentText.trim() && !commentImageUrl.trim()"
                class="text-emerald-600 hover:text-emerald-700 disabled:opacity-30 transition-colors cursor-pointer p-1"
                title="Publicar comentario"
              >
                <Send class="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Modals -->
      <ReactionsModal
        :post="post"
        :isOpen="showReactionsModal"
        @close="showReactionsModal = false"
      />

      <ShareModal
        :post="post"
        :isOpen="showShareModal"
        @close="showShareModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import {
  X,
  ArrowLeft,
  Globe,
  MoreHorizontal,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronDown,
  Camera,
  Smile,
  Send
} from 'lucide-vue-next';
import { useFeedStore } from '../store/feedStore';
import { REACTION_CONFIGS } from '../composables/useReactions';
import FacebookReactions from './FacebookReactions.vue';
import FacebookReactionIcon from './FacebookReactionIcon.vue';
import ReactionsModal from './ReactionsModal.vue';
import ShareModal from './ShareModal.vue';
import SafeImage from '@/shared/components/SafeImage.vue';
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

defineEmits(['close']);
const feedStore = useFeedStore();

const commentInputRef = ref(null);
const scrollContainer = ref(null);
const showReactionsPopover = ref(false);
const showReactionsModal = ref(false);
const showShareModal = ref(false);
const showOptionsMenu = ref(false);
const showSortMenu = ref(false);
const sortOption = ref('relevant');

const commentText = ref('');
const commentImageUrl = ref('');
const activeReplyCommentId = ref(null);
const replyText = ref('');

let popoverTimer = null;

const sortOptionLabel = computed(() => {
  if (sortOption.value === 'recent') return 'Más recientes';
  if (sortOption.value === 'all') return 'Todos los comentarios';
  return 'Más relevantes';
});

const totalReactions = computed(() => {
  return Object.values(props.post.reactions || {}).reduce((acc, c) => acc + c, 0);
});

const topReactions = computed(() => {
  return Object.keys(props.post.reactions || {})
    .filter((k) => (props.post.reactions?.[k] || 0) > 0)
    .sort((a, b) => (props.post.reactions?.[b] || 0) - (props.post.reactions?.[a] || 0))
    .slice(0, 3);
});

const currentReactionConfig = computed(() => {
  return props.post.userReaction ? REACTION_CONFIGS[props.post.userReaction] : null;
});

function delayShowPopover() {
  clearPopoverTimer();
  popoverTimer = setTimeout(() => {
    showReactionsPopover.value = true;
  }, 200);
}

function delayHidePopover() {
  clearPopoverTimer();
  popoverTimer = setTimeout(() => {
    showReactionsPopover.value = false;
  }, 350);
}

function clearPopoverTimer() {
  if (popoverTimer) clearTimeout(popoverTimer);
}

function handleClickReactionButton() {
  if (props.post.userReaction) {
    feedStore.toggleReaction(props.post.id, null);
  } else {
    feedStore.toggleReaction(props.post.id, 'like');
  }
  showReactionsPopover.value = false;
}

function handleSelectReaction(type) {
  feedStore.toggleReaction(props.post.id, type);
  showReactionsPopover.value = false;
}

function focusCommentInput() {
  nextTick(() => {
    commentInputRef.value?.focus();
  });
}

function toggleReply(commentId) {
  activeReplyCommentId.value = activeReplyCommentId.value === commentId ? null : commentId;
}

function promptImageUrl() {
  const url = prompt('Ingresa la URL de la imagen o foto para adjuntar al comentario:');
  if (url) commentImageUrl.value = url;
}

function insertGif() {
  const gifs = [
    'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
  ];
  commentImageUrl.value = gifs[Math.floor(Math.random() * gifs.length)];
}

function triggerPhotoUpload() {
  promptImageUrl();
}

function shareComment(c) {
  navigator.clipboard.writeText(`"${c.content}" - ${c.authorName}`);
  alert('¡Comentario copiado para compartir!');
}

function submitComment() {
  if (!commentText.value.trim() && !commentImageUrl.value.trim()) return;
  feedStore.addComment(props.post.id, commentText.value.trim(), commentImageUrl.value.trim() || null);
  commentText.value = '';
  commentImageUrl.value = '';

  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
}

function submitReply(parentId) {
  if (!replyText.value.trim()) return;
  feedStore.addComment(props.post.id, replyText.value.trim(), null, parentId);
  replyText.value = '';
  activeReplyCommentId.value = null;
}
</script>
