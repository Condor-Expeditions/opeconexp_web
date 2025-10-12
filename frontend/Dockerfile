# Dockerfile para Condor Expeditions Frontend

# Etapa de construcción
FROM node:18-alpine as builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY astro.config.mjs ./
COPY tailwind.config.mjs ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src
COPY public ./public

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine as production

# Instalar herramientas adicionales si es necesario
RUN apk add --no-cache curl

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx personalizada
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

# Crear directorio para archivos estáticos adicionales
RUN mkdir -p /usr/share/nginx/html/assets

# Configurar permisos
RUN chown -R nginx:nginx /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Usuario no-root
USER nginx

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]