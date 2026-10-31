/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Strikte Content-Security-Policy, alleen in de productiebuild (de dev-server injecteert
 * inline styles en een websocket die een strikte CSP zouden blokkeren).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self' data: blob:",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'fv-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      );
    },
  };
}

const isTest = process.env.VITEST === 'true';

export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '1.0.0'),
  },
  build: {
    target: 'es2022',
    // Geen data:-URI's voor fonts en assets: houdt de CSP strikt en de precache voorspelbaar.
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
  plugins: [
    react(),
    tailwindcss(),
    cspPlugin(),
    !isTest &&
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: ['icons/*.png', 'icons/*.svg'],
        manifest: {
          id: './',
          name: 'Proeftuin',
          short_name: 'Proeftuin',
          description:
            'Groenten verstoppen in familierecepten, aantikken wat je kind proefde en samen de groentevriendjes zien groeien.',
          lang: 'nl',
          dir: 'ltr',
          start_url: './',
          scope: './',
          display: 'standalone',
          orientation: 'any',
          background_color: '#FBF7F0',
          theme_color: '#FBF7F0',
          categories: ['food', 'kids', 'lifestyle'],
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            {
              src: 'icons/icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
          navigateFallback: 'index.html',
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        },
        devOptions: { enabled: false },
      }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    css: false,
  },
});
