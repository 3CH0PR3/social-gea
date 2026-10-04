import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHeroSlider() {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=85',
      titlePrefix: 'El cambio',
      titleAction: 'comienza',
      titleHighlight: 'contigo.',
      description: 'Únete a la primera red social de reciclaje en Colombia. Conecta con miles de personas, comparte tu impacto y recibe recompensas por cuidar nuestro planeta.',
      statBadge: '🌱 +45,000 kg de PET recuperados',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1600&q=85',
      titlePrefix: 'Tu huella',
      titleAction: 'transforma',
      titleHighlight: 'comunidades.',
      description: 'Acumula EcoPuntos por clasificar y entregar materiales en centros de acopio aliados. Canjéalos por premios reales y tecnología sostenible.',
      statBadge: '♻️ 128 Centros de acopio en Colombia',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=85',
      titlePrefix: 'Economía circular',
      titleAction: 'para un futuro',
      titleHighlight: 'verde.',
      description: 'Apoya a recicladores de oficio, conecta con empresas sostenibles y sé parte de la red ecológica que está cambiando a Colombia.',
      statBadge: '🏆 +1.4M EcoPuntos canjeados',
    },
  ];

  const currentSlideIndex = ref(0);
  let intervalId = null;

  const nextSlide = () => {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length;
  };

  const prevSlide = () => {
    currentSlideIndex.value =
      (currentSlideIndex.value - 1 + slides.length) % slides.length;
  };

  const setSlide = (index) => {
    currentSlideIndex.value = index;
  };

  onMounted(() => {
    intervalId = setInterval(nextSlide, 7500);
  });

  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return {
    slides,
    currentSlideIndex,
    nextSlide,
    prevSlide,
    setSlide,
  };
}
