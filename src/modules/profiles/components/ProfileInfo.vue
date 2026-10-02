<template>
  <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
    <h3 class="font-bold text-slate-900 text-base">Información general</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
        <Briefcase class="w-5 h-5 text-emerald-600" />
        <div>
          <span class="text-[11px] text-slate-400 block font-medium">Trabajo</span>
          <span class="text-xs font-semibold text-slate-800">
            {{ user.work || 'Diseñador en Radar Labs' }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
        <GraduationCap class="w-5 h-5 text-emerald-600" />
        <div>
          <span class="text-[11px] text-slate-400 block font-medium">Educación</span>
          <span class="text-xs font-semibold text-slate-800">
            {{ user.education || 'Universidad Complutense de Madrid' }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
        <MapPin class="w-5 h-5 text-emerald-600" />
        <div>
          <span class="text-[11px] text-slate-400 block font-medium">Ubicación</span>
          <span class="text-xs font-semibold text-slate-800">
            {{ user.location || 'Madrid, España' }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
        <Calendar class="w-5 h-5 text-emerald-600" />
        <div>
          <span class="text-[11px] text-slate-400 block font-medium">Se unió a Conecta Radar</span>
          <span class="text-xs font-semibold text-slate-800">
            {{ user.joinedDate || 'Mayo 2024' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-vue-next';

defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>
