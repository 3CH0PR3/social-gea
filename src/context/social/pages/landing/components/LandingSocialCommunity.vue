<template>
  <section id="comunidad" class="sg-landing-section bg-white">
    <div class="sg-landing-container">
      <div class="sg-landing-section-header">
        <span class="sg-landing-section-badge">
          Mucho más que una báscula · Una Red Social Activa
        </span>
        <h2 class="sg-landing-section-title">
          Conéctate con amigos, vecinos y recicladores de tu ciudad
        </h2>
        <p class="sg-landing-section-sub">
          Comparte fotos de tus jornadas de separación, celebra tus metas ambientales en Historias de 24h
          y compite en el ranking barrial de tu comuna o conjunto residencial.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feature 1: El Muro Comunitario -->
        <div class="sg-landing-card p-6 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
              <Share2 class="w-6 h-6" />
            </div>
            <h3 class="text-lg sm:text-xl font-black text-slate-900">
              Muro Social & Publicaciones
            </h3>
            <p class="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Publica fotos de tus entregas en los centros de acopio, reacciona a las publicaciones de tus amigos
              y comparte tips para limpiar plásticos y compactar cartones sin ocupar espacio en tu hogar.
            </p>
          </div>
          <div class="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm font-bold text-emerald-800">
            ✓ Reacciones estilo Facebook · Comentarios en vivo
          </div>
        </div>

        <!-- Feature 2: Historias de 24h -->
        <div class="sg-landing-card p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center mb-5">
              <Sparkles class="w-6 h-6" />
            </div>
            <h3 class="text-lg sm:text-xl font-black text-slate-900">
              Historias Efímeras de 24h
            </h3>
            <p class="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Muestra el antes y después de tu garaje o cocina. Comparte tus visitas al centro de pesaje
              con gradientes personalizados, textos y fotos de alta resolución que desaparecen al día siguiente.
            </p>
          </div>
          <div class="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm font-bold text-amber-900">
            ✓ Comparte tus entregas sin saturar tu perfil permanente
          </div>
        </div>

        <!-- Feature 3: Red de Amigos & Messenger -->
        <div class="sg-landing-card p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center mb-5">
              <Users class="w-6 h-6" />
            </div>
            <h3 class="text-lg sm:text-xl font-black text-slate-900">
              Amigos, Chat & Transferencias
            </h3>
            <p class="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Agrega amigos de tu universidad, trabajo o conjunto. Coordina entregas grupales para solicitar
              camión de recolección a domicilio y transfórmate en el líder ambiental de tu sector.
            </p>
          </div>
          <div class="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm font-bold text-teal-900">
            ✓ Mensajería instantánea y red vecinal integrada
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Share2, Sparkles, Users } from 'lucide-vue-next';
</script>
