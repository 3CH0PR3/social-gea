<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 bg-white sm:bg-black/65 sm:backdrop-blur-xs w-full h-[100dvh] overflow-hidden"
      @click.self="$emit('close')"
    >
      <div
        class="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-[620px] bg-white sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border border-slate-200/90 flex flex-col flex-1 sm:flex-initial overscroll-contain"
        @click.stop
      >
        <!-- 1. Modal Top Bar (Mobile: native App Bar with back button; Desktop: centered title with close X) -->
        <header class="h-14 px-3 sm:px-4 border-b border-slate-200/90 flex items-center justify-between bg-white shrink-0 z-30 select-none">
          <!-- Native Back Arrow for Mobile/Android -->
          <button
            type="button"
            @click="$emit('close')"
            class="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Volver al feed"
          >
            <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
          </button>

          <h3 class="font-bold text-sm sm:text-base text-slate-900 tracking-tight truncate flex-1 text-left sm:text-center px-2">
            Publicación de {{ post.authorName }}
          </h3>

          <!-- Desktop & Mobile Close Button -->
          <button
            type="button"
            @click="$emit('close')"
            class="p-2 -mr-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Cerrar (Esc)"
            aria-label="Cerrar"
          >
            <X class="w-5 h-5 stroke-[2.2]" />
          </button>
        </header>

        <!-- 2. Scrollable Body: Full Post Details + Comments Stream -->
        <div class="flex-1 overflow-y-auto overscroll-contain min-h-0" ref="scrollContainer">
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

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap leading-tight">
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
                    class="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold"
                  >
                    ✓
                  </span>

                  <span v-if="post.feeling" class="text-[11px] text-slate-500 font-normal inline-flex items-center gap-1">
                    está {{ post.feeling.emoji }} {{ post.feeling.text }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-normal leading-none">
                  <span>{{ post.authorUsername ? `@${post.authorUsername}` : post.authorName }}</span>
                  <span>·</span>
                  <span>{{ post.timestamp }}</span>
                  <span>·</span>
                  <Globe class="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            <!-- Post Options Dropdown (•••) -->
            <div class="relative">
              <button
                type="button"
                @click="showOptionsMenu = !showOptionsMenu"
                class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Opciones"
              >
                <MoreHorizontal class="w-4.5 h-4.5" />
              </button>

              <div
                v-if="showOptionsMenu"
                class="absolute right-0 top-8 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100"
                @click="showOptionsMenu = false"
              >
                <div class="py-1">
                  <!-- Guardar / Quitar de guardados -->
                  <button
                    type="button"
                    @click="feedStore.toggleSavePost(post.id)"
                    class="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <Bookmark :class="['w-4 h-4', post.isSaved ? 'text-emerald-700 fill-emerald-700' : 'text-slate-500']" />
                    <span>{{ post.isSaved ? 'Quitar de guardados' : 'Guardar publicación' }}</span>
                  </button>

                  <!-- Copiar enlace -->
                  <button
                    type="button"
                    @click="handleCopyLink"
                    class="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <Link class="w-4 h-4 text-slate-500" />
                    <span>{{ copiedLink ? '¡Enlace copiado!' : 'Copiar enlace' }}</span>
                  </button>
                </div>

                <div class="py-1">
                  <!-- Ocultar publicación -->
                  <button
                    type="button"
                    @click="handleHidePost"
                    class="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <EyeOff class="w-4 h-4 text-slate-500" />
                    <div>
                      <div class="leading-tight">Ocultar publicación</div>
                      <div class="text-[10.5px] text-slate-400 font-normal">Ver menos publicaciones como esta</div>
                    </div>
                  </button>

                  <!-- Desactivar notificaciones -->
                  <button
                    type="button"
                    @click="handleMutePost"
                    class="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <BellOff class="w-4 h-4 text-slate-500" />
                    <span>Desactivar notificaciones</span>
                  </button>
                </div>

                <div class="py-1">
                  <!-- Reportar publicación -->
                  <button
                    type="button"
                    @click="handleReportPost"
                    class="w-full px-3.5 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <Flag class="w-4 h-4 text-amber-500" />
                    <span>Reportar publicación</span>
                  </button>

                  <!-- Eliminar publicación para mí -->
                  <button
                    type="button"
                    @click="handleDeletePost"
                    class="w-full px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <Trash2 class="w-4 h-4 text-rose-500" />
                    <span>{{ isAuthor ? 'Eliminar publicación' : 'Eliminar publicación para mí' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        <!-- Post Body Content -->
        <!-- A. Colored Gradient Canvas (Like in user's screenshot) -->
        <div
          v-if="post.backgroundColor"
          class="min-h-[220px] p-6 sm:p-8 flex items-center justify-center text-center px-4 select-none"
          :style="{ background: post.backgroundColor }"
        >
          <p
            class="text-lg sm:text-xl font-black leading-snug max-w-lg break-words uppercase tracking-wide drop-shadow-sm"
            :style="{ color: post.textColor || '#ffffff' }"
          >
            {{ post.content }}
          </p>
        </div>

        <!-- B. Regular Text Content -->
        <div v-else-if="post.content" class="px-4 pb-3">
          <p class="text-[13.5px] text-slate-800 leading-[1.38] whitespace-pre-line break-words">
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
          <div v-if="sortedComments.length === 0" class="text-center py-6 text-xs text-slate-400">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </div>

          <div
            v-for="comment in sortedComments"
            :key="comment.id"
            class="space-y-2 group/comment"
          >
            <!-- Main Comment -->
            <div class="flex items-start gap-2.5">
              <RouterLink
                :to="`/profiles/${comment.authorId}`"
                @click="$emit('close')"
                class="shrink-0 mt-0.5 cursor-pointer"
              >
                <SafeImage
                  :src="comment.authorAvatar"
                  :alt="comment.authorName"
                  imgClass="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                  containerClass="w-9 h-9 rounded-full"
                />
              </RouterLink>

              <div class="flex-1 min-w-0">
                <!-- Grey Bubble (Facebook signature look) -->
                <div class="inline-block bg-slate-100 hover:bg-slate-200/70 transition-colors px-3.5 py-2 rounded-2xl max-w-[92%]">
                  <div class="flex items-center gap-2">
                    <RouterLink
                      :to="`/profiles/${comment.authorId}`"
                      @click="$emit('close')"
                      class="text-xs font-bold text-slate-900 cursor-pointer hover:underline"
                    >
                      {{ comment.authorName }}
                    </RouterLink>
                    <span class="text-[11px] text-slate-500 font-normal">
                      · {{ comment.timestamp }}
                    </span>
                  </div>

                  <!-- Comment Body with Clickable Mentions -->
                  <p class="text-xs text-slate-900 leading-snug break-words mt-0.5">
                    <MentionText :content="comment.content" :onMentionClick="() => $emit('close')" />
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

                <!-- Comment Sub-actions: Reactions Popover / Like | Responder | Compartir | Reactions Badge -->
                <div class="flex items-center gap-3 px-2 pt-1 text-[11px] text-slate-500 font-semibold relative">
                  <!-- Comment Facebook Reaction Trigger (Clean Emoji Only, No text) -->
                  <div
                    class="relative inline-flex items-center"
                    @mouseenter="hoverCommentReaction(comment.id)"
                    @mouseleave="leaveCommentReaction"
                  >
                    <!-- Small Floating Emoji Dock -->
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
                    class="hover:underline hover:text-slate-800 cursor-pointer text-[11px]"
                  >
                    Responder
                  </button>

                  <button
                    type="button"
                    @click="shareComment(comment)"
                    class="hover:underline hover:text-slate-800 cursor-pointer text-[11px]"
                  >
                    Compartir
                  </button>

                  <!-- Clickable Reaction Counter Badge: Opens modal with who reacted! -->
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

                  <button
                    v-if="comment.authorId === feedStore.currentUser.id"
                    type="button"
                    @click="feedStore.deleteComment(post.id, comment.id)"
                    class="text-red-500 hover:underline font-normal text-[10px] ml-1 cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Nested Replies Thread -->
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

                <RouterLink
                  :to="`/profiles/${reply.authorId}`"
                  @click="$emit('close')"
                  class="shrink-0 mt-0.5 cursor-pointer"
                >
                  <SafeImage
                    :src="reply.authorAvatar"
                    :alt="reply.authorName"
                    imgClass="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                    containerClass="w-7 h-7 rounded-full"
                  />
                </RouterLink>

                <div class="flex-1 min-w-0">
                  <div class="inline-block bg-slate-100 hover:bg-slate-200/70 transition-colors px-3 py-1.5 rounded-2xl max-w-[92%]">
                    <div class="flex items-center gap-1.5">
                      <RouterLink
                        :to="`/profiles/${reply.authorId}`"
                        @click="$emit('close')"
                        class="text-xs font-bold text-slate-900 cursor-pointer hover:underline"
                      >
                        {{ reply.authorName }}
                      </RouterLink>
                      <span class="text-[10px] text-slate-500 font-normal">
                        · {{ reply.timestamp }}
                      </span>
                    </div>

                    <!-- Replying to specific person mention! -->
                    <p class="text-xs text-slate-900 leading-snug break-words mt-0.5">
                      <template v-if="!reply.content.startsWith('@')">
                        <RouterLink
                          v-if="reply.replyToUserId"
                          :to="`/profiles/${reply.replyToUserId}`"
                          @click="$emit('close')"
                          class="text-blue-600 hover:text-blue-800 font-bold mr-1 hover:underline cursor-pointer inline-flex items-center"
                        >
                          @{{ reply.replyToUserName || comment.authorName }}
                        </RouterLink>
                        <span v-else-if="reply.replyToUserName" class="text-blue-600 font-bold mr-1">
                          @{{ reply.replyToUserName }}
                        </span>
                      </template>
                      <MentionText :content="reply.content" :onMentionClick="() => $emit('close')" />
                    </p>
                  </div>

                  <!-- Reply sub-actions: Reactions Popover / Like | Responder | Compartir | Reactions Badge -->
                  <div class="flex items-center gap-3 px-2 pt-0.5 text-[11px] text-slate-500 font-semibold relative">
                    <!-- Reply Reaction Popover Trigger -->
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

                    <!-- Clicking Responder on a reply targets this reply's author! -->
                    <button
                      type="button"
                      @click="startReply(comment, { id: reply.authorId, name: reply.authorName })"
                      class="hover:underline cursor-pointer text-[10.5px]"
                    >
                      Responder
                    </button>

                    <button
                      type="button"
                      @click="shareComment(reply)"
                      class="hover:underline cursor-pointer text-[10.5px]"
                    >
                      Compartir
                    </button>

                    <!-- Clickable Badge on Reply: Opens modal with who reacted! -->
                    <button
                      v-if="reply.likesCount > 0"
                      type="button"
                      @click="openReactionsModalFor(reply)"
                      class="ml-auto flex items-center gap-1 bg-white hover:bg-slate-50 px-1.5 py-0.5 rounded-full shadow-2xs border border-slate-200 text-[10px] text-slate-600 transition-transform active:scale-95 cursor-pointer"
                      title="Ver quién reaccionó a esta respuesta"
                    >
                      <div class="flex items-center -space-x-1">
                        <FacebookReactionIcon
                          v-for="t in getTopReactionsFor(reply)"
                          :key="t"
                          :type="t"
                          size="xs"
                          class="ring-1 ring-white rounded-full w-3 h-3"
                        />
                      </div>
                      <span class="font-bold text-slate-700 ml-0.5">{{ reply.likesCount }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Inline Thread Reply Input Box with Target Indicator and @ Autocomplete -->
            <div v-if="activeReplyCommentId === comment.id" class="pl-11 pt-1 flex flex-col gap-1.5 relative">
              <div v-if="activeReplyTarget" class="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Respondiendo a <strong class="text-blue-600">@{{ activeReplyTarget.name }}</strong></span>
                <button type="button" @click="cancelReply" class="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>

              <div class="flex items-center gap-2 relative">
                <!-- Mention Autocomplete for Reply -->
                <MentionAutocomplete
                  :isOpen="showReplyMentionAutocomplete"
                  :searchQuery="replyMentionQuery"
                  @select="selectMentionReply"
                />

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
                    :data-reply-input="comment.id"
                    type="text"
                    v-model="replyText"
                    @input="onReplyInput"
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
      </div>

      <!-- 6. Fixed Sticky Bottom Comment Composer with @ Autocomplete -->
      <div class="p-3 sm:px-4 bg-white border-t border-slate-200 z-30 relative">
        <!-- Mention Autocomplete for Main Comment -->
        <MentionAutocomplete
          :isOpen="showMentionAutocomplete"
          :searchQuery="mentionQuery"
          @select="selectMentionMain"
        />

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
              @input="onCommentInput"
              placeholder="Escribe un comentario público (usa @ para mencionar)..."
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

            <!-- Bottom icons row -->
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-2 text-slate-400">
                <button
                  type="button"
                  @click="commentText += ' 🎭'"
                  class="hover:text-slate-600 transition-colors cursor-pointer"
                  title="Stickers"
                >
                  <Smile class="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  @click="commentText += ' 🙂'"
                  class="hover:text-amber-500 transition-colors cursor-pointer"
                  title="Insertar emoji"
                >
                  <Smile class="w-4 h-4" />
                </button>

                <button
                  type="button"
                  @click="promptImageUrl"
                  class="hover:text-emerald-600 transition-colors cursor-pointer"
                  title="Adjuntar foto o imagen por URL"
                >
                  <Camera class="w-4 h-4" />
                </button>

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

      <!-- Modals (Reactions modal can show post reactions OR comment reactions) -->
      <ReactionsModal
        :post="selectedEntityForReactions || post"
        :isOpen="showReactionsModal"
        @close="showReactionsModal = false; selectedEntityForReactions = null"
      />

      <ShareModal
        :post="post"
        :isOpen="showShareModal"
        @close="showShareModal = false"
      />
    </div>
  </div>
  </Teleport>
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
  Send,
  Link,
  EyeOff,
  Flag,
  Trash2,
  BellOff
} from 'lucide-vue-next';
import { useFeedStore } from '../store/feedStore';
import { useNotificationStore } from '@/modules/notifications/store/notificationStore';
import { REACTION_CONFIGS } from '../composables/useReactions';
import FacebookReactions from './FacebookReactions.vue';
import FacebookReactionIcon from './FacebookReactionIcon.vue';
import ReactionsModal from './ReactionsModal.vue';
import ShareModal from './ShareModal.vue';
import SafeImage from '@/shared/components/SafeImage.vue';
import MentionText from './MentionText.vue';
import MentionAutocomplete from './MentionAutocomplete.vue';
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
const notificationStore = useNotificationStore();

const copiedLink = ref(false);
const isAuthor = computed(() => props.post.authorId === feedStore.currentUser.id);

function handleCopyLink() {
  const url = `${window.location.origin}/feeds?post=${props.post.id}`;
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(url);
  }
  copiedLink.value = true;
  setTimeout(() => {
    copiedLink.value = false;
  }, 2000);
}

function handleHidePost() {
  feedStore.removePost(props.post.id);
  emit('close');
}

function handleReportPost() {
  alert('Gracias por avisarnos. Hemos recibido tu reporte y nuestro equipo lo revisará.');
}

function handleDeletePost() {
  feedStore.removePost(props.post.id);
  emit('close');
}

function handleMutePost() {
  alert('Notificaciones desactivadas para esta publicación.');
}

const commentInputRef = ref(null);
const scrollContainer = ref(null);
const showReactionsPopover = ref(false);
const showReactionsModal = ref(false);
const selectedEntityForReactions = ref(null);
const showShareModal = ref(false);
const showOptionsMenu = ref(false);
const showSortMenu = ref(false);
const sortOption = ref('relevant');

const commentText = ref('');
const commentImageUrl = ref('');
const activeReplyCommentId = ref(null);
const activeReplyTarget = ref(null);
const replyText = ref('');

// Mention Autocomplete states
const showMentionAutocomplete = ref(false);
const mentionQuery = ref('');
const showReplyMentionAutocomplete = ref(false);
const replyMentionQuery = ref('');

// Comment reaction popover states
const activeCommentReactionId = ref(null);
let commentReactionTimer = null;
let popoverTimer = null;

const sortOptionLabel = computed(() => {
  if (sortOption.value === 'recent') return 'Más recientes';
  if (sortOption.value === 'all') return 'Todos los comentarios';
  return 'Más relevantes';
});

// Working filter: dynamically sorts comments based on selected filter
const sortedComments = computed(() => {
  const list = [...(props.post.comments || [])];
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

// Post level reactions popover
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

// Comment level reactions popover & handling
function hoverCommentReaction(id) {
  if (commentReactionTimer) clearTimeout(commentReactionTimer);
  activeCommentReactionId.value = id;
}

function leaveCommentReaction() {
  if (commentReactionTimer) clearTimeout(commentReactionTimer);
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

function handleCommentReaction(commentOrReplyId, reactionType) {
  feedStore.reactToComment(props.post.id, commentOrReplyId, reactionType);
  activeCommentReactionId.value = null;
}

function getCommentReactionConfig(type) {
  return type ? REACTION_CONFIGS[type] : null;
}

function getTopReactionsFor(comment) {
  if (!comment?.reactions) return ['like'];

  const activeKeys = Object.keys(comment.reactions).filter(
    (k) => (comment.reactions[k] || 0) > 0
  );
  if (activeKeys.length === 0) return ['like'];

  const result = [];

  // If the user reacted to this comment, prioritize user reaction so it appears immediately!
  if (comment.userReaction && (comment.reactions[comment.userReaction] || 0) > 0) {
    result.push(comment.userReaction);
  }

  // Fill up to 3 slots with other top reactions by count
  const sortedOthers = activeKeys
    .filter((k) => k !== comment.userReaction)
    .sort((a, b) => (comment.reactions[b] || 0) - (comment.reactions[a] || 0));

  for (const k of sortedOthers) {
    if (result.length < 3) {
      result.push(k);
    }
  }

  return result.length > 0 ? result : ['like'];
}

// Open reactions modal for a comment
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
      {
        userId: 'user_2',
        userName: 'Alejandro Morales',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        type: 'like',
      },
    ];
  }
  selectedEntityForReactions.value = entity;
  showReactionsModal.value = true;
}

// Reply to specific person
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

// Mentions autocomplete logic
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

function onReplyInput(e) {
  const val = replyText.value;
  const cursor = e.target.selectionStart || val.length;
  const beforeCursor = val.slice(0, cursor);
  const match = beforeCursor.match(/@([a-zA-Z0-9_\s]{0,20})$/);
  if (match) {
    replyMentionQuery.value = match[1];
    showReplyMentionAutocomplete.value = true;
  } else {
    showReplyMentionAutocomplete.value = false;
  }
}

function selectMentionReply(user) {
  const val = replyText.value;
  const match = val.match(/@([a-zA-Z0-9_\s]{0,20})$/);
  if (match) {
    replyText.value = val.slice(0, match.index) + `@${user.name} `;
  } else {
    replyText.value += `@${user.name} `;
  }
  showReplyMentionAutocomplete.value = false;
  notificationStore.addMentionNotification({
    senderName: feedStore.currentUser.name,
    senderAvatar: feedStore.currentUser.avatar,
    commentText: replyText.value,
  });
}

function focusCommentInput() {
  nextTick(() => {
    commentInputRef.value?.focus();
  });
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

  const text = commentText.value.trim();
  feedStore.addComment(props.post.id, text, commentImageUrl.value.trim() || null);

  // If text mentions anyone with @, dispatch in-app notification
  if (text.includes('@')) {
    notificationStore.addMentionNotification({
      senderName: feedStore.currentUser.name,
      senderAvatar: feedStore.currentUser.avatar,
      commentText: text,
    });
  }

  commentText.value = '';
  commentImageUrl.value = '';
  showMentionAutocomplete.value = false;

  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
}

function submitReply(parentId) {
  if (!replyText.value.trim()) return;

  let text = replyText.value.trim();

  // If text accidentally has duplicate target prefix (e.g. "@Elena Rostova @Elena Rostova jajaja")
  if (activeReplyTarget.value?.name) {
    const prefix = `@${activeReplyTarget.value.name}`;
    const doublePrefix = `${prefix} ${prefix}`;
    while (text.startsWith(doublePrefix)) {
      text = prefix + text.slice(doublePrefix.length);
    }
  }

  feedStore.addComment(props.post.id, text, null, parentId, activeReplyTarget.value);

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
  showReplyMentionAutocomplete.value = false;
}
</script>
