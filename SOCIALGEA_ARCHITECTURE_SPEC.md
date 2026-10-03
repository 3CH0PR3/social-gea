# SOCIALGEA — ESPECIFICACIÓN ARQUITECTÓNICA Y REGLAS DE DISEÑO

> **Instrucciones para el Agente / Configuración de Socialgea**
> Este documento contiene todas las directrices, reglas de negocio y patrones arquitectónicos establecidos por el usuario para la plataforma **Socialgea**. Consúltese como referencia obligatoria en cada iteración y desarrollo de componentes.

---

## 1. Identidad de la Plataforma
* **Nombre oficial**: **Socialgea** (nunca "Conecta", "Conecta Radar" ni nombres temporales).
* **Esencia de la red**: Red social ecológica y comunitaria basada en la economía circular, donde los usuarios conectan con amigos, se afilian a empresas recicladoras, clasifican materiales recuperables (PET, cartón, RAEE, vidrio) y acumulan **EcoPuntos** para canjear por premios reales.
* **Ámbito geográfico principal**: Colombia (departamentos, municipios y ciudades principales como Bogotá D.C., Medellín, Cali, Barranquilla, Bucaramanga).

---

## 2. Regla Fundamental de Modales: Dualidad Android vs. Desktop
* **En Android / Mobile Web (`< 640px` o viewport móvil)**:
  * **PROHIBIDO mostrar cuadros modales flotantes o popups con márgenes y fondo oscuro.**
  * En Android la aplicación debe comportarse como una **aplicación nativa a pantalla completa**.
  * Todos los modales deben ser **componentes montados con `Teleport to="body"`** que ocupen el 100% de la ventana: `fixed inset-0 z-50 w-full h-[100dvh] bg-white flex flex-col overflow-hidden`.
  * Deben incluir una barra de aplicación superior nativa (`Top App Bar`) con:
    * Botón de retroceso táctil (`ArrowLeft`).
    * Título del componente.
    * Botón de cerrar (`X`).
  * El scroll del fondo del documento (`document.body`) debe bloquearse estrictamente con `useBodyScrollLock`. No debe existir doble scroll ni desplazamientos extraños del fondo.
  * La barra de acciones (`Confirmar`, `Canjear`) debe ser una barra fija inferior pegada al borde inferior (`safe-area-pb`).
* **En Desktop (`>= 640px` / PC y Mac)**:
  * Se renderizan como **diálogos modales flotantes clásicos y elegantes**, centrados horizontal y verticalmente en el viewport (`sm:fixed sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4 sm:bg-black/60 sm:backdrop-blur-xs`), con esquinas redondeadas (`sm:rounded-2xl`), borde fino y sombra amplia.

---

## 3. Componentes Específicos con Comportamiento Dual Renderizado
* **Reacciones y Likes (`ReactionsModal.vue`)**:
  * En Desktop: Modal flotante centrado con pestañas de reacciones (Like, Love, Care, Haha) y lista con scroll.
  * En Android: Pantalla completa nativa (`h-[100dvh]`), barra de retroceso, pestañas en píldoras horizontales deslizables, buscador desplegable y lista de usuarios con badges de reacción y botón de conectar.
* **Detalle del Premio (`RewardDetailModal.vue`)**:
  * En Desktop: Modal de 2 columnas estilo Amazon (galería a la izquierda con foto principal + fila de 3 miniaturas interactivas; columna derecha con impacto ecológico, ficha técnica y botón de canje).
  * En Android: Pantalla completa (`h-[100dvh]`), foto principal, selector de 3 miniaturas, especificaciones y barra inferior de canje.
* **Proceso y Ticket de Canje (`RedeemRewardModal.vue`)**:
  * En Desktop: Diálogo flotante centrado con verificación de puntos, formulario y comprobante con ticket digital.
  * En Android: Pantalla completa nativa con el paso a paso, código de retiro monoespaciado y confirmación.
* **Comentarios y Publicación (`PostCommentsModal.vue`, `PostComposer.vue`)**:
  * En Desktop: Diálogos flotantes o cajones.
  * En Android: Vista nativa a pantalla completa o bottom sheet sin desbordamiento de scroll.

---

