export const CURRENT_USER = {
  id: 'user_current',
  name: 'Carlos Méndez',
  username: 'carlosm',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
  bio: 'Diseñador de producto digital y creador en Conecta. Construyendo comunidades más cercanas con tecnología de radar 🌐🚀',
  work: 'Lead Designer en Radar Labs',
  education: 'Universidad Complutense de Madrid',
  location: 'Madrid, España',
  joinedDate: 'Mayo 2024',
  friendsCount: 428,
  followersCount: 1250,
  isOnline: true,
};

export const MOCK_USERS = [
  {
    id: 'user_1',
    name: 'Elena Rostova',
    username: 'elena_r',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    bio: 'Fotógrafa de viajes & Paisajismo alpino. Buscando siempre la mejor luz.',
    location: 'Barcelona, España',
    joinedDate: 'Enero 2023',
    friendsCount: 512,
    followersCount: 3420,
    radarDistance: 'A 180 metros de ti',
    isOnline: true,
    isFriend: true,
  },
  {
    id: 'user_2',
    name: 'Alejandro Morales',
    username: 'alexmorales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    bio: 'Software Engineer | Entusiasta del open source, café de especialidad y TypeScript.',
    location: 'Valencia, España',
    joinedDate: 'Marzo 2023',
    friendsCount: 389,
    followersCount: 890,
    radarDistance: 'A 450 metros de ti',
    isOnline: true,
    isFriend: true,
  },
  {
    id: 'user_3',
    name: 'Sofía Valenzuela',
    username: 'sofi_val',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
    bio: 'Arquitecta de interiores sustentables. Amante del arte botánico 🌱🏛️',
    location: 'Sevilla, España',
    joinedDate: 'Octubre 2023',
    friendsCount: 640,
    followersCount: 2100,
    radarDistance: 'A 1.2 km de ti',
    isOnline: false,
    isFriend: true,
  },
  {
    id: 'user_4',
    name: 'Marcos Benítez',
    username: 'marcosb_dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
    bio: 'Fullstack dev & ciclista de montaña. Explorador de redes distribuidas.',
    location: 'Bilbao, España',
    joinedDate: 'Julio 2023',
    friendsCount: 275,
    followersCount: 620,
    radarDistance: 'A 320 metros de ti',
    isOnline: true,
    isFriend: false,
    requestPending: true,
  },
  {
    id: 'user_5',
    name: 'Valentina Silva',
    username: 'valensilva',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    bio: 'Community Manager & Creadora de contenido gastronómico 🥐☕',
    location: 'Madrid, España',
    joinedDate: 'Noviembre 2023',
    friendsCount: 890,
    followersCount: 5400,
    radarDistance: 'A 80 metros de ti',
    isOnline: true,
    isFriend: false,
  },
];

export const COMMUNITY_USERS = MOCK_USERS;

export const PRESET_IMAGE_GALLERY = [
  {
    label: 'Lago Glaciar Alpino',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: 'Naturaleza',
  },
  {
    label: 'Espacio de Trabajo Creativo',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    category: 'Tecnología',
  },
  {
    label: 'Café de Especialidad',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    category: 'Estilo de Vida',
  },
  {
    label: 'Atardecer Urbano',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    category: 'Ciudad',
  },
  {
    label: 'Red Conectada Futurista',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category: 'Redes',
  },
  {
    label: 'Arquitectura Minimalista',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Diseño',
  }
];

