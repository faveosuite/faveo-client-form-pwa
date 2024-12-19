import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Adjust base path if necessary (use '/' if served from root)
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'My Vue 3 App',
        short_name: 'Vue3App',
        description: 'My Laravel + Vue 3 app with PWA support',
        theme_color: '#42b983',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
      workbox: {
        globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,woff,woff2}'],
      },
      manifestFilename: 'manifest.json',
    }),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js', // Ensure Vue is correctly bundled for Vite
    },
  },
  build: {
    emptyOutDir: true,  // Clear the output directory before build
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'chunks/[name].js',
        entryFileNames: 'entry/[name].js',
      },
    },
  },
})
