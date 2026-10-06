<template>
  <footer class="bg-slate-50 border-t border-slate-200 text-slate-600">
    <!-- Call to Action Banner (Light Theme) -->
    <div class="border-b border-slate-200 bg-white py-12 sm:py-16">
      <div class="sg-landing-container text-center max-w-4xl mx-auto space-y-4 sm:space-y-5">
        <span class="inline-block text-xs sm:text-sm font-bold px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-md">
          🌱 El cambio empieza en tu casa
        </span>

        <h2 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Deja de botar plata a la basura. Empieza a acumular EcoPuntos hoy.
        </h2>

        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Afíliate a tu empresa de reciclaje municipal en menos de 1 minuto. Entrega tus materiales y empieza a sumar puntos para tu próximo premio.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <RouterLink
            to="/auth/register"
            class="sg-landing-btn sg-landing-btn--primary w-full sm:w-auto"
          >
            <UserPlus class="w-4 h-4" />
            <span>Crear cuenta gratis en Socialgea</span>
          </RouterLink>

          <RouterLink
            to="/auth/login"
            class="sg-landing-btn sg-landing-btn--secondary w-full sm:w-auto"
          >
            <span>Ya tengo cuenta · Entrar</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Informative Footer (No link columns, clean and professional) -->
    <div class="sg-landing-container py-8 sm:py-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 text-center md:text-left">
        <!-- Brand & Informative Description -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-base shrink-0">
            sg
          </div>
          <div>
            <span class="font-black text-base tracking-tight text-slate-900 block leading-tight">
              socialgea
            </span>
            <span class="text-xs text-slate-500 font-medium">
              Red social ecológica de reciclaje y economía circular en Colombia
            </span>
          </div>
        </div>

        <!-- Informative note -->
        <div class="text-xs text-slate-500 max-w-md leading-relaxed text-center md:text-right">
          Plataforma comunitaria para la recolección, pesaje certificado y canje de materiales aprovechables. Trazabilidad conforme a la normatividad ambiental de Colombia.
        </div>
      </div>

      <!-- Bottom Bar: Derechos, Términos, Privacidad, Volver arriba -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <span>© 2026 Socialgea Colombia · Todos los derechos reservados.</span>
        <div class="flex items-center gap-4">
          <RouterLink to="/auth/login" class="hover:text-emerald-800 transition-colors">
            Términos de servicio
          </RouterLink>
          <RouterLink to="/auth/login" class="hover:text-emerald-800 transition-colors">
            Política de privacidad
          </RouterLink>
          <a href="#top" class="hover:text-emerald-800 font-semibold transition-colors">
            Volver arriba ↑
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { UserPlus } from 'lucide-vue-next';
</script>
