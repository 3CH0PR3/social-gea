<script setup>
import { Trees, Users, Recycle, Award } from 'lucide-vue-next';

const props = defineProps({
  empresa: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-xl text-white p-5 sm:p-6 shadow-md">
    <div class="flex items-center justify-between pb-3 border-b border-emerald-700/50">
      <div class="flex items-center gap-2">
        <Award class="w-5 h-5 text-emerald-300" />
        <h3 class="text-sm font-bold text-white">Impacto ecológico certificado</h3>
      </div>
      <span class="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
        Economía Circular Colombia
      </span>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      <div class="p-3 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-center">
        <Recycle class="w-5 h-5 text-emerald-300 mx-auto mb-1" />
        <div class="text-lg font-black text-white">480+ Ton</div>
        <div class="text-[10px] text-emerald-200">Material recuperado</div>
      </div>

      <div class="p-3 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-center">
        <Users class="w-5 h-5 text-emerald-300 mx-auto mb-1" />
        <div class="text-lg font-black text-white">1,240</div>
        <div class="text-[10px] text-emerald-200">Recicladores afiliados</div>
      </div>

      <div class="p-3 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-center">
        <Trees class="w-5 h-5 text-emerald-300 mx-auto mb-1" />
        <div class="text-lg font-black text-white">3,800+</div>
        <div class="text-[10px] text-emerald-200">Árboles salvados</div>
      </div>

      <div class="p-3 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-center">
        <Award class="w-5 h-5 text-emerald-300 mx-auto mb-1" />
        <div class="text-lg font-black text-white">99.2%</div>
        <div class="text-[10px] text-emerald-200">Trazabilidad limpia</div>
      </div>
    </div>
  </div>
</template>