## 4. Barra Lateral Izquierda (Menú de Navegación Principal)
* **Amigos**:
  * Nombre: **Amigos** (sin la palabra "radar").
  * Icono limpio `Users` de 20px en color esmeralda.
  * **Sin** etiqueta de "En vivo", **sin** animaciones de radar (`animate-spin`, `animate-ping`).
* **Premios y Recompensas**:
  * Enlace al catálogo de canjes: **Premios y Recompensas** con icono `Gift`.
* **Filtros Funcionales de Contenido**:
  * En lugar de bloques decorativos inactivos, contiene accesos directos funcionales que filtran las publicaciones: *Todas las publicaciones*, *#Naturaleza & Paisajes*, *#Tecnología & Innovación*, *Guardados*.
* **Comportamiento de Scroll**:
  * **El aside izquierdo NO debe tener scroll interno propio.**
  * Debe permanecer anclado con `sticky top-18 select-none` y sin `overflow-y-auto`. Únicamente se desplaza el contenido central de la página.

---

## 5. Barra Lateral Derecha (Publicidad y Patrocinios)
* **Retiro del Radar de Proximidad**:
  * Eliminado el widget de "4 amigos cerca de ti" y el radar interactivo.
* **Empresas Patrocinadas (Lógica de Negocio Socialgea)**:
  * Espacio comercial monetizado para empresas que pagan por visibilidad en el feed a nivel Colombia.
  * Muestra empresas destacadas con foto, enlace web oficial, ciudad y descripción (ej. *EcoPack Colombia S.A.S*, *Café Andino Gourmet*).
* **Directorio de Reciclaje**:
  * Acceso directo al directorio de empresas de recolección aliadas.
* **Tendencias**:
  * Titulado **"Tendencias en Socialgea"** con temas sostenibles y de tecnología.
* **Comportamiento de Scroll**:
  * **El aside derecho NO debe tener scroll propio.** Es fijo mediante `sticky top-18 select-none`.

---

## 6. Tarjetas de Publicaciones en el Feed (`PostCard.vue`)
* **Hover Box-Shadow**:
  * **PROHIBIDO el efecto de sombra flotante brusca (`box-shadow`) al hacer hover en las tarjetas de posts.**
  * Las tarjetas deben conservar un acabado limpio, plano y estable (`border: 1px solid var(--border-default)` con `box-shadow: var(--shadow-card)` estático, sin saltos visuales).

---

## 7. Módulo de "Premios y Recompensas" (Marketplace)
* **Lógica de Negocio y EcoPuntos**:
  1. El usuario se registra en una empresa de reciclaje aliada (ej. *Recicladora Metropolitana*, *Antioquia Circular*).
  2. El usuario entrega y clasifica kilos de material recuperable (PET transparente, cartón, chatarra RAEE, vidrio).
  3. La empresa aliada le acredita **EcoPuntos** en su cuenta (ej. *18.5 kg de PET = +370 Pts*).
  4. Los puntos se acumulan en el saldo global del usuario.
  5. En el catálogo de premios, cada producto tiene su costo en EcoPuntos, su equivalencia comercial en COP y su equivalencia de reciclaje (*"🌱 Equivale a 20 kg de PET"*).
* **Catálogo de Productos**:
  * Debe ser variado y cubrir necesidades reales:
    * **Electrodomésticos y Cuidado Personal**: Planchas de cabello cerámicas iónicas, secadores de pelo eco-power, neveras compactas/minibares A+++, freidoras de aire de bajo consumo, microondas, licuadoras.
    * **Tecnología**: Monitores LED reacondicionados, smartwatches con métricas eco, audífonos con plástico marino, parlantes solares.
    * **Hogar y Jardinería**: Composteras domésticas giratorias, kits de siembra urbana, maceteros de plástico reciclado HDPE, termos de acero inoxidable.
    * **Movilidad Sostenible y Upcycling**: Bicicletas urbanas restauradas, mesas auxiliares de maderas recuperadas.
* **Interacción Estilo Amazon en las Tarjetas**:
  * Al hacer clic en cualquier tarjeta del catálogo se abre la vista detallada (`RewardDetailModal.vue`).
  * En primera plana se muestra la foto principal y **debajo 3 botones de miniaturas** que al tocarlos cambian la foto activa en detalle.
  * Al lado se visualizan especificaciones técnicas, impacto ecológico, empresa proveedora y opciones de entrega.
