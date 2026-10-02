export const MOCK_EMPRESAS = [
  {
    id: 'emp_1',
    name: 'EcoPlast Circular Tech',
    category: 'Plásticos y Polímeros',
    typeIcon: 'Recycle',
    badge: 'Verificada por Radar Verde',
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    reviewsCount: 312,
    location: 'Parque Industrial Sur, Madrid',
    distanceKm: '1.4 km',
    incentive: '20 Pts por kg + Bonos mensuales',
    pickupAvailable: true,
    pickupDays: 'Lunes a Viernes (8:00 - 18:00)',
    description: 'Empresa pionera en transformación y reutilización de polímeros PET, PEAD y plásticos rígidos. Convertimos residuos urbanos en pellets industriales para nuevas materias primas de bajo impacto ambiental.',
    acceptedMaterials: [
      { id: 'pet', label: 'Botellas PET transparentes', icon: 'Bottle' },
      { id: 'pead', label: 'Envases PEAD / HDPE (detergentes, champú)' },
      { id: 'tapas', label: 'Tapas plásticas PP' },
      { id: 'film', label: 'Plástico film estirable limpio' }
    ],
    requirements: [
      'Envases limpios y sin restos orgánicos.',
      'Aplastados o compactados en bolsas transparentes.',
      'Etiquetas removidas preferiblemente.'
    ],
    contact: {
      phone: '+34 912 345 678',
      email: 'reciclaje@ecoplastcircular.es',
      schedule: 'Lunes a Sábado: 08:30 - 19:30'
    }
  },
  {
    id: 'emp_2',
    name: 'BioVidrio Regeneración Ibérica',
    category: 'Vidrio y Cristal',
    typeIcon: 'Wine',
    badge: 'Certificación Cero Residuos',
    coverImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    reviewsCount: 245,
    location: 'Avenida de la Industria 42, Getafe',
    distanceKm: '2.8 km',
    incentive: '15 Pts por kg + Canje por plantas',
    pickupAvailable: true,
    pickupDays: 'Martes y Jueves (9:00 - 16:00)',
    description: 'Especialistas en la recolección, clasificación por tonalidad y fundición de vidrio para envases sostenibles. Nuestro proceso ahorra hasta un 40% de energía frente a la fabricación tradicional.',
    acceptedMaterials: [
      { id: 'botellas_vidrio', label: 'Botellas de vino, cerveza y agua' },
      { id: 'frascos', label: 'Frascos de conservas y cosméticos' },
      { id: 'cristal_transparente', label: 'Tarros de vidrio ámbar, verde y transparente' }
    ],
    requirements: [
      'Sin tapas metálicas ni corchos.',
      'Enjuagados con agua sin grasa.',
      'No se acepta vitrocerámica, espejos ni bombillas.'
    ],
    contact: {
      phone: '+34 913 889 001',
      email: 'contacto@biovidrioiberica.com',
      schedule: 'Lunes a Viernes: 09:00 - 18:00'
    }
  },
  {
    id: 'emp_3',
    name: 'MetalCycle Siderúrgica Limpia',
    category: 'Metales y Aluminio',
    typeIcon: 'Shield',
    badge: 'Compromiso Huella Cero',
    coverImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    reviewsCount: 418,
    location: 'Polígono San Fernando de Henares',
    distanceKm: '3.6 km',
    incentive: '35 Pts por kg + Recompensa económica',
    pickupAvailable: true,
    pickupDays: 'Miércoles y Sábados (8:00 - 14:00)',
    description: 'Centro de valorización y prensado de metales ferrosos y no ferrosos. Especialistas en latas de aluminio, perfiles de cobre, hojalata y chatarra menor doméstica y comercial.',
    acceptedMaterials: [
      { id: 'latas_aluminio', label: 'Latas de bebidas en aluminio' },
      { id: 'conservas_metal', label: 'Latas de conservas y alimentos (hojalata)' },
      { id: 'cobre_bronce', label: 'Recortes de cobre, bronce y latón' },
      { id: 'chatarra_menor', label: 'Pequeños utensilios metálicos y sartenes viejas' }
    ],
    requirements: [
      'Latas de aluminio aplastadas para optimizar espacio.',
      'Latas de conserva sin restos de comida.',
      'No se reciben aerosoles presurizados con contenido.'
    ],
    contact: {
      phone: '+34 917 654 321',
      email: 'logistica@metalcycle.es',
      schedule: 'Lunes a Sábado: 08:00 - 17:00'
    }
  },
  {
    id: 'emp_4',
    name: 'GreenPaper & Cartón Sostenible',
    category: 'Papel y Cartón',
    typeIcon: 'FileText',
    badge: 'Sello Bosque Vivo',
    coverImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=200&q=80',
    rating: 4.7,
    reviewsCount: 189,
    location: 'Sector Norte, Alcobendas',
    distanceKm: '4.2 km',
    incentive: '12 Pts por kg + Cupones en papelerías',
    pickupAvailable: true,
    pickupDays: 'Lunes, Miércoles y Viernes',
    description: 'Empresa dedicada a la recuperación de fibras de celulosa procedentes de cajas de encomiendas, periódicos, archivos y cartón corrugado para su reintegración a la cadena editorial y de empaques.',
    acceptedMaterials: [
      { id: 'carton_corrugado', label: 'Cajas de cartón corrugado y embalajes' },
      { id: 'papel_oficina', label: 'Folios, periódicos y revistas' },
      { id: 'cajas_cereales', label: 'Cajas de alimentos secos y medicamentos' }
    ],
    requirements: [
      'Cajas desarmadas y atadas.',
      'Papel seco, sin grasa ni plastificado adhesivo.',
      'No se admiten servilletas sucias ni papel térmico de tickets.'
    ],
    contact: {
      phone: '+34 911 223 344',
      email: 'recogidas@greenpaper.es',
      schedule: 'Lunes a Viernes: 08:30 - 18:30'
    }
  },
  {
    id: 'emp_5',
    name: 'TechCycle RAEE & Baterías',
    category: 'Electrónicos y RAEE',
    typeIcon: 'Cpu',
    badge: 'Gestor Autorizado de Residuos Peligrosos',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    reviewsCount: 520,
    location: 'Hub Tecnológico Las Rozas, Madrid',
    distanceKm: '5.1 km',
    incentive: '50 Pts por dispositivo + Sorteos tech',
    pickupAvailable: true,
    pickupDays: 'Lunes a Sábado previa cita',
    description: 'Líder en reciclaje de residuos de aparatos eléctricos y electrónicos (RAEE). Recuperamos metales preciosos (oro, plata, paladio) de placas madre y neutralizamos baterías de litio con seguridad certificada.',
    acceptedMaterials: [
      { id: 'moviles_tablets', label: 'Smartphones, tablets y accesorios' },
      { id: 'laptops_pcs', label: 'Ordenadores portátiles, fuentes y torres' },
      { id: 'cables_cargadores', label: 'Cables USB, adaptadores y periféricos' },
      { id: 'pilas_baterias', label: 'Baterías de ion-litio y pilas alcalinas' }
    ],
    requirements: [
      'Dispositivos sin baterías infladas o rotas al aire.',
      'Sin datos sensibles (nosotros emitimos borrado seguro opcional).',
      'No se admiten electrodomésticos de línea blanca gigantes (neveras).'
    ],
    contact: {
      phone: '+34 914 998 877',
      email: 'soporte@techcycle.org',
      schedule: 'Lunes a Viernes: 09:00 - 19:00'
    }
  },
  {
    id: 'emp_6',
    name: 'CompostOrgánico Comunidad Viva',
    category: 'Orgánicos y Compost',
    typeIcon: 'Leaf',
    badge: 'Iniciativa Regenerativa Local',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    reviewsCount: 167,
    location: 'Huertos Urbanos Arganzuela, Madrid',
    distanceKm: '1.9 km',
    incentive: '10 Pts por kg + Abono orgánico gratis',
    pickupAvailable: false,
    pickupDays: 'Punto fijo: Martes, Jueves y Domingos',
    description: 'Red comunitaria de compostaje urbano. Recibimos restos vegetales y cáscaras para transformarlos en compost fértil de alta calidad para huertos urbanos y proyectos de reforestación comunitaria.',
    acceptedMaterials: [
      { id: 'restos_frutas_verduras', label: 'Cáscaras de frutas y verduras' },
      { id: 'cafe_te', label: 'Posos de café e infusiones sin grapas' },
      { id: 'hojas_secas', label: 'Restos de podas pequeñas y hojas secas' }
    ],
    requirements: [
      'Únicamente residuos de origen vegetal crudos.',
      'Sin carnes, pescados, lácteos ni aceites de cocina.',
      'Entregar en recipientes reutilizables o bolsas compostables.'
    ],
    contact: {
      phone: '+34 915 001 122',
      email: 'huertos@compostorganico.madrid',
      schedule: 'Martes, Jueves y Domingos: 10:00 - 14:00'
    }
  }
];
