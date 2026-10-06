<template>
  <section id="premios" class="sg-landing-section bg-white">
    <div class="sg-landing-container">
      <div class="sg-landing-section-header">
        <span class="sg-landing-section-badge">
          Catálogo Oficial de Recompensas
        </span>
        <h2 class="sg-landing-section-title">
          Premios maravillosos que transforman tu casa
        </h2>
        <p class="sg-landing-section-sub">
          Sin rifas ni sorteos inciertos: acumulas tus EcoPuntos en báscula de tu empresa local y canjeas de inmediato con comprobante digital CANJE-XXXXXX.
          Retira gratis en el centro de reciclaje o solicita envío asegurado a tu puerta en Colombia.
        </p>
      </div>

      <!-- Categories Filter -->
      <div class="flex items-center justify-center gap-2 flex-wrap mb-8">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectCategory(cat)"
          :class="[
            'px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors cursor-pointer',
            activeCategory === cat
              ? 'bg-amber-700 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Rewards Grid (Android: 1 col, Tablet: 2-3 cols, Desktop: 4 cols) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        <div
          v-for="item in visibleRewards"
          :key="item.id"
          class="sg-landing-card overflow-hidden flex flex-col justify-between"
        >
          <div>
            <!-- Image Area (Zero Scale Animation) -->
            <div class="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden cursor-pointer" @click="openRewardModal(item)">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
              <span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white">
                {{ item.category }}
              </span>
            </div>

            <!-- Content -->
            <div class="p-4 space-y-2">
              <h3
                @click="openRewardModal(item)"
                class="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {{ item.title }}
              </h3>

              <div class="flex items-baseline justify-between pt-1">
                <div>
                  <span class="text-xs text-slate-500 font-medium block">Costo de canje:</span>
                  <span class="text-lg sm:text-xl font-black text-amber-800 sg-landing-num">
                    {{ item.pointsPrice }}
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-[11px] text-slate-500 font-medium block">Valor comercial:</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-700 sg-landing-num">
                    {{ item.price }}
                  </span>
                </div>
              </div>

              <!-- Ecological equivalence -->
              <div class="pt-2 border-t border-slate-100 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <span>🌱</span>
                <span>{{ item.recyclingEquivalent }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Button -->
          <div class="p-4 pt-0">
            <button
              type="button"
              @click="openRewardModal(item)"
              class="sg-landing-btn sg-landing-btn--secondary sg-landing-btn--sm sg-landing-btn--block cursor-pointer"
            >
              <span>Ver ficha y detalles</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Controls: Expand All vs Collapse & Direct Action -->
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          @click="toggleShowAll"
          class="sg-landing-btn sg-landing-btn--reward cursor-pointer"
        >
          <span v-if="!showAll">
            Ver los {{ totalRewardsCount }} premios disponibles ↓
          </span>
          <span v-else>
            Mostrar menos premios ↑
          </span>
        </button>

        <RouterLink
          to="/auth/register"
          class="sg-landing-btn sg-landing-btn--primary"
          title="Crear cuenta para acumular puntos"
        >
          <CheckCircle class="w-4 h-4" />
          <span>Unirme a Socialgea</span>
        </RouterLink>
      </div>

      <!-- Trust note on delivery -->
      <div class="mt-10 p-5 sm:p-6 rounded-md bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-5xl mx-auto shadow-2xs">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Truck class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm sm:text-base font-bold text-slate-900">Entrega garantizada en todo el territorio colombiano</h4>
            <p class="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
              Generamos tu comprobante único CANJE-XXXXXX al momento. Despacho nacional por transportadora o retiro directo sin filas en tu empresa afiliada.
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="showAll = true"
          class="sg-landing-btn sg-landing-btn--secondary shrink-0 cursor-pointer"
        >
          <span>Ver catálogo completo</span>
        </button>
      </div>
    </div>

    <!-- ========================================================
         REWARD DETAIL MODAL (DUAL ANDROID / DESKTOP COMPLIANT)
         ======================================================== -->
    <Teleport to="body">
      <Transition name="sg-modal-fade">
        <div
          v-if="selectedReward"
          class="fixed inset-0 z-[9999] flex flex-col bg-white overflow-hidden sm:bg-black/60 sm:backdrop-blur-xs sm:items-center sm:justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          :aria-label="selectedReward.title"
          @click.self="selectedReward = null"
        >
          <div class="w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-xl bg-white flex flex-col overflow-hidden sm:rounded-lg sm:border sm:border-slate-200 sm:shadow-2xl">
            <!-- App Bar (Mobile) / Header (Desktop) -->
            <header class="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white shrink-0">
              <button
                type="button"
                @click="selectedReward = null"
                class="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer -ml-2"
                aria-label="Volver"
              >
                <ArrowLeft class="w-5 h-5" />
              </button>

              <h3 class="text-sm font-extrabold text-slate-900 truncate flex-1 sm:text-base">
                {{ selectedReward.title }}
              </h3>

              <button
                type="button"
                @click="selectedReward = null"
                class="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer -mr-2"
                aria-label="Cerrar"
              >
                <X class="w-5 h-5" />
              </button>
            </header>

            <!-- Body (Single Scroll) -->
            <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
              <!-- Photo -->
              <div class="h-56 sm:h-64 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  :src="selectedReward.image"
                  :alt="selectedReward.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Price & EcoPoints -->
              <div class="p-3.5 rounded-md bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <span class="text-xs text-amber-900 block font-bold">Costo en EcoPuntos:</span>
                  <span class="text-2xl font-black text-amber-800 sg-landing-num">
                    {{ selectedReward.pointsPrice }}
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-xs text-slate-500 block font-medium">Valor comercial estimado:</span>
                  <span class="text-sm font-extrabold text-slate-800 sg-landing-num">
                    {{ selectedReward.price }}
                  </span>
                </div>
              </div>

              <!-- Equivalent Recycling -->
              <div class="p-3 rounded-md bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <span>🌱</span>
                <span>{{ selectedReward.recyclingEquivalent }}</span>
              </div>

              <!-- Specs list if available -->
              <div v-if="selectedReward.specs && selectedReward.specs.length > 0" class="space-y-1.5">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Especificaciones técnicas:
                </h4>
                <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li v-for="sp in selectedReward.specs" :key="sp">
                    {{ sp }}
                  </li>
                </ul>
              </div>

              <!-- Explanation how to get it -->
              <div class="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                <h4 class="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 class="w-4 h-4 text-emerald-700" />
                  ¿Cómo puedes reclamar este premio?
                </h4>
                <ol class="list-decimal list-inside space-y-1 pl-1">
                  <li>Regístrate gratis en Socialgea Colombia.</li>
                  <li>Afíliate a tu empresa de reciclaje municipal para pesar tu material.</li>
                  <li>Genera tu comprobante CANJE-XXXXXX al alcanzar los puntos y recíbelo sin costo.</li>
                </ol>
              </div>
            </div>

            <!-- Footer fixed actions -->
            <footer class="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center gap-2.5 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a
                href="#simulador"
                @click="selectedReward = null"
                class="sg-landing-btn sg-landing-btn--secondary w-full sm:w-1/2 !min-h-[40px] text-center"
              >
                <span>Calcular con mi reciclaje</span>
              </a>

              <RouterLink
                :to="{ path: '/auth/register', query: { premio: selectedReward.title } }"
                @click="selectedReward = null"
                class="sg-landing-btn sg-landing-btn--primary w-full sm:w-1/2 !min-h-[40px] text-center"
              >
                <span>Crear cuenta para canjear</span>
              </RouterLink>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Truck,
  Store,
  ArrowLeft,
  X,
  CheckCircle,
  CheckCircle2
} from 'lucide-vue-next';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const categories = [
  'Todos los premios',
  'Electrodomésticos & Cuidado',
  'Tecnología & Gadgets',
  'Hogar Ecológico & Jardín',
  'Movilidad Sostenible',
  'Muebles & Upcycling',
];

