<template>
  <Teleport to="body">
    <div
      v-if="lightbox.isOpen && currentImage"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-[99999] w-screen h-screen flex flex-col lg:flex-row bg-black select-none overflow-hidden animate-in fade-in duration-150"
      tabindex="0"
      @keydown.esc="feedStore.closeLightbox"
      @keydown.left="feedStore.prevLightboxImage"
      @keydown.right="feedStore.nextLightboxImage"
    >
    <!-- LEFT THEATER AREA (Black canvas with full-size photo, zoom & navigation) -->
    <div class="flex-1 h-full bg-black relative flex items-center justify-center min-w-0 overflow-hidden">
      <!-- Top Left Controls (Close X on mobile; Brand logo on desktop) -->
      <div class="absolute top-3 sm:top-4 left-3 sm:left-4 z-30 flex items-center gap-2.5">
        <button
          type="button"
          @click="feedStore.closeLightbox"
          class="w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Cerrar (Esc)"
          aria-label="Cerrar"
        >
          <X class="w-6 h-6 stroke-[2.2]" />
        </button>

        <RouterLink
          to="/feeds"
          @click="feedStore.closeLightbox"
          class="hidden lg:flex items-center cursor-pointer focus:outline-none"
          title="Conecta Radar"
        >
          <RadarLogo :size="40" :showText="false" withRadarPulse />
        </RouterLink>
      </div>

      <!-- Top Right Theater Controls (Zoom on desktop) -->
      <div class="absolute top-3 sm:top-4 right-3 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2">
        <span
          v-if="lightbox.images.length > 1"
          class="px-2.5 py-1 rounded-full bg-black/60 text-white/90 text-xs font-semibold border border-white/10"
        >
          {{ lightbox.activeIndex + 1 }} / {{ lightbox.images.length }}
        </span>

        <button
          type="button"
          @click="zoomIn"
          class="hidden sm:flex w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white items-center justify-center transition-colors cursor-pointer border border-white/10 shadow-md"
          title="Acercar (+)"
        >
          <ZoomIn class="w-4 h-4" />
        </button>

        <button
          type="button"
          @click="zoomOut"
          class="hidden sm:flex w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white items-center justify-center transition-colors cursor-pointer border border-white/10 shadow-md"
          title="Alejar (-)"
        >
          <ZoomOut class="w-4 h-4" />
        </button>
      </div>

      <!-- Previous Arrow Navigation Button -->
      <button
        v-if="lightbox.images.length > 1"
        type="button"
        @click.stop="feedStore.prevLightboxImage"
        class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer border border-white/15"
        title="Foto anterior (←)"
        aria-label="Foto anterior"
      >
        <ChevronLeft class="w-6 h-6 stroke-[2.5]" />
      </button>

      <!-- Next Arrow Navigation Button -->
      <button
        v-if="lightbox.images.length > 1"
        type="button"
        @click.stop="feedStore.nextLightboxImage"
        class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer border border-white/15"
        title="Siguiente foto (→)"
        aria-label="Siguiente foto"
      >
        <ChevronRight class="w-6 h-6 stroke-[2.5]" />
      </button>

      <!-- Central Full Image Stage -->
      <div
        class="w-full h-full flex items-center justify-center p-2 sm:p-6 cursor-zoom-in"
        @click="cycleZoom"
      >
        <img
          :src="currentImage"
          alt="Foto en modo teatro"
          :style="{ transform: `scale(${zoomScale})` }"
          class="max-h-[92vh] max-w-[94%] object-contain select-none shadow-2xl transition-transform duration-200 rounded-sm"
        />
      </div>

      <!-- Mobile Floating Bottom Action Bar (when comments sheet is not open) -->
      <div
        v-if="post && !showMobileComments"
        class="lg:hidden absolute bottom-0 inset-x-0 z-30 p-4 pb-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col gap-2.5 pointer-events-auto select-none"
      >
        <!-- 1. Author row at bottom (Exact match to screenshot 2: avatar + name + timestamp + privacy) -->
        <div class="flex items-center gap-2.5">
          <RouterLink
            :to="`/profiles/${post.authorId}`"
            @click="feedStore.closeLightbox"
            class="relative shrink-0 cursor-pointer"
          >
            <img
              :src="post.authorAvatar"
              :alt="post.authorName"
              class="w-9 h-9 rounded-full object-cover ring-1.5 ring-white/60"
            />
          </RouterLink>

          <div>
            <RouterLink
              :to="`/profiles/${post.authorId}`"
              @click="feedStore.closeLightbox"
              class="font-bold text-white text-sm hover:underline block leading-tight cursor-pointer"
            >
              {{ post.authorName }}
            </RouterLink>
            <div class="flex items-center gap-1.5 text-[11px] text-white/70 font-medium mt-0.5">
              <span>{{ post.timestamp || 'AYER A LAS 10:49 A.M.' }}</span>
              <span>·</span>
              <Globe class="w-3 h-3 text-white/70" />
            </div>
          </div>
        </div>

        <!-- 2. Post Caption below author -->
        <p v-if="post.content" class="text-xs sm:text-sm text-white/95 leading-relaxed line-clamp-3">
          {{ post.content }}
        </p>

        <!-- 3. Bottom Action Bar matching screenshot 2 -->
        <div class="flex items-center justify-between text-white pt-1">
          <div class="flex items-center gap-5">
            <!-- Like button: ICON + NUMBER ONLY (no text "Me gusta" or "Me encanta") -->
            <div
              class="relative"
              @mouseenter="delayShowPopover"
              @mouseleave="delayHidePopover"
            >
              <!-- Animated reactions popover -->
              <div
                v-if="showReactionsPopover"
                class="absolute -top-12 left-0 z-50"
                @mouseenter="clearPopoverTimer"
                @mouseleave="delayHidePopover"
              >
                <FacebookReactions @select="handleSelectReaction" />
              </div>

              <button
                type="button"
                @pointerdown="onPointerDownLike"
                @pointerup="onPointerUpLike"
                @pointercancel="onPointerUpLike"
                @pointerleave="onPointerUpLike"
                @click="onButtonClickLike"
                class="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer select-none active:scale-95"
                title="Me gusta / Reaccionar"
              >
                <FacebookReactionIcon
                  :type="post.userReaction || 'like'"
                  size="sm"
                  class="w-5 h-5 drop-shadow-sm"
                />
                <span class="font-bold text-sm text-white">{{ totalPostReactions }}</span>
              </button>
            </div>

            <!-- Comment button: ICON + NUMBER ONLY (no text "comentarios") -->
            <button
              type="button"
              @click="showMobileComments = true"
              class="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer active:scale-95"
              title="Comentarios"
            >
              <MessageCircle class="w-5 h-5 text-white stroke-[2.2]" />
              <span class="font-bold text-sm text-white">{{ (post.comments || []).length }}</span>
            </button>

            <!-- Share button: RIGHT ARROW ONLY (no text "Compartir") -->
            <button
              type="button"
              @click="showShareModal = true"
              class="flex items-center text-white/90 hover:text-white transition-colors cursor-pointer active:scale-95"
              title="Compartir"
            >
              <Share2 class="w-5 h-5 text-white stroke-[2.2]" />
            </button>
          </div>

          <!-- Right side: Reaction icons preview. Clicking opens full-screen Android reactions component! -->
          <button
            type="button"
            @click="showReactionsModal = true"
            class="flex items-center hover:scale-105 transition-transform cursor-pointer pl-2 py-1"
            title="Ver quiénes reaccionaron"
          >
            <div class="flex items-center -space-x-1.5">
              <FacebookReactionIcon
                v-for="t in topPostReactions"
                :key="t"
                :type="t"
                size="xs"
                class="ring-1.5 ring-black rounded-full drop-shadow-sm"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- Multiple Images Counter Badge & Thumbnails Strip -->
      <div
        v-if="lightbox.images.length > 1"
        :class="[
          'absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 bg-black/80 backdrop-blur-md rounded-2xl border border-white/15 max-w-[90vw] overflow-x-auto no-scrollbar shadow-2xl',
          !showMobileComments ? 'hidden lg:flex' : 'hidden'
        ]"
      >
        <button
          v-for="(img, idx) in lightbox.images"
          :key="idx"
          type="button"
          @click.stop="feedStore.setLightboxIndex(idx)"
          :class="[
            'w-11 h-11 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer border-2',
            lightbox.activeIndex === idx
              ? 'border-blue-500 ring-2 ring-blue-400 scale-105 opacity-100'
              : 'border-transparent opacity-50 hover:opacity-100'
          ]"
        >
          <img :src="img" :alt="`Miniatura ${idx + 1}`" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>

    <!-- RIGHT SIDEBAR CONTEXT PANEL (Full Post details, comments & interactive composer) -->
    <div
      v-if="post"
      :class="[
        'bg-white z-40 flex flex-col overflow-hidden',
        'lg:w-[380px] xl:w-[420px] 2xl:w-[440px] lg:h-full lg:shrink-0 lg:border-l lg:border-slate-200 lg:shadow-2xl lg:flex',
        showMobileComments
          ? 'fixed inset-x-0 bottom-0 top-14 sm:top-16 rounded-t-3xl shadow-2xl flex border-t border-slate-200 animate-in slide-in-from-bottom duration-200'
          : 'hidden lg:flex'
      ]"
    >
      <!-- Mobile Sheet Top Handle & Close -->
      <div class="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-4 bg-emerald-600 rounded-full" />
          <h4 class="font-bold text-slate-900 text-sm">Comentarios ({{ (post.comments || []).length }})</h4>
        </div>
        <button
          type="button"
          @click="showMobileComments = false"
          class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          title="Cerrar comentarios"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      <!-- Top Utility Header with shortcuts matching screenshot (Only messages and notifications) -->
      <div class="hidden lg:flex items-center justify-end gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50/60 select-none">
        <button
          type="button"
          @click="messengerStore.toggleOpen()"
          class="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Mensajes"
        >
          <MessageCircle class="w-4 h-4" />
        </button>
        <RouterLink
          to="/notifications"
          @click="feedStore.closeLightbox"
          class="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Notificaciones"
        >
          <Bell class="w-4 h-4" />
        </RouterLink>
        <RouterLink
          :to="`/profiles/${feedStore.currentUser.id}`"
          @click="feedStore.closeLightbox"
          class="w-8 h-8 rounded-full overflow-hidden ml-1 ring-1 ring-slate-200 cursor-pointer"
        >
          <img :src="feedStore.currentUser.avatar" :alt="feedStore.currentUser.name" class="w-full h-full object-cover" />
        </RouterLink>
      </div>

      <!-- Scrollable Middle Section: Author, Post Body, Stats, Action Bar & Comments Stream -->
      <div ref="scrollContainer" class="flex-1 overflow-y-auto">
        <!-- 1. Post Author Header -->
        <div class="p-4 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <RouterLink
              :to="`/profiles/${post.authorId}`"
              @click="feedStore.closeLightbox"
              class="shrink-0 cursor-pointer"
            >
              <SafeImage
                :src="post.authorAvatar"
                :alt="post.authorName"
                imgClass="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                containerClass="w-10 h-10 rounded-full"
              />
            </RouterLink>

            <div>
              <div class="flex items-center gap-1.5">
                <RouterLink
                  :to="`/profiles/${post.authorId}`"
                  @click="feedStore.closeLightbox"
                  class="font-bold text-slate-900 text-sm hover:underline cursor-pointer"
                >
                  {{ post.authorName }}
                </RouterLink>
                <span v-if="post.authorVerified" class="text-blue-500 font-bold text-xs">✓</span>
              </div>
              <div class="flex items-center gap-1 text-[11px] text-slate-500 font-normal">
                <span>{{ post.timestamp }}</span>
                <span>·</span>
                <Globe class="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            type="button"
            class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Opciones"
          >
            <MoreHorizontal class="w-5 h-5" />
          </button>
        </div>

        <!-- 2. Post Content Text (with hashtags and clickable mentions!) -->
        <div v-if="post.content" class="px-4 pb-3">
          <p class="text-xs sm:text-sm text-slate-800 leading-relaxed break-words whitespace-pre-line">
            <MentionText :content="post.content" :onMentionClick="feedStore.closeLightbox" />
          </p>
        </div>

        <!-- 3. Post Engagement Counters Bar (Reactions count, comments, shares) -->
        <div class="px-4 py-2 border-y border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            @click="showReactionsModal = true"
            class="flex items-center gap-1.5 hover:underline cursor-pointer"
            title="Ver quién reaccionó"
          >
            <div class="flex items-center -space-x-1">
              <FacebookReactionIcon
                v-for="t in topPostReactions"
                :key="t"
                :type="t"
                size="xs"
                class="ring-1.5 ring-white rounded-full"
              />
            </div>
            <span class="font-semibold text-slate-700">{{ totalPostReactions }}</span>
          </button>

          <div class="flex items-center gap-3 text-xs">
            <span v-if="post.comments?.length > 0">{{ post.comments.length }} comentarios</span>
            <span v-if="post.sharesCount > 0">{{ post.sharesCount }} veces compartido</span>
          </div>
        </div>

        <!-- 4. Post Action Buttons Bar (Icons + Numbers ONLY, NO TEXT) -->
        <div class="px-2 py-1.5 border-b border-slate-100 flex items-center justify-around relative">
          <!-- Reaccionar Button with Facebook Popover -->
          <div
            class="relative flex-1 flex justify-center"
            @mouseenter="delayShowPopover"
            @mouseleave="delayHidePopover"
          >
            <div
              v-if="showReactionsPopover"
              class="absolute -top-11 left-0 z-40 animate-in fade-in zoom-in-95 duration-100"
              @mouseenter="clearPopoverTimer"
              @mouseleave="delayHidePopover"
            >
              <FacebookReactions @select="handleSelectReaction" />
            </div>

            <button
              type="button"
              @click="handleClickReactionButton"
              :class="[
                'flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer hover:bg-slate-100',
                currentReactionConfig ? currentReactionConfig.colorClass : 'text-slate-600'
              ]"
              title="Reaccionar"
            >
              <FacebookReactionIcon
                :type="post.userReaction"
                size="xs"
                class="w-4 h-4"
              />
              <span class="font-bold text-xs">{{ totalPostReactions }}</span>
            </button>
          </div>

          <!-- Comentar Button -->
          <button
            type="button"
            @click="focusCommentInput"
            class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Comentarios"
          >
            <MessageCircle class="w-4 h-4 text-slate-600" />
            <span class="font-bold text-xs">{{ post.comments ? post.comments.length : 0 }}</span>
          </button>

          <!-- Compartir Button -->
          <button
            type="button"
            @click="showShareModal = true"
            class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Compartir publicación"
          >
            <Share2 class="w-4 h-4 text-slate-600" />
            <span class="font-bold text-xs">{{ post.sharesCount || 0 }}</span>
          </button>
        </div>

        <!-- 5. Comments Section Header with "Más relevantes ▾" -->
        <div class="px-4 py-2.5 flex items-center justify-between text-xs text-slate-600 border-b border-slate-50">
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

        <!-- 6. Comments Stream -->
        <div class="p-3 sm:p-4 space-y-3">
          <div v-if="sortedComments.length === 0" class="text-center py-8 text-xs text-slate-400">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </div>

          <div
            v-for="comment in sortedComments"
            :key="comment.id"
            class="space-y-2 group/comment"
          >
            <!-- Main Comment Row -->
            <div class="flex items-start gap-2.5">
              <RouterLink
                :to="`/profiles/${comment.authorId}`"
                @click="feedStore.closeLightbox"
                class="shrink-0 mt-0.5 cursor-pointer"
              >
                <SafeImage
                  :src="comment.authorAvatar"
                  :alt="comment.authorName"
                  imgClass="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  containerClass="w-8 h-8 rounded-full"
                />
              </RouterLink>

              <div class="flex-1 min-w-0">
                <!-- Grey Bubble -->
                <div class="inline-block bg-slate-100 hover:bg-slate-200/70 transition-colors px-3 py-2 rounded-2xl max-w-[92%]">
                  <div class="flex items-center gap-2">
                    <RouterLink
                      :to="`/profiles/${comment.authorId}`"
                      @click="feedStore.closeLightbox"
                      class="text-xs font-bold text-slate-900 cursor-pointer hover:underline"
                    >
                      {{ comment.authorName }}
                    </RouterLink>
                    <span class="text-[10px] text-slate-500 font-normal">
                      · {{ comment.timestamp }}
                    </span>
                  </div>

                  <!-- Comment content with clickable mentions -->
                  <p class="text-xs text-slate-900 leading-snug break-words mt-0.5">
                    <MentionText :content="comment.content" :onMentionClick="feedStore.closeLightbox" />
                  </p>
                </div>

                <!-- Comment Sub-actions -->
                <div class="flex items-center gap-3 px-2 pt-1 text-[11px] text-slate-500 font-semibold relative">
                  <!-- Comment Facebook Reaction Trigger (Clean Emoji Only, No text) -->
                  <div
                    class="relative inline-flex items-center"
                    @mouseenter="hoverCommentReaction(comment.id)"
                    @mouseleave="leaveCommentReaction"
                  >
                    <!-- Floating Reactions Dock -->
                    <div
                      v-if="activeCommentReactionId === comment.id"
                      class="absolute -top-9 left-0 z-40 animate-in fade-in zoom-in-95 duration-100"
                      @mouseenter="clearCommentReactionTimer"
                      @mouseleave="leaveCommentReaction"
                    >
                      <FacebookReactions
                        compact
                        size="xs"
                        @select="(type) => handleCommentReaction(comment.id, type)"
                      />
                    </div>

                    <button
                      type="button"
                      @click="handleClickCommentReaction(comment)"
                      class="p-0.5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      :title="comment.userReaction ? 'Quitar o cambiar reacción' : 'Reaccionar'"
                    >
                      <FacebookReactionIcon
                        :type="comment.userReaction || 'like'"
                        size="xs"
                        :class="[
                          'w-3.5 h-3.5 transition-all',
                          comment.userReaction ? 'scale-105 drop-shadow-2xs' : 'opacity-50 hover:opacity-100'
                        ]"
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    @click="startReply(comment, { id: comment.authorId, name: comment.authorName })"
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

                  <!-- Reaction Counter Badge -->
                  <button
                    v-if="comment.likesCount > 0"
                    type="button"
                    @click="openReactionsModalFor(comment)"
                    class="ml-auto flex items-center gap-1 bg-white hover:bg-slate-50 px-2 py-0.5 rounded-full shadow-2xs border border-slate-200 text-[10px] text-slate-600 transition-transform active:scale-95 cursor-pointer"
                    title="Ver quién reaccionó a este comentario"
                  >
                    <div class="flex items-center -space-x-1">
                      <FacebookReactionIcon
                        v-for="t in getTopReactionsFor(comment)"
                        :key="t"
                        :type="t"
                        size="xs"
                        class="ring-1 ring-white rounded-full w-3.5 h-3.5"
                      />
                    </div>
                    <span class="font-bold text-slate-700 ml-0.5">{{ comment.likesCount }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Nested Replies Thread -->
            <div v-if="comment.replies && comment.replies.length > 0" class="pl-10 space-y-2 relative">
              <div class="absolute left-4 top-0 bottom-3 w-0.5 bg-slate-200 rounded-full" />

              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="flex items-start gap-2 relative pl-1.5"
              >
                <div class="absolute -left-5 top-4 w-3.5 h-3 border-l-2 border-b-2 border-slate-200 rounded-bl-lg" />

                <RouterLink
                  :to="`/profiles/${reply.authorId}`"
                  @click="feedStore.closeLightbox"
                  class="shrink-0 mt-0.5 cursor-pointer"
                >
                  <SafeImage
                    :src="reply.authorAvatar"
                    :alt="reply.authorName"
                    imgClass="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                    containerClass="w-6 h-6 rounded-full"
                  />
                </RouterLink>

                <div class="flex-1 min-w-0">
                  <div class="inline-block bg-slate-100 hover:bg-slate-200/70 transition-colors px-3 py-1.5 rounded-2xl max-w-[92%]">
                    <div class="flex items-center gap-1.5">
                      <RouterLink
                        :to="`/profiles/${reply.authorId}`"
                        @click="feedStore.closeLightbox"
                        class="text-xs font-bold text-slate-900 cursor-pointer hover:underline"
                      >
                        {{ reply.authorName }}
                      </RouterLink>
                      <span class="text-[10px] text-slate-500 font-normal">
                        · {{ reply.timestamp }}
                      </span>
                    </div>

                    <!-- Replying to specific person without duplicate mention -->
                    <p class="text-xs text-slate-900 leading-snug break-words mt-0.5">
                      <template v-if="!reply.content.startsWith('@')">
                        <RouterLink
                          v-if="reply.replyToUserId"
                          :to="`/profiles/${reply.replyToUserId}`"
                          @click="feedStore.closeLightbox"
                          class="text-blue-600 hover:text-blue-800 font-bold mr-1 hover:underline cursor-pointer inline-flex items-center"
                        >
                          @{{ reply.replyToUserName || comment.authorName }}
                        </RouterLink>
                        <span v-else-if="reply.replyToUserName" class="text-blue-600 font-bold mr-1">
                          @{{ reply.replyToUserName }}
                        </span>
                      </template>
                      <MentionText :content="reply.content" :onMentionClick="feedStore.closeLightbox" />
                    </p>
                  </div>

                  <!-- Reply sub-actions -->
                  <div class="flex items-center gap-3 px-2 pt-0.5 text-[11px] text-slate-500 font-semibold relative">
                    <div
                      class="relative inline-flex items-center"
                      @mouseenter="hoverCommentReaction(reply.id)"
                      @mouseleave="leaveCommentReaction"
                    >
                      <div
                        v-if="activeCommentReactionId === reply.id"
                        class="absolute -top-9 left-0 z-40 animate-in fade-in zoom-in-95 duration-100"
                        @mouseenter="clearCommentReactionTimer"
                        @mouseleave="leaveCommentReaction"
                      >
                        <FacebookReactions
                          compact
                          size="xs"
                          @select="(type) => handleCommentReaction(reply.id, type)"
                        />
                      </div>

                      <button
                        type="button"
                        @click="handleClickCommentReaction(reply)"
                        class="p-0.5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                        :title="reply.userReaction ? 'Quitar o cambiar reacción' : 'Reaccionar'"
                      >
                        <FacebookReactionIcon
                          :type="reply.userReaction || 'like'"
                          size="xs"
                          :class="[
                            'w-3 h-3 transition-all',
                            reply.userReaction ? 'scale-105 drop-shadow-2xs' : 'opacity-50 hover:opacity-100'
                          ]"
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      @click="startReply(comment, { id: reply.authorId, name: reply.authorName })"
                      class="hover:underline cursor-pointer text-[10.5px]"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Inline Thread Reply Input Box -->
            <div v-if="activeReplyCommentId === comment.id" class="pl-10 pt-1 flex flex-col gap-1.5 relative">
              <div v-if="activeReplyTarget" class="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Respondiendo a <strong class="text-blue-600">@{{ activeReplyTarget.name }}</strong></span>
                <button type="button" @click="cancelReply" class="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X class="w-3 h-3" />
                </button>
              </div>

              <div class="flex items-center gap-2">
                <input
                  :data-reply-input="comment.id"
                  type="text"
                  v-model="replyText"
                  placeholder="Escribe una respuesta..."
                  class="flex-1 text-xs text-slate-900 bg-slate-100 rounded-full px-3 py-1.5 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 border border-slate-200"
                  @keydown.enter.prevent="submitReply(comment.id)"
                  autofocus
                />
                <button
                  type="button"
                  @click="submitReply(comment.id)"
                  :disabled="!replyText.trim()"
                  class="p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 cursor-pointer"
                >
                  <Send class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Fixed Sticky Bottom Comment Composer with @ Autocomplete -->
      <div class="p-3 bg-white border-t border-slate-200 z-30 relative select-none">
        <MentionAutocomplete
          :isOpen="showMentionAutocomplete"
          :searchQuery="mentionQuery"
          @select="selectMentionMain"
        />

        <form @submit.prevent="submitComment" class="flex items-center gap-2">
          <SafeImage
            :src="feedStore.currentUser.avatar"
            :alt="feedStore.currentUser.name"
            imgClass="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
            containerClass="w-8 h-8 rounded-full shrink-0"
          />

          <div class="flex-1 bg-slate-100 rounded-2xl px-3 py-1.5 border border-slate-200 flex items-center gap-1.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <input
              ref="commentInputRef"
              type="text"
              v-model="commentText"
              @input="onCommentInput"
              placeholder="Escribe un comentario..."
              class="flex-1 text-xs text-slate-900 placeholder-slate-500 bg-transparent outline-none"
            />

            <div class="flex items-center gap-1 text-slate-400 shrink-0">
              <button
                type="button"
                @click="commentText += ' 🙂'"
                class="hover:text-amber-500 transition-colors cursor-pointer"
                title="Emoji"
              >
                <Smile class="w-4 h-4" />
              </button>
              <button
                type="button"
                @click="commentText += ' 📸'"
                class="hover:text-blue-600 transition-colors cursor-pointer"
                title="Foto"
              >
                <Camera class="w-4 h-4" />
              </button>
              <button
                type="submit"
                :disabled="!commentText.trim()"
                class="p-1 rounded-full text-blue-600 hover:text-blue-700 disabled:opacity-30 cursor-pointer"
                title="Enviar"
              >
                <Send class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modals inside Lightbox (Reactions modal & Share modal) -->
    <ReactionsModal
      v-if="post"
      :post="selectedEntityForReactions || post"
      :isOpen="showReactionsModal"
      @close="showReactionsModal = false; selectedEntityForReactions = null"
    />

    <ShareModal
      v-if="post"
      :post="post"
      :isOpen="showShareModal"
      @close="showShareModal = false"
    />
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, watch, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';
import {
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Globe,
  MoreHorizontal,
  MoreVertical,
  Tag,
  MessageCircle,
  Share2,
  ChevronDown,
  Camera,
  Smile,
  Send,
  Bell
} from 'lucide-vue-next';
import { useFeedStore } from '../store/feedStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import { useNotificationStore } from '@/modules/notifications/store/notificationStore';
import { REACTION_CONFIGS } from '../composables/useReactions';
import FacebookReactions from './FacebookReactions.vue';
import FacebookReactionIcon from './FacebookReactionIcon.vue';
import ReactionsModal from './ReactionsModal.vue';
import ShareModal from './ShareModal.vue';
import SafeImage from '@/shared/components/SafeImage.vue';
import RadarLogo from '@/shared/components/RadarLogo.vue';
import MentionText from './MentionText.vue';
import MentionAutocomplete from './MentionAutocomplete.vue';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const feedStore = useFeedStore();
const messengerStore = useMessengerStore();
const notificationStore = useNotificationStore();

