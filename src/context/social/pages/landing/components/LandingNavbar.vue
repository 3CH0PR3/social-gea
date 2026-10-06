<template>
  <header class="sg-landing-nav">
    <div class="sg-landing-container">
      <div class="sg-landing-nav__inner">
        <!-- Brand Logo -->
        <RouterLink to="/landing" class="flex items-center gap-2 sm:gap-2.5 text-decoration-none group shrink-0">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-sm sm:text-base tracking-tighter">
            sg
          </div>
          <div class="flex flex-col">
            <span class="font-black text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
              socialgea
            </span>
            <span class="hidden sm:inline-block text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              Colombia 🇨🇴
            </span>
          </div>
        </RouterLink>

        <!-- Navigation Links (Desktop >= 1024px) -->
        <nav class="sg-landing-nav__links">
          <a href="#simulador" class="sg-landing-nav__link">Simulador</a>
          <a href="#territorio" class="sg-landing-nav__link">Empresas</a>
          <a href="#premios" class="sg-landing-nav__link">Premios</a>
          <a href="#eventos" class="sg-landing-nav__link">Eventos</a>
          <a href="#comunidad" class="sg-landing-nav__link">Comunidad</a>
          <a href="#faq" class="sg-landing-nav__link">Preguntas</a>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-1.5 sm:gap-2.5">
          <!-- Feed shortcut (Visible on tablet & desktop) -->
          <RouterLink
            to="/feeds"
            class="hidden md:inline-flex sg-landing-btn sg-landing-btn--secondary sg-landing-btn--sm"
            title="Ir a la red social activa"
          >
            <Compass class="w-4 h-4 text-emerald-700" />
            <span>Feed</span>
          </RouterLink>

          <!-- Iniciar sesión (Hidden on small mobile) -->
          <RouterLink
            to="/auth/login"
            class="hidden sm:inline-flex sg-landing-btn sg-landing-btn--secondary"
          >
            Iniciar sesión
          </RouterLink>

          <!-- Registrarme (Visible on all sizes, compact on mobile) -->
          <RouterLink
            to="/auth/register"
            class="sg-landing-btn sg-landing-btn--primary"
          >
            <UserPlus class="w-4 h-4" />
            <span class="hidden xs:inline">Registrarme</span>
            <span class="xs:hidden">Registro</span>
          </RouterLink>

          <!-- Hamburger Toggle Button (< 1024px: Android and Tablet) -->
          <button
            type="button"
            @click="isMobileMenuOpen = true"
            class="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer ml-1"
            aria-label="Abrir menú de navegación"
            title="Menú"
          >
            <Menu class="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================
         MOBILE / TABLET MENU DRAWER (DUAL ANDROID / TABLET COMPLIANT)
         En < 640px: Pantalla completa nativa 100dvh con Top App Bar.
         En >= 640px: Panel lateral limpio sobre fondo desenfocado.
         ======================================================== -->
    <Teleport to="body">
      <Transition name="sg-drawer-fade">
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-[9999] flex flex-col bg-white overflow-hidden sm:bg-black/60 sm:backdrop-blur-xs sm:items-end"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          @click.self="isMobileMenuOpen = false"
        >
          <!-- Drawer Container -->
          <div class="w-full h-[100dvh] sm:max-w-sm bg-white flex flex-col overflow-hidden sm:shadow-xl sm:border-l sm:border-slate-200">
            <!-- Top App Bar -->
            <header class="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white shrink-0">
              <button
                type="button"
                @click="isMobileMenuOpen = false"
                class="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer -ml-1"
                aria-label="Cerrar menú"
              >
                <ArrowLeft class="w-5 h-5" />
              </button>

              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                  sg
                </div>
                <h3 class="text-sm font-bold text-slate-900 tracking-tight">
                  Menú Socialgea
                </h3>
              </div>

              <button
                type="button"
                @click="isMobileMenuOpen = false"
                class="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer -mr-1"
                aria-label="Cerrar menú"
              >
                <X class="w-5 h-5" />
              </button>
            </header>

            <!-- Scrollable Content (Single scroll) -->
            <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4">
              <!-- Section Navigation Links -->
              <div class="space-y-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Secciones de la página
                </span>

                <a
                  href="#simulador"
                  @click="navigateToSection"
                  class="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-50 transition-colors text-slate-800 group"
                >
                  <div class="w-7 h-7 rounded-md bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-100">
                    <Calculator class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 leading-tight">Simulador de EcoPuntos</h4>
                    <span class="text-[11px] text-slate-500">Calcula cuánto ganas con tu reciclaje</span>
                  </div>
                </a>

                <a
                  href="#territorio"
                  @click="navigateToSection"
                  class="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-50 transition-colors text-slate-800 group"
                >
                  <div class="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-100">
                    <MapPin class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 leading-tight">Empresas por Municipio</h4>
                    <span class="text-[11px] text-slate-500">Paso obligatorio: afíliate a tu centro de acopio</span>
                  </div>
                </a>

                <a
                  href="#premios"
                  @click="navigateToSection"
                  class="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-50 transition-colors text-slate-800 group"
                >
                  <div class="w-7 h-7 rounded-md bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-100">
                    <Gift class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 leading-tight">Catálogo de Premios</h4>
                    <span class="text-[11px] text-slate-500">Electrodomésticos, tecnología y hogar</span>
                  </div>
                </a>

                <a
                  href="#eventos"
                  @click="navigateToSection"
                  class="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-50 transition-colors text-slate-800 group"
                >
                  <div class="w-7 h-7 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-100">
                    <Calendar class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 leading-tight">Eventos & Retos 2X y 3X</h4>
                    <span class="text-[11px] text-slate-500">Reciclatones masivas de empresas aliadas</span>
                  </div>
                </a>

                <a
                  href="#comunidad"
                  @click="navigateToSection"
                  class="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-50 transition-colors text-slate-800 group"
                >
                  <div class="w-7 h-7 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100">
                    <Users class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 leading-tight">La Red Social</h4>
                    <span class="text-[11px] text-slate-500">Muro comunitario, historias 24h y amigos</span>
                  </div>
                </a>

                <a
                  href="#faq"
                  @click="navigateToSection"
                  class="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-50 transition-colors text-slate-800 group"
                >
                  <div class="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200">
                    <HelpCircle class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 leading-tight">Preguntas Frecuentes</h4>
                    <span class="text-[11px] text-slate-500">Todo sobre puntos, pesajes y envíos</span>
                  </div>
                </a>
              </div>

              <!-- Quick direct app links -->
              <div class="pt-3 border-t border-slate-100 space-y-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Accesos a la Plataforma
                </span>

                <RouterLink
                  to="/feeds"
                  @click="isMobileMenuOpen = false"
                  class="flex items-center justify-between p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  <span class="flex items-center gap-2">
                    <Compass class="w-4 h-4 text-emerald-700" />
                    <span>Entrar al Muro Social (Feed)</span>
                  </span>
                  <span class="text-[10px] text-emerald-700 font-semibold">En vivo →</span>
                </RouterLink>

                <a
                  href="#premios"
                  @click="navigateToSection"
                  class="flex items-center justify-between p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  <span class="flex items-center gap-2">
                    <Store class="w-4 h-4 text-amber-700" />
                    <span>Catálogo de Premios</span>
                  </span>
                  <span class="text-xs text-amber-700 font-semibold">14 premios →</span>
                </a>
              </div>
            </div>

            <!-- Fixed Bottom Actions Bar with Safe Area -->
            <footer class="p-3 border-t border-slate-200 bg-white space-y-2 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <RouterLink
                to="/auth/register"
                @click="isMobileMenuOpen = false"
                class="sg-landing-btn sg-landing-btn--primary sg-landing-btn--block"
              >
                <UserPlus class="w-4 h-4" />
                <span>Crear cuenta gratis</span>
              </RouterLink>

              <RouterLink
                to="/auth/login"
                @click="isMobileMenuOpen = false"
                class="sg-landing-btn sg-landing-btn--secondary sg-landing-btn--block"
              >
                <span>Ya tengo cuenta · Iniciar sesión</span>
              </RouterLink>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Compass,
  UserPlus,
  Menu,
  X,
  ArrowLeft,
  Calculator,
  MapPin,
  Gift,
  Calendar,
  Users,
  HelpCircle,
  Store
} from 'lucide-vue-next';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const isMobileMenuOpen = ref(false);

useBodyScrollLock(isMobileMenuOpen);

function navigateToSection() {
  isMobileMenuOpen.value = false;
}
</script>

<style scoped>
.sg-drawer-fade-enter-active,
.sg-drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sg-drawer-fade-enter-from,
.sg-drawer-fade-leave-to {
  opacity: 0;
}
</style>
