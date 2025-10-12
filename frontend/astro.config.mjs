// astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact({
      compat: true  // Habilita la compatibilidad React-Preact solo para i18next
    }),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  output: 'static',
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  server: {
    host: true,
  },
  vite: {
    optimizeDeps: {
      include: ['preact', 'preact/hooks', '@preact/signals'],
    },
    ssr: {
      // Prevenir que i18next se procese en SSR
      noExternal: ['preact-i18next', 'i18next']
    }
  },
});