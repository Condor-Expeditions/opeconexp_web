# Condor Expeditions Frontend

Frontend moderno para la plataforma de turismo Condor Expeditions construido con Astro + Preact.

## 🚀 Características

- **Astro 3.0** - Framework moderno para sitios web rápidos
- **Preact** - Alternativa ligera a React para componentes interactivos
- **Tailwind CSS** - Framework CSS utility-first
- **TypeScript** - Tipado estático para mejor desarrollo
- **Responsive Design** - Optimizado para móviles y escritorio
- **SEO Optimizado** - Meta tags y estructura semántica
- **PWA Ready** - Listo para funcionar como aplicación web progresiva

## 🛠 Stack Tecnológico

### Frontend
- **Astro** - Framework principal para páginas estáticas
- **Preact** - Para componentes interactivos
- **React** - Para funcionalidades avanzadas (opcional)
- **Tailwind CSS** - Estilos y diseño responsivo
- **TypeScript** - Tipado estático

### Librerías Adicionales
- **Axios** - Cliente HTTP para llamadas a API
- **React Hook Form** - Manejo de formularios
- **React Hot Toast** - Notificaciones elegantes
- **Lucide Icons** - Iconos modernos
- **Swiper** - Carruseles y sliders
- **React Calendar** - Componentes de calendario
- **Framer Motion** - Animaciones fluidas
- **Zustand** - Manejo de estado ligero

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── TourCard.tsx    # Card de tour
│   │   ├── BookingForm.tsx # Formulario de reserva
│   │   └── ...
│   ├── layouts/            # Layouts de página
│   │   ├── BaseLayout.astro # Layout principal
│   │   └── AdminLayout.astro # Layout administrativo
│   ├── pages/              # Páginas de Astro
│   │   ├── index.astro     # Página principal
│   │   ├── tours.astro     # Listado de tours
│   │   ├── tour/[id].astro # Detalle de tour
│   │   └── ...
│   └── lib/                # Utilidades y servicios
│       ├── api.ts          # Servicio de API
│       └── utils.ts        # Funciones auxiliares
├── public/                 # Archivos estáticos
├── astro.config.mjs        # Configuración de Astro
├── tailwind.config.mjs     # Configuración de Tailwind
├── tsconfig.json          # Configuración de TypeScript
└── package.json           # Dependencias
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- **Node.js 18+**
- **npm** o **yarn**

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

### Configuración de Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# URL de la API backend
PUBLIC_API_URL=http://localhost:8000/api/v1

# Configuración de Stripe (si aplica)
PUBLIC_STRIPE_KEY=pk_test_...

# Configuración de PayPal (si aplica)
PUBLIC_PAYPAL_CLIENT_ID=...
```

## 📱 Características del Frontend

### Páginas Principales

- **Inicio** - Hero section, tours destacados, testimonios
- **Tours** - Listado con filtros y búsqueda
- **Detalle de Tour** - Información completa, galería, reservas
- **Comunidades** - Información sobre comunidades locales
- **Galería 360°** - Tours virtuales y panoramas
- **Perfil de Usuario** - Gestión de cuenta y reservas
- **Proceso de Reserva** - Formulario multi-paso
- **Dashboard Administrativo** - Gestión completa del negocio

### Componentes Interactivos

- **TourCard** - Card de tour con hover effects
- **BookingForm** - Formulario de reserva con validación
- **ImageGallery** - Galería de imágenes con lightbox
- **Calendar** - Selector de fechas para tours
- **PaymentForm** - Formulario de pago seguro
- **ReviewSection** - Sistema de reseñas y calificaciones
- **ChatSupport** - Chat de soporte en tiempo real

### Funcionalidades Avanzadas

- **Búsqueda inteligente** con filtros avanzados
- **Mapa interactivo** con ubicación de tours
- **Comparador de tours** para ayudar en la decisión
- **Sistema de favoritos** para guardar tours preferidos
- **Notificaciones push** para actualizaciones importantes
- **Modo offline** para consultar información guardada

## 🎨 Diseño y UX

### Tema Visual

- **Colores principales**:
  - Primary: Azul (#2563eb)
  - Secondary: Verde (#16a34a)
  - Accent: Púrpura (#c026d3)

- **Tipografía**:
  - Principal: Inter (sans-serif)
  - Secundaria: Playfair Display (serif)

- **Responsive breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Experiencia de Usuario

- **Navegación intuitiva** con menú claro
- **Tiempo de carga optimizado** con Astro
- **Accesibilidad completa** (WCAG 2.1)
- **Animaciones sutiles** para mejor interacción
- **Feedback visual** para todas las acciones

## 🔧 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run start        # Alias para dev

# Producción
npm run build        # Construir sitio estático
npm run preview      # Preview de producción

# Utilidades
npm run astro        # Ejecutar comandos de Astro
```

### Estructura de Componentes

#### Componentes de Preact

Los componentes interactivos están construidos con Preact:

```tsx
// Ejemplo de componente TourCard
export default function TourCard({ tour, onBook }: TourCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={clsx(
      "bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300",
      isHovered && "transform scale-105"
    )}>
      {/* Contenido del componente */}
    </div>
  );
}
```

#### Páginas de Astro

Las páginas principales usan Astro para máximo rendimiento:

```astro
---
// Página de tours
import BaseLayout from '../layouts/BaseLayout.astro';
import TourCard from '../components/TourCard.tsx';

const tours = await fetchTours();
---

<BaseLayout title="Tours - Condor Expeditions">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Nuestros Tours</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tours.map(tour => (
        <TourCard tour={tour} client:load />
      ))}
    </div>
  </div>
</BaseLayout>
```

## 🚢 Despliegue

### Opciones de Despliegue

#### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en el dashboard de Vercel
```

#### Netlify
```bash
# Construir sitio
npm run build

# Desplegar la carpeta dist
```

#### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔒 Seguridad

- **CSP (Content Security Policy)** configurado
- **HTTPS obligatorio** en producción
- **Validación de formularios** en cliente y servidor
- **Sanitización de datos** de usuario
- **Protección contra XSS** y CSRF

## 📊 Performance

- **Lighthouse Score** objetivo: 95+
- **Core Web Vitals** optimizados
- **Lazy loading** de imágenes
- **Code splitting** automático
- **Caching inteligente** de recursos

## 🤝 Contribución

### Guías de Desarrollo

1. **Componentes**: Usar Preact para interactividad
2. **Estilos**: Usar clases de Tailwind
3. **Páginas**: Usar Astro para contenido estático
4. **API**: Usar el servicio API centralizado
5. **Estado**: Usar Zustand para estado global

### Convenciones de Código

- **Nombres de archivos**: kebab-case para archivos, PascalCase para componentes
- **CSS**: Usar @apply de Tailwind para componentes reutilizables
- **TypeScript**: Tipar todas las props y funciones
- **Comentarios**: Documentar funciones complejas

## 📚 Recursos Adicionales

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Preact](https://preactjs.com/guide/v10/getting-started)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [API Backend Documentation](http://localhost:8000/api/docs)

## 🆘 Soporte

Para soporte técnico:
- Crear issue en el repositorio
- Contactar al equipo de frontend
- Revisar la documentación de Astro

---

**¡Gracias por contribuir al desarrollo de Condor Expeditions!** 🦅