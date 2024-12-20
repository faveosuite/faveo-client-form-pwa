import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/faveo-client-form-pwa/vueapp1/',
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'My Vue 3 App',
        short_name: 'Vue3App',
        description: 'My Vue 3 app with PWA support',
        theme_color: '#42b983',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/faveo-client-form-pwa/vueapp1/',
      },
      workbox: {
        globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /https:\/\/cdn.jsdelivr.net\/npm\/bootstrap@5.3.3\/dist\/css\/bootstrap.min.css/,
            handler: 'CacheFirst', // Cache and use from cache
            options: {
              cacheName: 'bootstrap-css-cache',
              expiration: {
                maxEntries: 5,
              },
            },
          },
          {
            urlPattern: /https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/6.7.2\/css\/all.min.css/,
            handler: 'CacheFirst', // Cache and use from cache
            options: {
              cacheName: 'font-awesome-cache',
              expiration: {
                maxEntries: 5,
              },
            },
          },
          {
            urlPattern: /https:\/\/code.jquery.com\/jquery-3.7.1.min.js/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jquery-cache',
              expiration: {
                maxEntries: 5,
              },
            },
          },
          {
            urlPattern: /https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/popper.js\/2.9.2\/umd\/popper.min.js/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'popper-cache',
              expiration: {
                maxEntries: 5,
              },
            },
          },
          {
            urlPattern: /https:\/\/cdn.jsdelivr.net\/npm\/bootstrap@5.3.3\/dist\/js\/bootstrap.bundle.min.js/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bootstrap-js-cache',
              expiration: {
                maxEntries: 5,
              },
            },
          },
        ],
      },
      manifestFilename: 'manifest.json',
      filename: 'sw.js',
    }),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'chunks/[name].js',
        entryFileNames: 'entry/[name].js',
      },
    },
  },
});