const lightbox = computed(() => feedStore.lightbox);
const currentImage = computed(() => feedStore.currentLightboxImage);
const post = computed(() => feedStore.currentLightboxPost);

useBodyScrollLock(() => lightbox.value.isOpen);

const showMobileComments = ref(false);

watch(
  () => lightbox.value.isOpen && !!currentImage.value,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      showMobileComments.value = false;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
});

const scrollContainer = ref(null);
const commentInputRef = ref(null);

// Zoom and Fullscreen
const zoomScale = ref(1);
const isFullscreen = ref(false);

function zoomIn() {
  zoomScale.value = Math.min(2.5, +(zoomScale.value + 0.3).toFixed(1));
}

function zoomOut() {
  zoomScale.value = Math.max(0.7, +(zoomScale.value - 0.3).toFixed(1));
}

function cycleZoom() {
  if (zoomScale.value === 1) {
    zoomScale.value = 1.4;
  } else if (zoomScale.value === 1.4) {
    zoomScale.value = 1.8;
  } else {
    zoomScale.value = 1;
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    isFullscreen.value = true;
  } else {
    document.exitFullscreen().catch(() => {});
    isFullscreen.value = false;
  }
}

// Comments, Reactions & Share
const showReactionsPopover = ref(false);
const showReactionsModal = ref(false);
const selectedEntityForReactions = ref(null);
const showShareModal = ref(false);
const showSortMenu = ref(false);
const sortOption = ref('relevant');