export const INITIAL_POSTS = [
  {
    id: 'post_1',
    authorId: 'user_1',
    authorName: 'Elena Rostova',
    authorUsername: 'elena_r',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    authorVerified: true,
    timestamp: 'Hace 25 minutos',
    privacy: 'public',
    content: 'Comenzando el fin de semana en este refugio de montaña. No hay nada como el aire puro y la desconexión total. ¿Ustedes prefieren montaña o playa para descansar? 🏔️🌲 #Naturaleza #Fotografía #WeekendVibes',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Parque Nacional de los Picos de Europa',
    feeling: {
      emoji: '🌿',
      text: 'en paz'
    },
    reactions: {
      like: 84,
      love: 42,
      care: 16,
      haha: 2,
      wow: 29,
      sad: 0,
      angry: 0,
    },
    userReaction: 'love',
    reactionsList: [
      {
        userId: CURRENT_USER.id,
        userName: CURRENT_USER.name,
        userAvatar: CURRENT_USER.avatar,
        type: 'love'
      },
      {
        userId: 'user_2',
        userName: 'Alejandro Morales',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        type: 'wow'
      }
    ],
    comments: [
      {
        id: 'c_1',
        authorId: 'user_2',
        authorName: 'Alejandro Morales',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        content: '¡Qué toma tan espectacular Elena! ¿Qué lente utilizaste para capturar los reflejos en el agua?',
        timestamp: 'Hace 15 min',
        likesCount: 6,
        isLiked: true,
        userReaction: 'love',
        reactions: { like: 3, love: 2, care: 1, haha: 0, wow: 0, sad: 0, angry: 0 },
        reactionsList: [
          { userId: 'user_1', userName: 'Elena Rostova', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', type: 'love' },
          { userId: 'user_3', userName: 'Sofía Valenzuela', userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', type: 'care' },
          { userId: 'user_4', userName: 'Marcos Benítez', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', type: 'like' },
          { userId: 'user_5', userName: 'Valentina Silva', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', type: 'like' }
        ],
        replies: [
          {
            id: 'c_1_r1',
            authorId: 'user_1',
            authorName: 'Elena Rostova',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
            replyToUserId: 'user_2',
            replyToUserName: 'Alejandro Morales',
            content: '¡Muchas gracias Alex! Usé un 24-70mm f/2.8 con filtro polarizador circular. ¡Hace toda la diferencia!',
            timestamp: 'Hace 10 min',
            likesCount: 3,
            isLiked: false,
            userReaction: 'like',
            reactions: { like: 2, love: 1, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
            reactionsList: [
              { userId: 'user_2', userName: 'Alejandro Morales', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', type: 'love' },
              { userId: 'user_5', userName: 'Valentina Silva', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', type: 'like' }
            ]
          }
        ]
      },
      {
        id: 'c_2',
        authorId: 'user_3',
        authorName: 'Sofía Valenzuela',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        content: 'Definitivamente 100% equipo montaña. Esos tonos de verde son inspiradores para un proyecto arquitectónico 😍',
        timestamp: 'Hace 8 min',
        likesCount: 4,
        isLiked: false,
        userReaction: null,
        reactions: { like: 2, love: 2, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        reactionsList: [
          { userId: 'user_1', userName: 'Elena Rostova', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', type: 'love' },
          { userId: 'user_2', userName: 'Alejandro Morales', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', type: 'like' }
        ],
        replies: []
      }
    ],
    sharesCount: 18,
    isSaved: true,
  },
  {
    id: 'post_2',
    authorId: CURRENT_USER.id,
    authorName: CURRENT_USER.name,
    authorUsername: CURRENT_USER.username,
    authorAvatar: CURRENT_USER.avatar,
    authorVerified: true,
    timestamp: 'Hace 2 horas',
    privacy: 'public',
    content: 'Lanzando oficialmente la nueva arquitectura modular de Conecta Radar en Vue 3. Ahora con separación estricta en módulos independientes, vinculación de imágenes vía HTML y todas las interacciones de Facebook (reacciones, historias, comentarios). ¡Comenta qué te parece! 📡💚 #ConectaRadar #Vue3 #ModularApp',
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Radar Tech Hub, Madrid',
    feeling: {
      emoji: '🚀',
      text: 'entusiasmado'
    },
    reactions: {
      like: 128,
      love: 64,
      care: 21,
      haha: 3,
      wow: 45,
      sad: 0,
      angry: 0,
    },
    userReaction: 'like',
    reactionsList: [
      {
        userId: 'user_1',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        type: 'love'
      }
    ],
    comments: [
      {
        id: 'c_2_1',
        authorId: 'user_5',
        authorName: 'Valentina Silva',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        content: '¡La fluidez de Vue 3 con la arquitectura por features quedó fantástica Carlos! Felicidades 👏🎉',
        timestamp: 'Hace 1 hora',
        likesCount: 12,
        isLiked: true,
      }
    ],
    sharesCount: 32,
    isSaved: false,
  },
  {
    id: 'post_3',
    authorId: 'user_2',
    authorName: 'Alejandro Morales',
    authorUsername: 'alexmorales',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    authorVerified: false,
    timestamp: 'Hace 4 horas',
    privacy: 'friends',
    content: 'Diseñando la arquitectura del radar de conexiones en tiempo real. Cuando combinas interfaces fluidas, diseño limpio y respuesta táctil, la experiencia social cobra vida propia. ¿Quién más está programando hoy? ☕👨‍💻',
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Valencia Tech District',
    feeling: {
      emoji: '💻',
      text: 'productivo'
    },
    reactions: {
      like: 48,
      love: 19,
      care: 5,
      haha: 1,
      wow: 7,
      sad: 0,
      angry: 0,
    },
    reactionsList: [],
    comments: [
      {
        id: 'c_3_1',
        authorId: 'user_4',
        authorName: 'Marcos Benítez',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        content: '¡Ese setup con café de especialidad es el combo definitivo! Saludos desde Bilbao.',
        timestamp: 'Hace 3 horas',
        likesCount: 2,
        isLiked: false,
      }
    ],
    sharesCount: 5,
    isSaved: false,
  }
];

export const INITIAL_STORIES = [
  {
    id: 'story_current',
    authorId: CURRENT_USER.id,
    authorName: 'Tu historia',
    authorAvatar: CURRENT_USER.avatar,
    hasUnseen: false,
    items: [
      {
        id: 's_c1',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80',
        textContent: 'Configurando el nuevo radar de conexiones 📡⚡',
        createdAt: 'Hace 1 hora',
      }
    ]
  },
  {
    id: 'story_1',
    authorId: 'user_1',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    hasUnseen: true,
    items: [
      {
        id: 's_1_1',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80',
        textContent: 'Amanecer en las montañas alpinas. ¡La luz es increíble hoy! 🏔️✨',
        createdAt: 'Hace 2 horas',
      },
      {
        id: 's_1_2',
        type: 'text',
        textContent: 'Próxima parada: Lago di Braies. ¿Alguna recomendación de senderos?',
        backgroundColor: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        textColor: '#ffffff',
        createdAt: 'Hace 30 minutos',
      }
    ]
  },
  {
    id: 'story_2',
    authorId: 'user_2',
    authorName: 'Alejandro Morales',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    hasUnseen: true,
    items: [
      {
        id: 's_2_1',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1080&q=80',
        textContent: 'Sesión de código nocturna con café filtrado ☕💻',
        createdAt: 'Hace 4 horas',
      }
    ]
  },
  {
    id: 'story_3',
    authorId: 'user_3',
    authorName: 'Sofía Valenzuela',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    hasUnseen: true,
    items: [
      {
        id: 's_3_1',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1080&q=80',
        textContent: 'Inaugurando nuevo estudio bioclimático en Sevilla 🌿📐',
        createdAt: 'Hace 5 horas',
      }
    ]
  },
  {
    id: 'story_5',
    authorId: 'user_5',
    authorName: 'Valentina Silva',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    hasUnseen: false,
    items: [
      {
        id: 's_5_1',
        type: 'text',
        textContent: '¡Alerta de brunch! Si están cerca del centro de Madrid, el café en Gran Vía está 10/10 🥐',
        backgroundColor: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
        textColor: '#ffffff',
        createdAt: 'Hace 6 horas',
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n_1',
    actorName: 'Elena Rostova',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    targetPreview: 'reaccionó "Me encanta" a tu publicación: "Lanzando oficialmente la nueva arquitectura..."',
    timestamp: 'Hace 12 min',
    isRead: false,
  },
  {
    id: 'n_2',
    actorName: 'Marcos Benítez',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    type: 'radar_match',
    targetPreview: 'está en tu radar a menos de 350m de distancia.',
    timestamp: 'Hace 30 min',
    isRead: false,
  },
  {
    id: 'n_3',
    actorName: 'Valentina Silva',
    actorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    type: 'comment',
    targetPreview: 'comentó: "¡La fluidez de Vue 3 con la arquitectura por features..."',
    timestamp: 'Hace 1 hora',
    isRead: true,
  },
  {
    id: 'n_4',
    actorName: 'Alejandro Morales',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    type: 'story',
    targetPreview: 'añadió una nueva foto a su historia.',
    timestamp: 'Hace 2 horas',
    isRead: true,
  }
];

export const INITIAL_CHATS = [
  {
    id: 'chat_1',
    participant: MOCK_USERS[0],
    unreadCount: 1,
    messages: [
      {
        id: 'm_1',
        senderId: 'user_1',
        text: '¡Hola Carlos! Vi la nueva publicación del radar de conexiones, está brutal.',
        timestamp: '14:20',
      },
      {
        id: 'm_2',
        senderId: CURRENT_USER.id,
        text: '¡Hola Elena! Muchas gracias, ahora la app está construida en Vue 3 modular por features.',
        timestamp: '14:22',
      },
      {
        id: 'm_3',
        senderId: 'user_1',
        text: '¡Quedó perfecto! ¿Nos vemos el martes en el meetup de creadores?',
        timestamp: '14:25',
      }
    ]
  },
  {
    id: 'chat_2',
    participant: MOCK_USERS[1],
    unreadCount: 0,
    messages: [
      {
        id: 'm_2_1',
        senderId: 'user_2',
        text: 'Ey Carlos, ¿probaste la reactividad de Pinia con los composables?',
        timestamp: 'Ayer',
      },
      {
        id: 'm_2_2',
        senderId: CURRENT_USER.id,
        text: 'Sí, la velocidad de respuesta en Vue 3 es ultra suave.',
        timestamp: 'Ayer',
      }
    ]
  }
];
