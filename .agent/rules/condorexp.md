---
trigger: always_on
---

Actúa como un Senior Frontend Engineer y experto en UI/UX. Tu objetivo es desarrollar el nuevo sitio web para "Condor Expedition" en Cuenca, Ecuador. El sitio debe ser un funcional y estético de la plantilla Travlla, utilizando una arquitectura moderna, rápida y orientada a la conversión de aventuras y reservas.

1. Stack Tecnológico & Configuración
Framework: Astro (última versión estable).
Estilos: Tailwind CSS (configurado con bordes rounded-3xl y sombras suaves).
Iconos: lucide-astro para iconos limpios y modernos.
Fuentes: Usa @fontsource para:
Figtree o Inter: Para todo el cuerpo de texto y botones (moderno).
Kaushan Script: Exclusivamente para frases destacadas (ej. "Enjoy your life").

2. Design System (Estilo Travlla)
Paleta de Colores:
primary: #ff5e14 (Naranja vibrante de Travlla - Acción y Energía).
secondary: #1e3a8a (Azul profundo - Confianza).
background: #f8fafc (Gris ultra claro).
Componentes Visuales: Botones con gradientes, imágenes con bordes muy redondeados y tarjetas con efectos de hover sutiles.

3. Arquitectura de Componentes
Genera el código para los siguientes elementos clave:
A. src/components/BookingHero.astro
Banner principal con imagen de alta resolución.
Widget de Búsqueda Flotante: Un contenedor blanco con esquinas redondeadas que incluya: Destino/Habitación, Fecha de entrada, Fecha de salida y un botón naranja de "Consultar Disponibilidad".
B. src/components/ProductCard.astro
Componente reutilizable para Habitaciones y Tours.
Debe incluir: Imagen con overlay, Badge de precio ($0.00), título, rating de estrellas y lista de servicios con iconos (Wifi, AC, etc.).
C. src/pages/index.astro
Estructura que ensamble el Hero, el Grid de productos y una sección de "Gastronomía" con diseño bento (imágenes grandes y texto superpuesto).

4. Datos de Contacto y Footer
Deja los espacios listos para completar la información técnica de la siguiente manera:
Dirección: Gran Colombia 1-82 y Manuel Vega
Teléfono: 99 590 0614
Correo: reservas@condorexpedition.com
Ubicación: Cuenca, Ecuador.