* **Seguridad y Bloqueo del Botón de Canje**:
  * **Si el usuario NO tiene suficientes puntos para el producto**:
    * El botón de canje en la tarjeta debe estar **inhabilitado por seguridad (`:disabled="true"`)**, con estilo desactivado (`bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed`), icono de candado (`Lock`) y texto `"Faltan pts"`.
    * En el modal de detalle el botón de canje también permanece inhabilitado, indicando cuántos puntos le faltan exactamente al usuario.
  * **Si el usuario SÍ tiene suficientes puntos**:
    * El botón se muestra habilitado en color ámbar (`bg-amber-500 hover:bg-amber-600 active:scale-95 text-white cursor-pointer`) y permite proceder al proceso de canje.
* **Proceso de Canje (Sin abrir chats)**:
  * El canje no abre Messenger ni chats privados. Abre directamente la UI de canje (`RedeemRewardModal.vue`).
  * Permite elegir entre **Retiro en centro de acopio afiliado** o **Envío a domicilio nacional**.
  * Genera un comprobante oficial con código único de canje (`CANJE-XXXXXX`) con botón para copiarlo.
  * Deduce los puntos del saldo del usuario en tiempo real.

---

## 8. Botones y Dimensiones Visuales
* **Botón Canjear en la tarjeta**:
  * Ni demasiado delgado ni excesivamente ancho: dimensiones refinadas de `px-3 py-1.5`, altura estándar `min-h-[32px]`, tipografía `text-xs font-bold rounded-lg`.
* **Botones en el Aside de Premios**:
  * Los botones de acción rápida en el menú lateral (como *"Me alcanza"*) deben coincidir en altura y padding con el botón de la tarjeta (`px-3 py-1.5 min-h-[32px] rounded-lg`).
* **Filtros de Categorías en el Aside**:
  * Separados armónicamente con `space-y-1.5`.
  * Botones con ancho completo, tipografía `text-xs font-semibold`, fondo blanco con borde suave en estado inactivo y fondo ámbar con sombra suave en estado activo.

---

## 9. Normalización Tipográfica y Responsive (Desktop vs. Android)
* **Títulos de tarjetas y secciones**: `text-sm font-bold text-slate-900`.
* **Textos principales de cuerpo**: `text-xs leading-relaxed text-slate-600`.
* **Subtítulos y metadatos secundarios**: `text-[11px] text-slate-500` o `text-[10px] uppercase tracking-wider`.
* **Badges y píldoras de estado**: `text-[10px] font-bold px-2 py-0.5 rounded-md`.
* **Botones de acción**: `text-xs font-bold`.
* Mantener consistencia estricta en ambas plataformas sin saltos tipográficos desproporcionados.

---

## 10. Sistema de Navegación Móvil en Android Estilo Facebook
* **Eliminación Total de la Barra Inferior (`MobileBottomNav`)**:
  * En Android **NO existe menú o barra de navegación en la parte inferior**.
  * No hay `pb-16` en el contenedor raíz ni botones abajo. Todo se gestiona en la parte superior.
* **Barra de Navegación Superior en Android (2 Líneas)**:
  * **Línea 1 (Cabecera Principal)**:
    * Izquierda: Marca oficial **`socialgea`** en tipografía display negrita minúscula.
    * Derecha: Dos botones circulares idénticos al estilo de la app nativa de Facebook:
      1. Botón redondo de **Búsqueda** (`Search`).
      2. Botón redondo de **Menú de Hamburguesa** (`Menu`, 3 líneas horizontales).
  * **Línea 2 (6 Pestañas Superiores de Navegación Inmediata)**:
    1. **Feed**: Icono `Home`, acceso a `/feeds`, indicador inferior verde al estar activo.
    2. **Amigos**: Icono `Users`, acceso a `/radar`, indicador inferior al estar activo.
    3. **Mensajes**: Icono `MessageCircle` (Messenger) con badge de mensajes no leídos.
    4. **Empresas**: Icono `Building2` (directorio de centros de reciclaje, en lugar de icono de reproductor/video).
    5. **Notificaciones**: Icono `Bell` con contador circular rojo (`unreadNotifs`).
    6. **Marketplace**: Icono `Store` (Premios y Recompensas Socialgea).