const activeCategory = ref('Todos los premios');
const showAll = ref(false);
const selectedReward = ref(null);

useBodyScrollLock(() => Boolean(selectedReward.value));

function selectCategory(cat) {
  activeCategory.value = cat;
}

function toggleShowAll() {
  showAll.value = !showAll.value;
}

function openRewardModal(item) {
  selectedReward.value = item;
}

// Complete 14 rewards catalogue matching database
const allRewards = [
  {
    id: 'rew_1',
    title: 'Plancha de Pelo Cerámica Iónica Profesional',
    price: '$ 160.000 COP',
    pointsPrice: '480 Pts',
    category: 'Electrodomésticos & Cuidado',
    recyclingEquivalent: 'Equivale a 20 kg de PET transparente',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Placas de cerámica con turmalina antiestática',
      'Temperatura digital ajustable de 150°C a 230°C',
      'Cable giratorio 360° de 2 metros',
      'Apagado automático de seguridad tras 60 minutos'
    ],
  },
  {
    id: 'rew_2',
    title: 'Nevera Compacta Minibar A+++ 90L Ecológica',
    price: '$ 750.000 COP',
    pointsPrice: '2.400 Pts',
    category: 'Electrodomésticos & Cuidado',
    recyclingEquivalent: 'Equivale a 120 kg de reciclaje clasificado',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Capacidad útil de 90 litros con congelador superior',
      'Gas refrigerante ecológico R600a sin emisiones CFC',
      'Estantes de vidrio templado desmontables',
      'Consumo ultra bajo (menos de 0.35 kWh/día)'
    ],
  },
  {
    id: 'rew_3',
    title: 'Freidora de Aire Digital 4.5L Bajo Consumo',
    price: '$ 280.000 COP',
    pointsPrice: '850 Pts',
    category: 'Electrodomésticos & Cuidado',
    recyclingEquivalent: 'Equivale a 40 kg de plástico y cartón',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Capacidad familiar de 4.5 litros',
      'Panel táctil LED con 8 programas preestablecidos',
      'Cesta antiadherente libre de BPA y PFOA',
      'Tecnología de convección de aire caliente 360°'
    ],
  },
  {
    id: 'rew_4',
    title: 'Secador de Cabello Iónico Eco-Power 2000W',
    price: '$ 140.000 COP',
    pointsPrice: '420 Pts',
    category: 'Electrodomésticos & Cuidado',
    recyclingEquivalent: 'Equivale a 18 kg de PET clasificado',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Motor AC profesional de larga duración',
      'Tecnología cerámica iónica con boquilla concentradora',
      '2 velocidades y 3 niveles de temperatura'
    ],
  },
  {
    id: 'rew_5',
    title: 'Smartwatch Deportivo con Medición de Huella Eco',
    price: '$ 210.000 COP',
    pointsPrice: '680 Pts',
    category: 'Tecnología & Gadgets',
    recyclingEquivalent: 'Equivale a 12 kg de chatarra RAEE',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Sensor óptico de frecuencia cardíaca y SpO2',
      'Medición de huella de carbono y pasos diarios',
      'Batería de hasta 10 días de duración'
    ],
  },
  {
    id: 'rew_6',
    title: 'Monitor LED 24" Dell Reacondicionado Certificado',
    price: '$ 320.000 COP',
    pointsPrice: '900 Pts',
    category: 'Tecnología & Gadgets',
    recyclingEquivalent: 'Equivale a 20 kg de RAEE o metales',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Resolución Full HD 1920x1080 panel IPS antirreflejo',
      'Entradas HDMI, DisplayPort y VGA',
      'Consumo clase Energy Star de bajo impacto'
    ],
  },
  {
    id: 'rew_7',
    title: 'Audífonos Bluetooth con Plástico Marino Reciclado',
    price: '$ 130.000 COP',
    pointsPrice: '390 Pts',
    category: 'Tecnología & Gadgets',
    recyclingEquivalent: 'Equivale a 15 kg de botellas plásticas',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Fabricados con 70% de plástico reciclado del océano',
      'Cancelación de ruido pasiva y graves profundos',
      'Hasta 30 horas de reproducción continua'
    ],
  },
  {
    id: 'rew_8',
    title: 'Parlante Solar Bluetooth para Exteriores IPX7',
    price: '$ 150.000 COP',
    pointsPrice: '450 Pts',
    category: 'Tecnología & Gadgets',
    recyclingEquivalent: 'Equivale a 15 kg de latas de aluminio',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Panel fotovoltaico monocristalino integrado',
      'Resistente al agua y caídas clasificación IPX7',
      'Sonido estéreo envolvente 360 grados de 16W'
    ],
  },
  {
    id: 'rew_9',
    title: 'Set de 4 Maceteros de Plástico Reciclado HDPE',
    price: '$ 65.000 COP',
    pointsPrice: '350 Pts',
    category: 'Hogar Ecológico & Jardín',
    recyclingEquivalent: 'Equivale a 12 kg de plástico rígido',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Moldeados a partir de tapas y envases HDPE 100% recuperados',
      'Acabado marmoleado único e irrepetible por pieza',
      'Sistema de drenaje con plato recolector incluido'
    ],
  },
  {
    id: 'rew_10',
    title: 'Kit de Siembra & Huerta Urbana en Balcón',
    price: '$ 50.000 COP',
    pointsPrice: '240 Pts',
    category: 'Hogar Ecológico & Jardín',
    recyclingEquivalent: 'Equivale a 10 kg de residuos orgánicos o cartón',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Semillas orgánicas certificadas de albahaca, tomate cherry y lechuga',
      'Sustrato enriquecido con humus de lombriz 5 kg',
      'Mini pala y rastrillo de acero galvanizado'
    ],
  },
  {
    id: 'rew_11',
    title: 'Compostera Doméstica Giratoria 50 Litros',
    price: '$ 260.000 COP',
    pointsPrice: '780 Pts',
    category: 'Hogar Ecológico & Jardín',
    recyclingEquivalent: 'Equivale a 50 kg de cartón corrugado',
    image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Tambor rotatorio con doble cámara para maduración',
      'Aireación interna acelerada sin olores molestos',
      'Estructura de soporte en acero con pintura electrostática'
    ],
  },
  {
    id: 'rew_12',
    title: 'Botella Térmica de Acero Inoxidable 750ml',
    price: '$ 55.000 COP',
    pointsPrice: '290 Pts',
    category: 'Hogar Ecológico & Jardín',
    recyclingEquivalent: 'Equivale a 14 kg de PET en tu primera entrega',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Doble pared con aislamiento al vacío grado 304',
      'Mantiene bebidas frías 24h y calientes 12h',
      'Libre de BPA y recubrimiento anti-rayaduras'
    ],
  },
  {
    id: 'rew_13',
    title: 'Bicicleta Urbana Reacondicionada Socialgea',
    price: '$ 420.000 COP',
    pointsPrice: '1.800 Pts',
    category: 'Movilidad Sostenible',
    recyclingEquivalent: 'Equivale a 90 kg de reciclaje clasificado',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Cuadro de acero reciclado repintado al horno',
      'Ruedas 26" con llantas nuevas y rines de aluminio',
      'Frenos V-Brake ajustados con canastilla delantera incluida'
    ],
  },
  {
    id: 'rew_14',
    title: 'Mesa Auxiliar de Madera Reclaimed & Palets',
    price: '$ 180.000 COP',
    pointsPrice: '650 Pts',
    category: 'Muebles & Upcycling',
    recyclingEquivalent: 'Equivale a 35 kg de madera recuperada',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=500&q=80',
    specs: [
      'Madera de pino recuperada tratada contra plagas',
      'Acabado rústico protegido con sellador ecológico a base de agua',
      'Dimensiones: 45 cm alto x 40 cm ancho x 40 cm fondo'
    ],
  },
];

const totalRewardsCount = computed(() => allRewards.length);

const filteredRewards = computed(() => {
  if (activeCategory.value === 'Todos los premios') {
    return allRewards;
  }
  return allRewards.filter((r) => r.category === activeCategory.value);
});

const visibleRewards = computed(() => {
  if (showAll.value || activeCategory.value !== 'Todos los premios') {
    return filteredRewards.value;
  }
  return filteredRewards.value.slice(0, 8);
});
</script>

<style scoped>
.sg-modal-fade-enter-active,
.sg-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sg-modal-fade-enter-from,
.sg-modal-fade-leave-to {
  opacity: 0;
}
</style>
