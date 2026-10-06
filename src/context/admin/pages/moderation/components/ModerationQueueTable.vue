<template>
  <div class="space-y-4">
    <!-- Queue Items -->
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="rep in reports"
        :key="rep.id"
        class="sg-admin-card p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <!-- Left: Target info & user -->
        <div class="flex items-start gap-3.5 flex-1 min-w-0">
          <img
            :src="rep.reportedUser.avatar"
            :alt="rep.reportedUser.name"
            class="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
          />

          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-extrabold text-sm text-slate-900 leading-tight">
                {{ rep.reportedUser.name }}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                {{ rep.targetType }}
              </span>
              <span
                :class="rep.priority === 'high' ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'"
                class="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase"
              >
                {{ rep.reportsCount }} denuncias
              </span>
            </div>

            <!-- Content preview snippet -->
            <div class="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
              <p class="italic line-clamp-2">"{{ rep.contentPreview.text }}"</p>
              <div v-if="rep.contentPreview.image" class="mt-2 w-20 h-14 rounded overflow-hidden border border-slate-200">
                <img :src="rep.contentPreview.image" alt="Evidencia" class="w-full h-full object-cover" />
              </div>
            </div>

            <div class="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
              <span><strong>Motivo:</strong> {{ rep.reason }}</span>
              <span>·</span>
              <span>{{ rep.createdAt }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            v-if="rep.status === 'pending'"
            type="button"
            @click="$emit('resolve', rep)"
            class="sg-btn sg-btn--primary sg-btn--sm"
          >
            <ShieldAlert class="w-3.5 h-3.5" />
            <span>Revisar y Actuar</span>
          </button>

          <span
            v-else
            class="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200"
          >
            ✓ Resuelto
          </span>
        </div>
      </div>

      <div v-if="reports.length === 0" class="sg-admin-card p-10 text-center text-slate-500 text-xs">
        <CheckCircle2 class="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <span class="font-bold text-slate-700 block text-sm">Cola de Moderación limpia</span>
        <span>No hay denuncias pendientes de revisión en este filtro.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShieldAlert, CheckCircle2 } from 'lucide-vue-next';

defineProps({
  reports: {
    type: Array,
    required: true,
  },
});

defineEmits(['resolve']);
</script>