* **Pantalla de Menú Desplegable en Android (`MobileMenuDrawer.vue`)**:
  * Al presionar el botón de hamburguesa se abre una pantalla completa nativa (`h-[100dvh]` con `Teleport to="body"`):
    * **Cabecera**: `< Menú` con flecha de retroceso y botón de búsqueda a la derecha.
    * **Tarjeta de Perfil**: Foto del usuario, nombre completo, enlace *"Ver tu perfil"* y chevron desplegable.
    * **Grilla de 2 Columnas de Accesos Directos**: Tarjetas redondeadas con iconos coloridos:
      - *Mensajes*, *Grupos*, *Amigos*, *Historias*, *Marketplace (Premios)*, *Empresas de Reciclaje*, *Guardado*, *Recuerdos*, *EcoPuntos & Retos*, *Feeds*.
    * **Sección Inferior**: Acordeón de *Configuración y privacidad*, *Ayuda y soporte*, y *Cerrar sesión*.

---

## 11. Vista de Perfil y Sistema de Búsqueda en Android Estilo Facebook
* **Hoja Blanca a Pantalla Completa en Android (Sin Doble Navbar ni Cajas Exteriores)**:
  * El perfil en Android NO es un modal ni una tarjeta dentro de un contenedor con padding: es un componente renderizado directamente en una hoja blanca limpia (`w-full min-h-screen bg-white`).
  * En Android se **oculta completamente el navbar superior de Socialgea** (`hidden sm:block`) al estar en la ruta `/profiles`, eliminando el doble navbar y permitiendo que la barra superior propia del perfil (`<- Carlos Méndez`) sea la única activa.
  * El contenedor principal en `App.vue` elimina márgenes y paddings (`p-0`) en móvil para la ruta de perfil, sin cajas grises alrededor ni espacios vacíos al final.
* **Barra de Navegación del Perfil en Android**:
  * Botón de retroceso `<` a la izquierda.
  * Nombre del perfil centrado / truncado.
  * Botones derechos:
    1. Icono de lápiz / editar (`Edit3`).
    2. **Icono de lupa / búsqueda de personas (`Search`)**: Utiliza exactamente el mismo componente unificado `MobileSearchModal.vue` que el navbar.
    3. Icono de tres puntos (`MoreHorizontal`).
* **Fotos con Icono de Cámara Exclusivo (Sin Texto)**:
  * Portada con botón circular negro translúcido con icono de cámara (`Camera`) en la esquina inferior derecha. Prohibido texto como "Editar portada".
  * Foto de perfil circular solapada con botón circular negro translúcido con icono de cámara (`Camera`) en la esquina inferior derecha. Prohibido texto.
* **Datos Principales del Perfil**:
  * Nombre en negrita.
  * Contador de amigos y publicaciones (ej. `468 amigos · 83 publicaciones`).
  * Botones de acción principales:
    * `+ Agregar a historia` (azul/esmeralda).
    * `Editar perfil` (gris claro con icono de lápiz).
  * Exclusiones explícitas: Prohibido "Restringiste tu perfil" y prohibido "Lo más destacado".
* **Sección de Datos Personales y Empleo**:
  * *Datos personales*: Ciudad actual y ciudad natal (ej. *Vive en Huston / Bogotá*, *De San Francisco, Zulia*).
  * *Empleo*: Empresa, cargo (ej. *Desarrollo de Software FullStack*) y fecha de inicio.
* **Sección de Amigos con Círculos Pequeños y "Ver todo"**:
  * Muestra 4 amigos en círculos pequeños en una fila horizontal con su nombre y amigos en común.
  * Enlace `Ver todo`: Abre la pantalla completa `MobileFriendsModal.vue` montada con `Teleport to="body"`, con buscador de amigos en tiempo real, pestañas de amigos y botón de opciones `•••`.
* **Componente de Búsqueda Global en Android (`MobileSearchModal.vue`)**:
  * Diseñado según la vista nativa de Facebook (`facebook.com/search/`):
    * Barra superior con flecha de regreso e input `Buscar...`.
    * Lista de **Recientes** con avatares, nombres, actualizaciones y términos de búsqueda previos con icono de reloj.
    * Sección de **Personas que quizá conozcas** con tarjetas de sugerencias y botón directo de "Conectar".
    * Búsqueda en vivo en tiempo real al escribir cualquier nombre.


