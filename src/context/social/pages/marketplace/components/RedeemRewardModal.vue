<template>
  <Teleport to="body">
    <div v-if="isOpen && reward">
      <!-- ========================================================
           1. ANDROID / MOBILE COMPONENT:
           Full-screen viewport (100dvh), native app screen without floating window or page scroll.
           ======================================================== -->
      <div
        v-if="!isDesktop"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col h-[100dvh] w-full overflow-hidden select-none animate-in slide-in-from-bottom duration-200"
      >
        <!-- Top App Bar -->
        <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              @click="handleClose"
              class="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors cursor-pointer"
              aria-label="Volver"
            >
              <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
            </button>
            <div>
              <h3 class="text-sm font-bold text-slate-900 leading-tight">
                {{ isSuccess ? '¡Canje Confirmado!' : 'Proceso de Canje' }}
              </h3>
              <span class="text-[10px] text-slate-500 font-medium">
                {{ isSuccess ? 'Comprobante oficial' : 'Socialgea Rewards' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click="handleClose"
            class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Android Success View -->
        <div v-if="isSuccess" class="flex-1 overflow-y-auto p-4 space-y-4 text-center">
          <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 class="w-8 h-8 stroke-[2.5]" />
          </div>

          <div class="space-y-1">
            <h4 class="text-base font-extrabold text-slate-900 tracking-tight">
              ¡Felicitaciones por tu esfuerzo de reciclaje!
            </h4>
            <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Tus puntos han sido canjeados exitosamente por este producto.
            </p>
          </div>

          <!-- Ticket Card -->
          <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between border-b border-amber-200 pb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                TICKET DE CANJE
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Aprobado
              </span>
            </div>

            <div class="py-2 px-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between shadow-2xs">
              <div class="text-left">
                <span class="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Código de retiro:
                </span>
                <span class="text-base font-mono font-black text-slate-900 tracking-wider">
                  {{ ticketCode }}
                </span>
              </div>
              <button
                type="button"
                @click="copyTicketCode"
                class="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy class="w-3.5 h-3.5" />
                <span>{{ copied ? '¡Copiado!' : 'Copiar' }}</span>
              </button>
            </div>

            <div class="space-y-1 text-xs text-slate-700 text-left pt-1">
              <div class="flex items-start justify-between gap-2 border-b border-amber-100 pb-1">
                <span class="text-slate-500 text-[11px]">Premio:</span>
                <span class="font-bold text-slate-900 text-right truncate max-w-[200px]">{{ reward.title }}</span>
              </div>
              <div class="flex items-center justify-between border-b border-amber-100 pb-1">
                <span class="text-slate-500 text-[11px]">Puntos deducidos:</span>
                <span class="font-bold text-amber-700">-{{ reward.rawPoints }} Pts</span>
              </div>
              <div class="flex items-center justify-between border-b border-amber-100 pb-1">
                <span class="text-slate-500 text-[11px]">Nuevo saldo:</span>
                <span class="font-extrabold text-emerald-700">{{ marketplaceStore.userPoints }} Pts</span>
              </div>
              <div class="flex items-center justify-between pt-0.5">
                <span class="text-slate-500 text-[11px]">Modalidad:</span>
                <span class="font-semibold text-slate-800 text-right">
                  {{ form.deliveryMethod === 'pickup' ? 'Retiro en centro de acopio' : 'Envío a domicilio' }}
                </span>
              </div>
            </div>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl text-left text-xs text-slate-600 flex items-start gap-2.5">
            <AlertCircle class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p class="text-[11px] leading-relaxed text-slate-600">
              Presenta este código al momento de retirar tu premio en tu centro de reciclaje asignado o al mensajero para validar la entrega.
            </p>
          </div>
        </div>

        <!-- Android Success Bottom Action -->
        <div v-if="isSuccess" class="p-3 border-t border-slate-200 bg-white shrink-0">
          <button
            type="button"
            @click="handleClose"
            class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Entendido, volver al catálogo
          </button>
        </div>

        <!-- Android Form View -->
        <div v-else class="flex-1 overflow-y-auto p-4 space-y-4">
          <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0">
              <SafeImage
                :src="reward.image"
                :alt="reward.title"
                imgClass="w-full h-full object-cover"
                containerClass="w-full h-full"
              />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                {{ reward.category }}
              </span>
              <h4 class="text-xs font-bold text-slate-900 truncate mt-1">
                {{ reward.title }}
              </h4>
              <p class="text-[11px] text-emerald-700 font-semibold mt-0.5 truncate">
                🌱 {{ reward.recyclingEquivalent }}
              </p>
            </div>
          </div>

          <!-- Points Breakdown -->
          <div class="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
            <div class="flex items-center justify-between text-slate-600">
              <span>Tus EcoPuntos acumulados:</span>
              <span class="font-bold text-slate-900">{{ marketplaceStore.userPoints }} Pts</span>
            </div>
            <div class="flex items-center justify-between text-slate-600">
              <span>Costo del premio:</span>
              <span class="font-bold text-amber-600">- {{ reward.rawPoints }} Pts</span>
            </div>
            <div class="border-t border-slate-100 pt-2 flex items-center justify-between font-bold">
              <span>Saldo después del canje:</span>
              <span :class="hasEnoughPoints ? 'text-emerald-700' : 'text-red-600'">
                {{ hasEnoughPoints ? `${marketplaceStore.userPoints - reward.rawPoints} Pts` : 'Insuficiente' }}
              </span>
            </div>
          </div>

          <!-- Delivery Mode Selection -->
          <div v-if="hasEnoughPoints" class="space-y-3">
            <label class="text-xs font-bold text-slate-800 block">
              Selecciona modalidad de entrega:
            </label>

            <div class="grid grid-cols-2 gap-2">
              <label
                :class="[
                  'p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between',
                  form.deliveryMethod === 'pickup'
                    ? 'border-amber-500 bg-amber-50/40 text-amber-900'
                    : 'border-slate-200 text-slate-700'
                ]"
              >
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-1.5">
                    <Building2 class="w-3.5 h-3.5 text-amber-600" />
                    <span class="text-xs font-bold">Retiro</span>
                  </div>
                  <input
                    type="radio"
                    value="pickup"
                    v-model="form.deliveryMethod"
                    class="accent-amber-600"
                  />
                </div>
                <span class="text-[9.5px] text-slate-500 leading-tight">
                  En centro afiliado
                </span>
              </label>

              <label
                :class="[
                  'p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between',
                  form.deliveryMethod === 'shipping'
                    ? 'border-amber-500 bg-amber-50/40 text-amber-900'
                    : 'border-slate-200 text-slate-700'
                ]"
              >
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-1.5">
                    <Truck class="w-3.5 h-3.5 text-amber-600" />
                    <span class="text-xs font-bold">A domicilio</span>
                  </div>
                  <input
                    type="radio"
                    value="shipping"
                    v-model="form.deliveryMethod"
                    class="accent-amber-600"
                  />
                </div>
                <span class="text-[9.5px] text-slate-500 leading-tight">
                  Envío nacional
                </span>
              </label>
            </div>

            <!-- Form fields -->
            <div class="space-y-2 pt-1 text-xs">
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Nombre completo:</label>
                <input
                  type="text"
                  v-model="form.recipientName"
                  placeholder="Ej: Carlos Méndez"
                  class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none text-slate-800 text-xs"
                />
              </div>

              <div>
                <label class="font-semibold text-slate-700 block mb-1">Teléfono:</label>
                <input
                  type="tel"
                  v-model="form.phone"
                  placeholder="Ej: +57 312 456 7890"
                  class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none text-slate-800 text-xs"
                />
              </div>

              <div v-if="form.deliveryMethod === 'shipping'">
                <label class="font-semibold text-slate-700 block mb-1">Dirección y Ciudad:</label>
                <input
                  type="text"
                  v-model="form.address"
                  placeholder="Ej: Cra 15 #85-30, Bogotá D.C."
                  class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none text-slate-800 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Android Form Bottom Action -->
        <div v-if="!isSuccess" class="p-3 border-t border-slate-200 bg-white shrink-0 flex items-center gap-2">
          <button
            type="button"
            @click="handleClose"
            class="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            v-if="hasEnoughPoints"
            type="button"
            @click="submitRedemption"
            class="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Gift class="w-3.5 h-3.5" />
            <span>Confirmar Canje</span>
          </button>

          <button
            v-else
            type="button"
            disabled
            class="flex-1 py-2 px-3 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed text-center"
          >
            Puntos insuficientes
          </button>
        </div>
      </div>

      <!-- ========================================================
           2. DESKTOP MODAL:
           Centered floating modal dialog.
           ======================================================== -->
      <div
        v-else
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        @click="$emit('close')"
      >
        <div
          class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/90 flex flex-col overscroll-contain animate-in zoom-in-95 duration-200 select-none max-h-[92vh]"
          @click.stop
        >
          <!-- Desktop Modal Top Bar -->
          <div class="px-5 py-3.5 border-b border-slate-200/90 flex items-center justify-between bg-white sticky top-0 z-10">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Gift class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 leading-tight">
                  {{ isSuccess ? '¡Canje Confirmado!' : 'Canjear Premio' }}
                </h3>
                <span class="text-[11px] text-slate-500">
                  {{ isSuccess ? 'Comprobante digital oficial' : 'Socialgea Rewards' }}
                </span>
              </div>
            </div>

            <button
              type="button"
              @click="handleClose"
              class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Desktop Success View -->
          <div v-if="isSuccess" class="p-6 overflow-y-auto space-y-4 text-center">
            <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 class="w-8 h-8 stroke-[2.5]" />
            </div>

            <div class="space-y-1">
              <h4 class="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                ¡Felicitaciones por tu esfuerzo de reciclaje!
              </h4>
              <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Tus puntos han sido canjeados exitosamente por este producto.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3 shadow-2xs">
              <div class="flex items-center justify-between border-b border-amber-200 pb-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  TICKET DE CANJE
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Aprobado
                </span>
              </div>

              <div class="py-2 px-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between shadow-2xs">
                <div class="text-left">
                  <span class="text-[9.5px] uppercase font-bold text-slate-400 block tracking-wider">
                    Código único de retiro:
                  </span>
                  <span class="text-base sm:text-lg font-mono font-black text-slate-900 tracking-wider">
                    {{ ticketCode }}
                  </span>
                </div>
                <button
                  type="button"
                  @click="copyTicketCode"
                  class="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Copy class="w-3.5 h-3.5" />
                  <span>{{ copied ? '¡Copiado!' : 'Copiar' }}</span>
                </button>
              </div>

              <div class="space-y-1.5 text-xs text-slate-700 text-left pt-1">
                <div class="flex items-start justify-between gap-2 border-b border-amber-100 pb-1">
                  <span class="text-slate-500 text-[11px]">Premio:</span>
                  <span class="font-bold text-slate-900 text-right truncate max-w-[220px]">{{ reward.title }}</span>
                </div>
                <div class="flex items-center justify-between border-b border-amber-100 pb-1">
                  <span class="text-slate-500 text-[11px]">Puntos deducidos:</span>
                  <span class="font-bold text-amber-700">-{{ reward.rawPoints }} Pts</span>
                </div>
                <div class="flex items-center justify-between border-b border-amber-100 pb-1">
                  <span class="text-slate-500 text-[11px]">Nuevo saldo disponible:</span>
                  <span class="font-extrabold text-emerald-700">{{ marketplaceStore.userPoints }} Pts</span>
                </div>
                <div class="flex items-center justify-between pt-0.5">
                  <span class="text-slate-500 text-[11px]">Modalidad:</span>
                  <span class="font-semibold text-slate-800 text-right">
                    {{ form.deliveryMethod === 'pickup' ? 'Retiro en centro de acopio' : 'Envío a domicilio' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl text-left text-xs text-slate-600 flex items-start gap-2.5">
              <AlertCircle class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p class="text-[11px] leading-relaxed text-slate-600">
                Presenta este código al momento de retirar tu premio en tu centro de reciclaje asignado o al mensajero para validar la entrega.
              </p>
            </div>

            <button
              type="button"
              @click="handleClose"
              class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Entendido, volver al catálogo
            </button>
          </div>

          <!-- Desktop Form View -->
          <div v-else class="p-5 overflow-y-auto space-y-4">
            <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                <SafeImage
                  :src="reward.image"
                  :alt="reward.title"
                  imgClass="w-full h-full object-cover"
                  containerClass="w-full h-full"
                />
              </div>
              <div class="min-w-0 flex-1">
                <span class="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  {{ reward.category }}
                </span>
                <h4 class="text-xs font-bold text-slate-900 truncate mt-1">
                  {{ reward.title }}
                </h4>
                <p class="text-[11px] text-emerald-700 font-semibold mt-0.5 truncate">
                  🌱 {{ reward.recyclingEquivalent }}
                </p>
              </div>
            </div>

            <div class="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
              <div class="flex items-center justify-between text-slate-600">
                <span>Tus EcoPuntos acumulados:</span>
                <span class="font-bold text-slate-900">{{ marketplaceStore.userPoints }} Pts</span>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span>Costo del premio:</span>
                <span class="font-bold text-amber-600">- {{ reward.rawPoints }} Pts</span>
              </div>
              <div class="border-t border-slate-100 pt-2 flex items-center justify-between font-bold">
                <span>Saldo después del canje:</span>
                <span :class="hasEnoughPoints ? 'text-emerald-700' : 'text-red-600'">
                  {{ hasEnoughPoints ? `${marketplaceStore.userPoints - reward.rawPoints} Pts` : 'Insuficiente' }}
                </span>
              </div>
            </div>

            <div v-if="hasEnoughPoints" class="space-y-3">
              <label class="text-xs font-bold text-slate-800 block">
                Selecciona modalidad de entrega:
              </label>

              <div class="grid grid-cols-2 gap-2.5">
                <label
                  :class="[
                    'p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between',
                    form.deliveryMethod === 'pickup'
                      ? 'border-amber-500 bg-amber-50/40 text-amber-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  ]"
                >
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1.5">
                      <Building2 class="w-4 h-4 text-amber-600" />
                      <span class="text-xs font-bold">Retiro en Centro</span>
                    </div>
                    <input
                      type="radio"
                      value="pickup"
                      v-model="form.deliveryMethod"
                      class="accent-amber-600"
                    />
                  </div>
                  <span class="text-[10px] text-slate-500 leading-tight">
                    Gratis e inmediato en tu centro de acopio.
                  </span>
                </label>

                <label
                  :class="[
                    'p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between',
                    form.deliveryMethod === 'shipping'
                      ? 'border-amber-500 bg-amber-50/40 text-amber-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  ]"
                >
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1.5">
                      <Truck class="w-4 h-4 text-amber-600" />
                      <span class="text-xs font-bold">Envío a Domicilio</span>
                    </div>
                    <input
                      type="radio"
                      value="shipping"
                      v-model="form.deliveryMethod"
                      class="accent-amber-600"
                    />
                  </div>
                  <span class="text-[10px] text-slate-500 leading-tight">
                    Despacho directo a tu dirección.
                  </span>
                </label>
              </div>

              <div class="space-y-2 pt-1 text-xs">
                <div>
                  <label class="font-semibold text-slate-700 block mb-1">Nombre completo:</label>
                  <input
                    type="text"
                    v-model="form.recipientName"
                    placeholder="Ej: Carlos Méndez"
                    class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label class="font-semibold text-slate-700 block mb-1">Teléfono:</label>
                  <input
                    type="tel"
                    v-model="form.phone"
                    placeholder="Ej: +57 312 456 7890"
                    class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none text-slate-800 text-xs"
                  />
                </div>

                <div v-if="form.deliveryMethod === 'shipping'">
                  <label class="font-semibold text-slate-700 block mb-1">Dirección y Ciudad:</label>
                  <input
                    type="text"
                    v-model="form.address"
                    placeholder="Ej: Cra 15 #85-30, Bogotá D.C."
                    class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none text-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>

            <div class="pt-2 flex items-center gap-2">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                v-if="hasEnoughPoints"
                type="button"
                @click="submitRedemption"
                class="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Gift class="w-3.5 h-3.5" />
                <span>Confirmar Canje</span>
              </button>

              <button
                v-else
                type="button"
                disabled
                class="flex-1 py-2 px-3 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed text-center"
              >
                Puntos insuficientes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Gift,
  X,
  ArrowLeft,
  Building2,
  Truck,
  CheckCircle2,
  Copy,
  AlertCircle
} from 'lucide-vue-next';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  reward: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close']);
const marketplaceStore = useMarketplaceStore();

const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 640 : true);

function handleResize() {
  isDesktop.value = window.innerWidth >= 640;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

useBodyScrollLock(() => props.isOpen);

const isSuccess = ref(false);
const ticketCode = ref('');
const copied = ref(false);

const form = ref({
  deliveryMethod: 'pickup',
  recipientName: 'Carlos Méndez',
  phone: '+57 310 987 6543',
  address: 'Calle 72 # 11-86, Bogotá D.C.',
});

const hasEnoughPoints = computed(() => {
  if (!props.reward) return false;
  return marketplaceStore.userPoints >= props.reward.rawPoints;
});

function submitRedemption() {
  if (!props.reward || !hasEnoughPoints.value) return;

  const res = marketplaceStore.confirmRedemption(props.reward, form.value);
  if (res.success) {
    ticketCode.value = res.ticketCode;
    isSuccess.value = true;
  }
}

function copyTicketCode() {
  if (!ticketCode.value) return;
  navigator.clipboard?.writeText(ticketCode.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function handleClose() {
  isSuccess.value = false;
  ticketCode.value = '';
  emit('close');
}
</script>
