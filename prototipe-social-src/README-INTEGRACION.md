# Socialgea — Integración de Frontend a prototipe-social

Esta carpeta contiene la implementación completa, optimizada y profesional del frontend de **Socialgea** lista para ser integrada en tu repositorio `prototipe-social`.

---

## 📁 Estructura del Paquete Generado

```text
prototipe-social-src/src/
├── context/
│   └── social/
│       ├── auth/                  # Vistas y componentes de autenticación
│       └── pages/                 # Vertical slicing de cada feature
│           ├── feed/              # Feed, PostCard, PostComposer, ReactionsModal, Comments
│           ├── profiles/          # Perfiles unificados (Android pantalla completa + Desktop)
│           ├── profile/           # Vistas de perfil individual
│           ├── shop/              # Premios y Recompensas (detalle estilo Amazon, Canje)
│           ├── stories/           # Historias de amigos (StoriesBar, StoryViewer, CreateStory)
│           ├── companies/         # Empresas de reciclaje aliadas
│           ├── explore/           # Radar de conexiones y solicitudes de amigos
│           ├── messages/          # Messenger flotante y chat
│           └── notifications/     # Centro de notificaciones
├── layout/
│   └── social/
│       ├── SocialLayout.vue       # Layout principal unificado
│       └── components/
│           ├── SocialNavbar.vue       # Barra superior (2 líneas en Android, dock limpio en Desktop)
│           ├── SocialSidebarLeft.vue  # Navegación izquierda fija (sin scroll propio)
│           ├── SocialSidebarRight.vue # Empresas patrocinadas y tendencias
│           ├── SocialMobileMenu.vue   # Cajón nativo a pantalla completa para Android
│           └── SocialDropdownProfile.vue
├── shared/
│   ├── components/                # BaseModal, BaseButton, MobileSearchModal, SafeImage
│   └── composables/               # useIsMobile, useBodyScrollLock
└── assets/
    └── styles/                    # Tokens, temas (green/blue), componentes y reset
```

---

## 🚀 Pasos de Copia Directa a tu Proyecto

Desde la raíz de tu proyecto `prototipe-social`:

```bash
# 1. Copiar el contexto social (páginas y features con vertical slicing)
cp -r /ruta/a/prototipe-social-src/src/context/social/* src/context/social/

# 2. Copiar los layouts de la red social
cp -r /ruta/a/prototipe-social-src/src/layout/social/* src/layout/social/

# 3. Copiar los componentes y composables compartidos
cp -r /ruta/a/prototipe-social-src/src/shared/components/BaseModal.vue src/shared/components/
cp -r /ruta/a/prototipe-social-src/src/shared/components/BaseButton.vue src/shared/components/
cp -r /ruta/a/prototipe-social-src/src/shared/components/MobileSearchModal.vue src/shared/components/
cp -r /ruta/a/prototipe-social-src/src/shared/composables/useIsMobile.js src/shared/composables/
cp -r /ruta/a/prototipe-social-src/src/shared/composables/useBodyScrollLock.js src/shared/composables/

# 4. Copiar los estilos globales y tokens
cp -r /ruta/a/prototipe-social-src/src/assets/styles/* src/assets/styles/
```

---

## ✨ Características Clave Implementadas

1. **Dual Render Android vs. Desktop (Regla de Oro)**:
   - En Android (< 640px) no hay modales flotantes: todo overlay es pantalla completa nativa (`fixed inset-0 100dvh`), con `Top App Bar` (`ArrowLeft`, título, `X`), barra de acciones fija abajo con `safe-area-pb`, y bloqueo de scroll con `useBodyScrollLock`.
   - En Desktop (≥ 640px) son diálogos modales centrados con desenfoque de fondo y bordes redondeados.
2. **Perfiles estilo Facebook**:
   - En Android se despliega como hoja blanca completa (`w-full min-h-screen bg-white`) con barra propia, eliminando doble navbar.
   - Fotos con icono exclusivo de cámara (sin texto).
   - Acceso directo a "+ Agregar a historia" (verde esmeralda) y "Editar perfil".
   - Tira de 4 amigos en círculos con "Ver todo" que abre `MobileFriendsModal.vue`.
3. **Premios y Recompensas (Marketplace de Economía Circular)**:
   - Detalle de premio estilo Amazon: foto principal + 3 miniaturas que intercambian la foto activa, ficha técnica y cálculo de impacto ambiental.
   - Botón Canjear inteligente: si faltan puntos, se deshabilita con candado `Lock` y el texto "Faltan pts"; si alcanzan, se habilita con botón ámbar oscuro (`#b45309`, contraste accesible 5.0:1) y abre `RedeemRewardModal.vue` generando comprobante `CANJE-XXXXXX`.
4. **Sistema de Estilos y Contraste**:
   - Cero utilidades apiladas en el HTML: todo con clases semánticas `sg-*` BEM y tokens CSS.
   - Tema verde esmeralda con contraste WCAG AA (≥ 4.5:1). Cambiable mediante `VITE_APP_THEME=green` o `blue`.