const commentText = ref('');
const activeReplyCommentId = ref(null);
const activeReplyTarget = ref(null);
const replyText = ref('');

// Mentions
const showMentionAutocomplete = ref(false);
const mentionQuery = ref('');

let popoverTimer = null;

const sortOptionLabel = computed(() => {
  if (sortOption.value === 'recent') return 'Más recientes';
  if (sortOption.value === 'all') return 'Todos los comentarios';
  return 'Más relevantes';
});

const sortedComments = computed(() => {
  if (!post.value?.comments) return [];
  const list = [...post.value.comments];
  if (sortOption.value === 'recent') {
    return list.slice().reverse();
  }
  if (sortOption.value === 'relevant') {
    return list.sort((a, b) => {
      const aEngagement = (a.likesCount || 0) + (a.replies?.length || 0) * 2;
      const bEngagement = (b.likesCount || 0) + (b.replies?.length || 0) * 2;
      return bEngagement - aEngagement;
    });
  }
  return list;
});

const totalPostReactions = computed(() => {
  if (!post.value?.reactions) return 0;
  return Object.values(post.value.reactions).reduce((acc, c) => acc + c, 0);
});

const topPostReactions = computed(() => {
  if (!post.value?.reactions) return ['like'];
  const keys = Object.keys(post.value.reactions)
    .filter((k) => post.value.reactions[k] > 0)
    .sort((a, b) => post.value.reactions[b] - post.value.reactions[a]);
  return keys.length > 0 ? keys.slice(0, 3) : ['like'];
});

