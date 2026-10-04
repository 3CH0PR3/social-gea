<template>
  <div class="min-h-screen w-full bg-white text-slate-800 flex flex-col lg:flex-row antialiased selection:bg-emerald-600 selection:text-white">
    <!-- Left Column: Form Stage (Clean Light Theme) -->
    <div class="w-full lg:w-1/2 xl:w-5/12 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10 overflow-y-auto bg-white border-r border-slate-100">
      <!-- Top Brand Header -->
      <header class="flex items-center justify-between pb-6">
        <RouterLink
          to="/auth/login"
          class="flex items-center gap-2.5 text-slate-900 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div class="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black shadow-md shadow-emerald-700/20">
            <Leaf class="w-5 h-5 text-white stroke-[2.4]" />
          </div>
          <span class="text-xl font-black font-display tracking-tight text-slate-900">
            GEA<span class="text-emerald-700 font-bold">-social</span>
          </span>
        </RouterLink>

        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Colombia</span>
        </span>
      </header>

      <!-- Center Form Stage with instant snappy transition -->
      <main class="my-auto py-4">
        <RouterView v-slot="{ Component }">
          <Transition name="auth-quick" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>

      <!-- Footer Security / Legal Notice -->
      <footer class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© 2026 GEAWRC · Socialgea Colombia</p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-slate-800 transition-colors">Privacidad</a>
          <span class="text-slate-300">·</span>
          <a href="#" class="hover:text-slate-800 transition-colors">Términos</a>
          <span class="text-slate-300">·</span>
          <a href="#" class="hover:text-slate-800 transition-colors">Soporte</a>
        </div>
      </footer>
    </div>

    <!-- Right Column: Visual Hero Banner with Slides & Fast Transitions -->
    <div class="hidden lg:block lg:w-1/2 xl:w-7/12 relative">
      <AuthHeroBanner />
    </div>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { Leaf } from 'lucide-vue-next';
import AuthHeroBanner from '@/modules/auth/components/AuthHeroBanner.vue';
</script>

<style scoped>
.auth-quick-enter-active,
.auth-quick-leave-active {
  transition: opacity 0.1s ease;
}

.auth-quick-enter-from,
.auth-quick-leave-to {
  opacity: 0;
}
</style>
