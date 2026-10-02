<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-slate-800 text-base">Solicitudes de amistad pendientes</h3>
      <span class="text-xs text-slate-500 font-medium">
        {{ requests.length }} solicitudes
      </span>
    </div>

    <div v-if="requests.length === 0" class="text-center py-10 text-slate-400 text-sm">
      No tienes solicitudes de amistad pendientes en este momento.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="req in requests"
        :key="req.id"
        class="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between"
      >
        <div class="flex items-start gap-3">
          <img
            :src="req.user.avatar"
            :alt="req.user.name"
            class="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200"
          />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-slate-900 truncate">{{ req.user.name }}</h4>
            <p class="text-xs text-slate-500">@{{ req.user.username }}</p>
            <p class="text-[11px] text-emerald-600 font-medium mt-1">
              {{ req.mutualFriends }} amigos en común
            </p>
            <span class="text-[10px] text-slate-400">{{ req.timestamp }}</span>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <div
            v-if="acceptedList.includes(req.id)"
            class="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Check class="w-4 h-4 text-emerald-600" />
            <span>¡Solicitud Aceptada!</span>
          </div>
          <template v-else>
            <button
              type="button"
              @click="$emit('accept', req.id)"
              class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Confirmar
            </button>
            <button
              type="button"
              @click="$emit('decline', req.id)"
              class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
            >
              Eliminar
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next';

defineProps({
  requests: {
    type: Array,
    default: () => [],
  },
  acceptedList: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['accept', 'decline']);
</script>
