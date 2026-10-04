<template>
  <div class="w-full pb-6 sm:pb-12 animate-in fade-in duration-200">
    <!-- Toast Notification for Actions (Pokes, Friend Changes, etc.) -->
    <Teleport to="body">
      <div
        v-if="toastMessage"
        class="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150"
      >
        <Sparkles class="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{{ toastMessage }}</span>
        <button type="button" @click="toastMessage = ''" class="text-slate-400 hover:text-white p-0.5 ml-1">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </Teleport>

    <!-- Hidden File Inputs for native device upload (Own profile only) -->
    <input
      v-if="isOwnProfile"
      type="file"
      ref="mobileCoverInput"
      accept="image/*"
      class="hidden"
      @change="handleMobileCoverSelected"
    />
    <input
      v-if="isOwnProfile"
      type="file"
      ref="mobileAvatarInput"
      accept="image/*"
      class="hidden"
      @change="handleMobileAvatarSelected"
    />

    <!-- ========================================================
         1. ANDROID / MOBILE PROFILE VIEW
         ======================================================== -->
    <div class="sm:hidden bg-white min-h-screen">
      <!-- Mobile Top App Bar (Back arrow, Name, Pencil [Own only], Search, More) -->
      <div class="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
        <div class="flex items-center gap-2 min-w-0">
          <button
            type="button"
            @click="handleBack"
            class="p-1.5 -ml-1 text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft class="w-5 h-5 stroke-[2.4]" />
          </button>
          <h2 class="text-base font-bold text-slate-900 truncate">
            {{ activeProfile.name }}
          </h2>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <!-- Edit Pencil: ONLY on own profile -->
          <button
            v-if="isOwnProfile"
            type="button"
            @click="isEditProfileModalOpen = true"
            class="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Editar perfil"
          >
            <Edit3 class="w-4.5 h-4.5" />
          </button>

          <!-- Search Button -->
          <button
            type="button"
            @click="isSearchModalOpen = true"
            class="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Buscar personas"
          >
            <Search class="w-4.5 h-4.5 stroke-[2.2]" />
          </button>

          <button
            type="button"
            @click="showMoreOptions = !showMoreOptions"
            class="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Más opciones"
          >
            <MoreHorizontal class="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <!-- Cover Image Container -->
      <div class="relative h-48 w-full bg-slate-900 overflow-hidden">
        <SafeImage
          :src="activeProfile.coverImage"
          alt="Portada"
          imgClass="w-full h-full object-cover"
          containerClass="w-full h-full"
        />
        <!-- Change cover button: ONLY on own profile -->
        <button
          v-if="isOwnProfile"
          type="button"
          @click="mobileCoverInput?.click()"
          class="w-9 h-9 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-transform active:scale-95 absolute bottom-3 right-3 cursor-pointer border border-emerald-500/40 ring-1 ring-emerald-400/30"
          title="Cambiar foto de portada"
          aria-label="Cambiar foto de portada"
        >
          <Camera class="w-4.5 h-4.5 text-emerald-300" />
        </button>
      </div>

      <!-- Avatar with Animated Story Border + Camera Button -->
      <div class="px-4 pb-4">
        <div class="flex items-end justify-between -mt-16 mb-2">
          <div class="relative">
            <div
              @click="handleAvatarClick"
              class="relative w-32 h-32 rounded-full flex items-center justify-center select-none"
              :title="hasActiveStory ? 'Toca para ver la historia' : activeProfile.name"
            >
              <!-- Animated rolling ring -->
              <div v-if="hasActiveStory" class="sg-story-ring-animated" />

              <div
                :class="[
                  'relative z-10 w-full h-full rounded-full overflow-hidden bg-white shadow-xl',
                  hasActiveStory ? 'p-1.5' : 'p-1 ring-2 ring-slate-100'
                ]"
              >
                <div class="w-full h-full rounded-full overflow-hidden bg-white">
                  <SafeImage
                    :src="activeProfile.avatar"
                    :alt="activeProfile.name"
                    imgClass="w-full h-full rounded-full object-cover"
                    containerClass="w-full h-full"
                  />
                </div>
              </div>
            </div>

            <!-- Mobile Avatar Camera Button (Own Profile Only) -->
            <button
              v-if="isOwnProfile"
              type="button"
              @click.stop="mobileAvatarInput?.click()"
              class="w-9 h-9 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-transform active:scale-95 absolute bottom-1 right-1 cursor-pointer border border-emerald-500/40 ring-1 ring-emerald-400/30 z-20"
              title="Cambiar foto de perfil"
              aria-label="Cambiar foto de perfil"
            >
              <Camera class="w-4.5 h-4.5 text-emerald-300" />
            </button>
          </div>
        </div>

        <!-- Name & Friends Count stats -->
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            {{ activeProfile.name }}
          </h1>

          <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span>{{ activeProfile.friendsCount || 468 }} amigos</span>
            <template v-if="!isOwnProfile && (activeProfile.mutualCount || activeProfile.mutualInfo)">
              <span>·</span>
              <span class="text-slate-800 font-bold">{{ activeProfile.mutualCount ? `${activeProfile.mutualCount} en común` : activeProfile.mutualInfo }}</span>
            </template>
            <span>·</span>
            <span>{{ (userPosts && userPosts.length) || activeProfile?.postsCount || 55 }} publicaciones</span>
          </div>

          <!-- Mutual Friends Faces Row (Like Facebook Mobile Reference in Images 2 & 4) -->
          <div
            v-if="!isOwnProfile && mutualFriendsList && mutualFriendsList.length > 0"
            class="flex items-center gap-2 pt-1"
          >
            <div class="flex items-center -space-x-2 shrink-0">
              <img
                v-for="mf in mutualFriendsList.slice(0, 3)"
                :key="mf.id"
                :src="mf.avatar"
                :alt="mf.name"
                class="w-6 h-6 rounded-full object-cover ring-2 ring-white"
              />
            </div>
            <p class="text-[11px] text-slate-600 leading-tight">
              Amigos de <strong class="text-slate-900">{{ mutualFriendsList[0]?.name }}</strong>
              <span v-if="mutualFriendsList[1]">, <strong class="text-slate-900">{{ mutualFriendsList[1]?.name }}</strong></span>
              <span> y {{ activeProfile.mutualCount ? activeProfile.mutualCount - 2 : 'más personas' }}</span>
            </p>
          </div>
        </div>

        <!-- Action buttons row: DUAL RENDER (Own Profile vs Other's Profile) -->
        <div class="pt-3.5 flex items-center gap-2">
          <!-- 1. OWN PROFILE BUTTONS -->
          <template v-if="isOwnProfile">
            <button
              type="button"
              @click="isCreateStoryModalOpen = true"
              class="flex-1 py-2 px-3.5 rounded-md bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus class="w-4 h-4 stroke-[2.4]" />
              <span>Agregar a historia</span>
            </button>

            <button
              type="button"
              @click="isEditProfileModalOpen = true"
              class="flex-1 py-2 px-3.5 rounded-md bg-slate-200 hover:bg-slate-300 active:scale-98 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 class="w-4 h-4 text-slate-600" />
              <span>Editar perfil</span>
            </button>
          </template>

          <!-- 2. OTHER PERSON'S PROFILE BUTTONS (Facebook Style in Images 2 & 4) -->
          <template v-else>
            <!-- Friend status: Already Friend -->
            <template v-if="activeProfile.isFriend !== false">
              <button
                type="button"
                @click="isFriendOptionsSheetOpen = true"
                class="flex-1 py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <UserCheck class="w-4 h-4 text-emerald-700" />
                <span>Amigos</span>
              </button>

              <button
                type="button"
                @click="openChat(activeProfile)"
                class="flex-1 py-2 px-3 rounded-md bg-[#1877f2] hover:bg-[#166fe5] active:scale-98 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle class="w-4 h-4" />
                <span>Mensaje</span>
              </button>

              <button
                type="button"
                @click="sendPoke(activeProfile)"
                class="p-2 rounded-md bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                title="Dar un toque"
              >
                <Zap class="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
              </button>
            </template>

            <!-- Friend status: Not Friend Yet -->
            <template v-else>
              <button
                type="button"
                @click="handleAddFriend(activeProfile)"
                class="flex-1 py-2 px-3 rounded-md bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus class="w-4 h-4" />
                <span>Agregar a amigos</span>
              </button>

              <button
                type="button"
                @click="openChat(activeProfile)"
                class="flex-1 py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <MessageCircle class="w-4 h-4" />
                <span>Mensaje</span>
              </button>

              <button
                type="button"
                @click="sendPoke(activeProfile)"
                class="p-2 rounded-md bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                title="Dar un toque"
              >
                <Zap class="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
              </button>
            </template>
          </template>
        </div>

        <!-- Profile Tabs Mobile -->
        <div class="flex items-center gap-2 border-b border-slate-200 mt-4 text-xs font-bold">
          <button
            type="button"
            @click="activeTab = 'posts'"
            :class="[
              'pb-2.5 px-3 transition-colors cursor-pointer relative',
              activeTab === 'posts' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
            ]"
          >
            <span>Todo</span>
            <span v-if="activeTab === 'posts'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />
          </button>

          <button
            type="button"
            @click="activeTab = 'about'"
            :class="[
              'pb-2.5 px-3 transition-colors cursor-pointer relative',
              activeTab === 'about' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
            ]"
          >
            <span>Información</span>
            <span v-if="activeTab === 'about'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />
          </button>

          <button
            type="button"
            @click="activeTab = 'friends'"
            :class="[
              'pb-2.5 px-3 transition-colors cursor-pointer relative',
              activeTab === 'friends' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
            ]"
          >
            <span>Amigos</span>
            <span v-if="activeTab === 'friends'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />
          </button>

          <button
            type="button"
            @click="activeTab = 'photos'"
            :class="[
              'pb-2.5 px-3 transition-colors cursor-pointer relative',
              activeTab === 'photos' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
            ]"
          >
            <span>Fotos</span>
            <span v-if="activeTab === 'photos'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />
          </button>
        </div>

        <!-- Mobile Posts Tab Body -->
        <div v-if="activeTab === 'posts'" class="space-y-4">
          <!-- SECTION 1: DATOS PERSONALES CARD -->
          <div class="pt-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-extrabold text-slate-900 font-display">
                Datos personales
              </h3>
              <!-- Edit pencil: ONLY on own profile -->
              <button
                v-if="isOwnProfile"
                type="button"
                @click="isEditProfileModalOpen = true"
                class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <Edit3 class="w-4 h-4" />
              </button>
            </div>

            <div class="space-y-2.5 text-xs text-slate-700">
              <div class="flex items-center gap-3">
                <MapPin class="w-4.5 h-4.5 text-slate-500 shrink-0" />
                <span>Vive en <strong class="text-slate-900">{{ activeProfile.location || 'Colombia' }}</strong></span>
              </div>

              <div class="flex items-center gap-3">
                <Home class="w-4.5 h-4.5 text-slate-500 shrink-0" />
                <span>De <strong class="text-slate-900">{{ activeProfile.hometown || 'Colombia' }}</strong></span>
              </div>

              <div class="flex items-center gap-3">
                <Gift class="w-4.5 h-4.5 text-slate-500 shrink-0" />
                <span><strong class="text-slate-900">{{ activeProfile.birthday || '26 de diciembre' }}</strong></span>
              </div>
            </div>
          </div>

          <!-- SECTION 2: EMPLEO CARD -->
          <div class="pt-4 border-t border-slate-100 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-extrabold text-slate-900 font-display">
                Empleo
              </h3>
              <!-- Edit pencil: ONLY on own profile -->
              <button
                v-if="isOwnProfile"
                type="button"
                @click="isEditProfileModalOpen = true"
                class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <Edit3 class="w-4 h-4" />
              </button>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-900 shrink-0 mt-0.5">
                <SafeImage
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80"
                  alt="Empresa"
                  imgClass="w-full h-full object-cover"
                  containerClass="w-full h-full"
                />
              </div>
              <div class="space-y-0.5">
                <h4 class="text-xs font-bold text-slate-900 leading-snug">
                  {{ activeProfile.work || 'Profesional en Socialgea' }}
                </h4>
                <p class="text-xs text-slate-500">{{ activeProfile.workRole || 'Especialista' }}</p>
                <p class="text-xs text-slate-400">
                  {{ activeProfile.workDuration || 'Desde 2022 hasta la fecha' }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="activeTab = 'about'"
              class="text-xs text-slate-500 hover:text-emerald-800 font-semibold block pt-1 cursor-pointer"
            >
              Ver más sobre empleo
            </button>
          </div>

          <!-- SECTION 3: AMIGOS SECTION -->
          <div class="pt-4 border-t border-slate-100 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-extrabold text-slate-900 font-display">
                  Amigos
                </h3>
                <p class="text-xs text-slate-400 font-semibold">
                  {{ activeProfile?.friendsCount || (currentProfileFriends && currentProfileFriends.length) || 0 }} amigos
                </p>
              </div>
              <button
                type="button"
                @click="isFriendsModalOpen = true"
                class="text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
              >
                Ver todo
              </button>
            </div>

            <div class="grid grid-cols-4 gap-2 text-center">
              <div
                v-for="friend in currentProfileFriends.slice(0, 4)"
                :key="friend.id"
                class="flex flex-col items-center space-y-1 cursor-pointer group"
                @click="goToFriendProfile(friend.id)"
              >
                <div class="w-14 h-14 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0 group-hover:ring-emerald-600 transition-all">
                  <SafeImage
                    :src="friend.avatar"
                    :alt="friend.name"
                    imgClass="w-full h-full object-cover"
                    containerClass="w-full h-full"
                  />
                </div>
                <span class="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                  {{ friend.name }}
                </span>
                <span class="text-xs text-slate-400 leading-tight line-clamp-1">
                  {{ friend.mutualInfo }}
                </span>
              </div>
            </div>
          </div>

          <!-- SECTION 4: PUBLICACIONES SECTION (Matching Image 4) -->
          <div class="pt-5 border-t border-slate-200 space-y-3">
            <h3 class="text-sm font-extrabold text-slate-900 font-display">
              Publicaciones
            </h3>

            <!-- Mini Composer Card -->
            <div class="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-2.5">
              <div class="flex items-center gap-2.5">
                <SafeImage
                  :src="feedStore.currentUser.avatar"
                  :alt="feedStore.currentUser.name"
                  imgClass="w-9 h-9 rounded-full object-cover"
                  containerClass="w-9 h-9 rounded-full shrink-0"
                />
                <button
                  type="button"
                  @click="isComposerOpen = true"
                  class="flex-1 bg-white hover:bg-slate-100 text-slate-500 text-left text-xs px-3.5 py-2 rounded-md border border-slate-200 transition-colors cursor-pointer truncate"
                >
                  {{ isOwnProfile ? `¿Qué estás pensando, ${feedStore.currentUser.name.split(' ')[0]}?` : `Escribe en el perfil de ${activeProfile.name}` }}
                </button>
              </div>

              <div class="flex items-center justify-around border-t border-slate-200/80 pt-2 text-xs font-semibold text-slate-600">
                <button type="button" @click="isComposerOpen = true" class="flex items-center gap-1.5 hover:text-emerald-800 cursor-pointer">
                  <ImageIcon class="w-4 h-4 text-emerald-700" />
                  <span>Foto</span>
                </button>
                <button type="button" @click="isComposerOpen = true" class="flex items-center gap-1.5 hover:text-rose-700 cursor-pointer">
                  <MapPin class="w-4 h-4 text-rose-500" />
                  <span>Estoy aquí</span>
                </button>
                <button type="button" @click="isComposerOpen = true" class="flex items-center gap-1.5 hover:text-indigo-700 cursor-pointer">
                  <Flag class="w-4 h-4 text-indigo-500" />
                  <span>Acontecimiento</span>
                </button>
              </div>
            </div>

            <!-- User's Posts list -->
            <div class="space-y-4 pt-1">
              <div
                v-if="!userPosts || userPosts.length === 0"
                class="bg-white rounded-md p-8 text-center text-slate-400 border border-slate-200 space-y-2"
              >
                <FileText class="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                <p class="text-xs sm:text-sm font-semibold">No hay publicaciones en este perfil aún.</p>
              </div>

              <PostCard
                v-for="post in userPosts"
                :key="post.id"
                :post="post"
              />
            </div>
          </div>
        </div>

        <!-- Mobile Info Tab -->
        <div v-else-if="activeTab === 'about'" class="pt-4">
          <ProfileInfo :user="activeProfile" @edit-profile="isEditProfileModalOpen = true" />
        </div>

        <!-- Mobile Friends Tab -->
        <div v-else-if="activeTab === 'friends'" class="pt-4">
          <ProfileFriendsTab
            :friends="currentProfileFriends"
            @go-to-profile="goToFriendProfile"
            @remove-friend="handleFriendRemoved"
          />
        </div>

        <!-- Mobile Photos Tab -->
        <div v-else-if="activeTab === 'photos'" class="pt-4">
          <ProfilePhotos :photos="userPhotos" />
        </div>
      </div>
    </div>

    <!-- ========================================================
         2. DESKTOP PROFILE VIEW (RESPONSIVE 2-COLUMN LAYOUT)
         ======================================================== -->
    <div class="hidden sm:block w-full max-w-5xl xl:max-w-6xl mx-auto space-y-5 px-3 sm:px-4">
      <!-- Profile Header (Cover, Circular Avatar, Name, Meta, DUAL Buttons, Tabs) -->
      <ProfileHeader
        :user="activeProfile"
        :activeTab="activeTab"
        :postsCount="userPosts ? userPosts.length : 0"
        :photosCount="userPhotos ? userPhotos.length : 0"
        @select-tab="activeTab = $event"
        @open-chat="openChat"
        @create-story="isCreateStoryModalOpen = true"
        @edit-profile="isEditProfileModalOpen = true"
        @open-friend-options="isFriendOptionsSheetOpen = true"
        @add-friend="handleAddFriend"
        @send-poke="sendPoke"
      />

      <!-- TAB 1: TODO / POSTS (RESPONSIVE 2-COLUMN LAYOUT) -->
      <div v-if="activeTab === 'posts'" class="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-start">
        <!-- LEFT COLUMN: Datos personales, Empleo, Amigos, Fotos -->
        <div class="md:col-span-5 space-y-4">
          <!-- CARD 1: DATOS PERSONALES -->
          <div class="bg-white rounded-md p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-extrabold text-slate-900 text-base sm:text-lg font-display">
                Datos personales
              </h3>
              <!-- Edit pencil: ONLY on own profile -->
              <button
                v-if="isOwnProfile"
                type="button"
                @click="isEditProfileModalOpen = true"
                class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                title="Editar datos personales"
              >
                <Edit3 class="w-4 h-4" />
              </button>
            </div>

            <div class="space-y-3.5 text-sm text-slate-700">
              <div class="flex items-center gap-3.5">
                <MapPin class="w-5 h-5 text-slate-400 shrink-0" />
                <span>Vive en <strong class="text-slate-900">{{ activeProfile.location || 'Colombia' }}</strong></span>
              </div>

              <div class="flex items-center gap-3.5">
                <Home class="w-5 h-5 text-slate-400 shrink-0" />
                <span>De <strong class="text-slate-900">{{ activeProfile.hometown || 'Colombia' }}</strong></span>
              </div>

              <div class="flex items-center gap-3.5">
                <Gift class="w-5 h-5 text-slate-400 shrink-0" />
                <span><strong class="text-slate-900">{{ activeProfile.birthday || '26 de diciembre' }}</strong></span>
              </div>
            </div>
          </div>

          <!-- CARD 2: EMPLEO -->
          <div class="bg-white rounded-md p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-extrabold text-slate-900 text-base sm:text-lg font-display">
                Empleo
              </h3>
              <!-- Edit pencil: ONLY on own profile -->
              <button
                v-if="isOwnProfile"
                type="button"
                @click="isEditProfileModalOpen = true"
                class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                title="Editar empleo"
              >
                <Edit3 class="w-4 h-4" />
              </button>
            </div>

            <div class="flex items-start gap-3.5">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-slate-900 shrink-0 mt-0.5">
                <SafeImage
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80"
                  alt="Empresa"
                  imgClass="w-full h-full object-cover"
                  containerClass="w-full h-full"
                />
              </div>
              <div class="space-y-0.5">
                <h4 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {{ activeProfile.work || 'Profesional en Socialgea' }}
                </h4>
                <p class="text-xs sm:text-sm text-slate-600 font-semibold">{{ activeProfile.workRole || 'Especialista' }}</p>
                <p class="text-xs text-slate-400">
                  {{ activeProfile.workDuration || 'Desde 2022 hasta la fecha' }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="activeTab = 'about'"
              class="text-xs sm:text-sm text-slate-600 hover:text-emerald-800 font-bold block pt-1 cursor-pointer"
            >
              Ver más sobre empleo
            </button>
          </div>

          <!-- CARD 3: AMIGOS (GRID WITH CURRENT PROFILE'S FRIENDS) -->
          <div class="bg-white rounded-md p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="font-extrabold text-slate-900 text-base sm:text-lg font-display">
                  Amigos
                </h3>
                <p class="text-xs text-slate-400 font-semibold">
                  {{ activeProfile?.friendsCount || (currentProfileFriends && currentProfileFriends.length) || 0 }} amigos
                </p>
              </div>
              <button
                type="button"
                @click="activeTab = 'friends'"
                class="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
              >
                Ver todos los amigos
              </button>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="friend in currentProfileFriends.slice(0, 6)"
                :key="friend.id"
                class="space-y-1.5 cursor-pointer group"
                @click="goToFriendProfile(friend.id)"
              >
                <div class="aspect-square rounded-md overflow-hidden bg-slate-100 ring-1 ring-slate-200/80 group-hover:ring-emerald-600 transition-all">
                  <SafeImage
                    :src="friend.avatar"
                    :alt="friend.name"
                    imgClass="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    containerClass="w-full h-full"
                  />
                </div>
                <p class="text-xs font-bold text-slate-800 group-hover:text-emerald-800 truncate transition-colors leading-tight">
                  {{ friend.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- CARD 4: FOTOS (THUMBNAILS) -->
          <div v-if="userPhotos && userPhotos.length > 0" class="bg-white rounded-md p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="font-extrabold text-slate-900 text-base sm:text-lg font-display">
                  Fotos
                </h3>
                <p class="text-xs text-slate-400 font-semibold">
                  {{ userPhotos ? userPhotos.length : 0 }} fotos
                </p>
              </div>
              <button
                type="button"
                @click="activeTab = 'photos'"
                class="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
              >
                Ver todas las fotos
              </button>
            </div>

            <div class="grid grid-cols-3 gap-2.5">
              <div
                v-for="(photo, idx) in userPhotos.slice(0, 6)"
                :key="idx"
                class="aspect-square rounded-md overflow-hidden bg-slate-100 ring-1 ring-slate-200/80"
              >
                <SafeImage
                  :src="photo"
                  :alt="`Foto ${idx + 1}`"
                  imgClass="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  containerClass="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: POST COMPOSER & FEED -->
        <div class="md:col-span-7 space-y-4">
          <!-- Desktop Post Composer Trigger Card -->
          <div class="bg-white rounded-md p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5">
            <div class="flex items-center gap-3">
              <SafeImage
                :src="feedStore.currentUser.avatar"
                :alt="feedStore.currentUser.name"
                imgClass="w-10 h-10 rounded-full object-cover"
                containerClass="w-10 h-10 rounded-full shrink-0"
              />
              <button
                type="button"
                @click="isComposerOpen = true"
                class="flex-1 bg-slate-100 hover:bg-slate-200/70 text-slate-500 text-left text-xs sm:text-sm px-4 py-2.5 rounded-full transition-colors cursor-pointer truncate"
              >
                {{ isOwnProfile ? `¿Qué estás pensando, ${feedStore.currentUser.name.split(' ')[0]}?` : `Escribe en el perfil de ${activeProfile.name}` }}
              </button>
            </div>

            <div class="flex items-center justify-around border-t border-slate-100 pt-3 text-xs sm:text-sm font-bold text-slate-700">
              <button
                type="button"
                @click="isComposerOpen = true"
                class="flex items-center gap-2 hover:text-rose-600 py-1.5 px-3 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Video class="w-5 h-5 text-rose-500" />
                <span>Video en vivo</span>
              </button>

              <button
                type="button"
                @click="isComposerOpen = true"
                class="flex items-center gap-2 hover:text-emerald-700 py-1.5 px-3 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ImageIcon class="w-5 h-5 text-emerald-600" />
                <span>Foto/video</span>
              </button>

              <button
                type="button"
                @click="isComposerOpen = true"
                class="flex items-center gap-2 hover:text-indigo-600 py-1.5 px-3 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Flag class="w-5 h-5 text-indigo-500" />
                <span>Novedad personal</span>
              </button>
            </div>
          </div>

          <!-- User Posts List -->
          <div class="space-y-4">
            <div
              v-if="!userPosts || userPosts.length === 0"
              class="bg-white rounded-md p-12 text-center text-slate-400 border border-slate-200 shadow-xs space-y-2"
            >
              <FileText class="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p class="text-sm font-semibold">No hay publicaciones en este perfil aún.</p>
            </div>

            <PostCard
              v-for="post in userPosts"
              :key="post.id"
              :post="post"
            />
          </div>
        </div>
      </div>

      <!-- TAB 2: INFORMACIÓN -->
      <ProfileInfo
        v-else-if="activeTab === 'about'"
        :user="activeProfile"
        @edit-profile="isEditProfileModalOpen = true"
      />

      <!-- TAB 3: AMIGOS -->
      <ProfileFriendsTab
        v-else-if="activeTab === 'friends'"
        :friends="currentProfileFriends"
        @go-to-profile="goToFriendProfile"
        @remove-friend="handleFriendRemoved"
      />

      <!-- TAB 4: FOTOS -->
      <ProfilePhotos
        v-else-if="activeTab === 'photos'"
        :photos="userPhotos"
      />
    </div>

    <!-- ========================================================
         3. POST COMPOSER MODAL
         ======================================================== -->
    <PostComposer
      :isOpen="isComposerOpen"
      @close="isComposerOpen = false"
    />

    <!-- ========================================================
         4. EDIT PROFILE MODAL
         ======================================================== -->
    <EditProfileModal
      v-model="isEditProfileModalOpen"
      :user="activeProfile"
      @save="handleSaveProfile"
    />

    <!-- ========================================================
         5. ANDROID SEARCH MODAL
         ======================================================== -->
    <MobileSearchModal
      :isOpen="isSearchModalOpen"
      @close="isSearchModalOpen = false"
    />

    <!-- ========================================================
         6. ANDROID ALL FRIENDS FULL-SCREEN MODAL
         ======================================================== -->
    <MobileFriendsModal
      :isOpen="isFriendsModalOpen"
      :friends="currentProfileFriends"
      @close="isFriendsModalOpen = false"
    />

    <!-- ========================================================
         7. FRIEND OPTIONS BOTTOM SHEET (FOR "AMIGOS" BUTTON)
         ======================================================== -->
    <FriendOptionsSheet
      :isOpen="isFriendOptionsSheetOpen"
      :user="activeProfile"
      @close="isFriendOptionsSheetOpen = false"
      @remove-friend="handleFriendRemoved"
    />

    <!-- ========================================================
         8. CREATE STORY MODAL (Directly from Profile)
         ======================================================== -->
    <CreateStoryModal
      :isOpen="isCreateStoryModalOpen"
      @close="isCreateStoryModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeft,
  Search,
  Edit3,
  MoreHorizontal,
  Camera,
  MapPin,
  Home,
  Plus,
  Image as ImageIcon,
  Flag,
  Gift,
  Video,
  FileText,
  UserCheck,
  UserPlus,
  MessageCircle,
  Zap,
  Sparkles,
  X
} from 'lucide-vue-next';
import { useProfile } from '../composables/useProfile';
import { useFeedStore } from '@/context/social/pages/feed/store/feedStore';
import { useMessengerStore } from '@/context/social/pages/messenger/store/messengerStore';
import { useHistoryStore } from '@/context/social/pages/historys/store/historyStore';
import { getPreviousNonProfileRoute, popProfileRoute } from '@/router';
import { MOCK_USERS } from '@/shared/data/initialData';
import ProfileHeader from '../components/ProfileHeader.vue';
import ProfilePhotos from '../components/ProfilePhotos.vue';
import ProfileInfo from '../components/ProfileInfo.vue';
import ProfileFriendsTab from '../components/ProfileFriendsTab.vue';
import EditProfileModal from '../components/EditProfileModal.vue';
import FriendOptionsSheet from '../components/FriendOptionsSheet.vue';
import PostCard from '@/context/social/pages/feed/components/PostCard.vue';
import PostComposer from '@/context/social/pages/feed/components/PostComposer.vue';
import MobileSearchModal from '@/shared/components/MobileSearchModal.vue';
import MobileFriendsModal from '../components/MobileFriendsModal.vue';
import CreateStoryModal from '@/context/social/pages/historys/components/CreateStoryModal.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const route = useRoute();
const router = useRouter();
const { activeProfile, activeTab, loadProfile } = useProfile();
const feedStore = useFeedStore();
const messengerStore = useMessengerStore();
const historyStore = useHistoryStore();

const mobileCoverInput = ref(null);
const mobileAvatarInput = ref(null);

const isComposerOpen = ref(false);
const isEditProfileModalOpen = ref(false);
const isSearchModalOpen = ref(false);
const isFriendsModalOpen = ref(false);
const isFriendOptionsSheetOpen = ref(false);
const isCreateStoryModalOpen = ref(false);
const showMoreOptions = ref(false);
const toastMessage = ref('');

const isOwnProfile = computed(() => {
  const currentId = feedStore.currentUser.id;
  return !route.params.id || route.params.id === currentId || route.params.id === 'user_current';
});

const hasActiveStory = computed(() => {
  return historyStore.hasStoryForUser(activeProfile.value?.id);
});

function handleAvatarClick() {
  if (hasActiveStory.value) {
    historyStore.openStoryForUser(activeProfile.value.id);
  } else if (isOwnProfile.value) {
    mobileAvatarInput.value?.click();
  }
}

function handleMobileCoverSelected(event) {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      activeProfile.value.coverImage = dataUrl;
      if (isOwnProfile.value) {
        feedStore.currentUser.coverImage = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  }
}

function handleMobileAvatarSelected(event) {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      activeProfile.value.avatar = dataUrl;
      if (isOwnProfile.value) {
        feedStore.currentUser.avatar = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  }
}

onMounted(() => {
  feedStore.loadPosts();
  loadProfile(route.params.id);
});

watch(
  () => route.params.id,
  (newId) => {
    loadProfile(newId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
);

const userPosts = computed(() => {
  return feedStore.posts.filter((p) => p.authorId === activeProfile.value?.id);
});

const userPhotos = computed(() => {
  return userPosts.value.flatMap((p) => p.images || []);
});

// Profile-specific friends list (changes dynamically depending on whose profile is being viewed)
const currentProfileFriends = computed(() => {
  const profId = activeProfile.value?.id;
  if (!profId || profId === 'user_current') {
    return MOCK_USERS.filter((u) => u.id !== 'user_current');
  }
  // If viewing a friend, return the community mock users excluding themselves
  return MOCK_USERS.filter((u) => u.id !== profId);
});

const mutualFriendsList = computed(() => {
  if (activeProfile.value?.mutualFriends && activeProfile.value.mutualFriends.length > 0) {
    return activeProfile.value.mutualFriends;
  }
  return MOCK_USERS.slice(0, 3);
});

function handleBack() {
  // 1. If viewing own profile, clicking back should ALWAYS exit out to the Feed or originating section
  if (isOwnProfile.value) {
    const target = getPreviousNonProfileRoute();
    router.push(target);
    return;
  }

  // 2. If viewing a friend's profile:
  // If the user came from another profile, pop to that profile; otherwise return to the non-profile route (Feed, Amigos, etc.)
  const target = popProfileRoute();
  if (target && target !== route.fullPath) {
    router.push(target);
  } else {
    router.push(getPreviousNonProfileRoute());
  }
}

function goToFriendProfile(friendId) {
  router.push(`/profiles/${friendId}`);
}

function openChat(user) {
  messengerStore.openWithUser(user);
}

function sendPoke(user) {
  toastMessage.value = `👉 ¡Le has enviado un toque a ${user.name}!`;
  setTimeout(() => {
    if (toastMessage.value.includes('toque')) {
      toastMessage.value = '';
    }
  }, 3500);
}

function handleAddFriend(user) {
  activeProfile.value.isFriend = true;
  toastMessage.value = `¡Has enviado una solicitud de amistad a ${user.name}!`;
  setTimeout(() => {
    if (toastMessage.value.includes('solicitud')) {
      toastMessage.value = '';
    }
  }, 3500);
}

function handleFriendRemoved(friendId) {
  activeProfile.value.isFriend = false;
  toastMessage.value = `Has eliminado a ${activeProfile.value.name} de tus amigos.`;
  setTimeout(() => {
    if (toastMessage.value.includes('eliminado')) {
      toastMessage.value = '';
    }
  }, 3500);
}

function handleSaveProfile(updatedData) {
  Object.assign(activeProfile.value, updatedData);
  if (isOwnProfile.value) {
    Object.assign(feedStore.currentUser, updatedData);
  }
}
</script>