const currentReactionConfig = computed(() => {
  return post.value?.userReaction ? REACTION_CONFIGS[post.value.userReaction] : null;
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

let holdTimerLike = null;
let didTriggerHoldLike = false;

function onPointerDownLike() {
  didTriggerHoldLike = false;
  if (holdTimerLike) clearTimeout(holdTimerLike);
  holdTimerLike = setTimeout(() => {
    didTriggerHoldLike = true;
    showReactionsPopover.value = true;
  }, 350);
}

function onPointerUpLike() {
  if (holdTimerLike) {
    clearTimeout(holdTimerLike);
    holdTimerLike = null;
  }
}

function onButtonClickLike() {
  if (didTriggerHoldLike) {
    didTriggerHoldLike = false;
    return;
  }
  if (holdTimerLike) {
    clearTimeout(holdTimerLike);
    holdTimerLike = null;
  }
  handleClickReactionButton();
}

function handleClickReactionButton() {
  if (!post.value) return;
  // Clean, unconditional toggle: if reacted, removes reaction; if none, gives 'like'
  if (post.value.userReaction) {
    feedStore.toggleReaction(post.value.id, null);
  } else {
    feedStore.toggleReaction(post.value.id, 'like');
  }
  showReactionsPopover.value = false;
}

function handleSelectReaction(type) {
  if (!post.value) return;
  // If user picks the reaction they already have, unclick/remove it!
  if (post.value.userReaction === type) {
    feedStore.toggleReaction(post.value.id, null);
  } else {
    feedStore.toggleReaction(post.value.id, type);
  }
  showReactionsPopover.value = false;
}

// Comment level reactions popover & handling
const activeCommentReactionId = ref(null);
let commentReactionTimer = null;

function hoverCommentReaction(id) {
  clearCommentReactionTimer();
  activeCommentReactionId.value = id;
}

function leaveCommentReaction() {
  clearCommentReactionTimer();
  commentReactionTimer = setTimeout(() => {
    activeCommentReactionId.value = null;
  }, 350);
}

function clearCommentReactionTimer() {
  if (commentReactionTimer) clearTimeout(commentReactionTimer);
}

function handleClickCommentReaction(commentOrReply) {
  if (activeCommentReactionId.value === commentOrReply.id) {
    if (commentOrReply.userReaction) {
      handleCommentReaction(commentOrReply.id, commentOrReply.userReaction);
    } else {
      handleCommentReaction(commentOrReply.id, 'like');
    }
  } else {
    clearCommentReactionTimer();
    activeCommentReactionId.value = commentOrReply.id;
  }
}

function handleCommentReaction(commentId, reactionType) {
  if (!post.value) return;
  feedStore.reactToComment(post.value.id, commentId, reactionType);
  activeCommentReactionId.value = null;
}

function getCommentReactionConfig(type) {
  return type ? REACTION_CONFIGS[type] : null;
}

function getTopReactionsFor(comment) {
  if (!comment?.reactions) return ['like'];
  const activeKeys = Object.keys(comment.reactions).filter((k) => (comment.reactions[k] || 0) > 0);
  if (activeKeys.length === 0) return ['like'];

  const result = [];
  if (comment.userReaction && (comment.reactions[comment.userReaction] || 0) > 0) {
    result.push(comment.userReaction);
  }
  const others = activeKeys
    .filter((k) => k !== comment.userReaction)
    .sort((a, b) => (comment.reactions[b] || 0) - (comment.reactions[a] || 0));

  for (const k of others) {
    if (result.length < 3) result.push(k);
  }
  return result.length > 0 ? result : ['like'];
}

function openReactionsModalFor(entity) {
  if (!entity.reactions) {
    entity.reactions = { like: entity.likesCount || 1, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
  }
  if (!entity.reactionsList || entity.reactionsList.length === 0) {
    entity.reactionsList = [
      {
        userId: 'user_1',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        type: entity.userReaction || 'love',
      },
    ];
  }
  selectedEntityForReactions.value = entity;
  showReactionsModal.value = true;
}

function startReply(comment, targetUser) {
  activeReplyCommentId.value = comment.id;
  activeReplyTarget.value = targetUser;
  replyText.value = `@${targetUser.name} `;
  nextTick(() => {
    const el = document.querySelector(`[data-reply-input="${comment.id}"]`);
    if (el) {
      el.focus();
      el.selectionStart = el.selectionEnd = replyText.value.length;
    }
  });
}

function cancelReply() {
  activeReplyCommentId.value = null;
  activeReplyTarget.value = null;
  replyText.value = '';
}

function onCommentInput(e) {
  const val = commentText.value;
  const cursor = e.target.selectionStart || val.length;
  const beforeCursor = val.slice(0, cursor);
  const match = beforeCursor.match(/@([a-zA-Z0-9_\s]{0,20})$/);
  if (match) {
    mentionQuery.value = match[1];
    showMentionAutocomplete.value = true;
  } else {
    showMentionAutocomplete.value = false;
  }
}

function selectMentionMain(user) {
  const val = commentText.value;
  const match = val.match(/@([a-zA-Z0-9_\s]{0,20})$/);
  if (match) {
    commentText.value = val.slice(0, match.index) + `@${user.name} `;
  } else {
    commentText.value += `@${user.name} `;
  }
  showMentionAutocomplete.value = false;
  notificationStore.addMentionNotification({
    senderName: feedStore.currentUser.name,
    senderAvatar: feedStore.currentUser.avatar,
    commentText: commentText.value,
  });
  nextTick(() => {
    commentInputRef.value?.focus();
  });
}

function focusCommentInput() {
  nextTick(() => {
    commentInputRef.value?.focus();
  });
}

function shareComment(c) {
  navigator.clipboard.writeText(`"${c.content}" - ${c.authorName}`);
  alert('¡Comentario copiado para compartir!');
}

function submitComment() {
  if (!post.value || !commentText.value.trim()) return;

  const text = commentText.value.trim();
  feedStore.addComment(post.value.id, text, null);

  if (text.includes('@')) {
    notificationStore.addMentionNotification({
      senderName: feedStore.currentUser.name,
      senderAvatar: feedStore.currentUser.avatar,
      commentText: text,
    });
  }

  commentText.value = '';
  showMentionAutocomplete.value = false;

  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
}

function submitReply(parentId) {
  if (!post.value || !replyText.value.trim()) return;

  let text = replyText.value.trim();
  if (activeReplyTarget.value?.name) {
    const prefix = `@${activeReplyTarget.value.name}`;
    const doublePrefix = `${prefix} ${prefix}`;
    while (text.startsWith(doublePrefix)) {
      text = prefix + text.slice(doublePrefix.length);
    }
  }

  feedStore.addComment(post.value.id, text, null, parentId, activeReplyTarget.value);

  if (activeReplyTarget.value || text.includes('@')) {
    notificationStore.addMentionNotification({
      senderName: feedStore.currentUser.name,
      senderAvatar: feedStore.currentUser.avatar,
      commentText: text,
    });
  }

  replyText.value = '';
  activeReplyCommentId.value = null;
  activeReplyTarget.value = null;
}

watch(currentImage, () => {
  zoomScale.value = 1;
});
</script>
