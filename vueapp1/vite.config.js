import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE');
  return {
    base: env.VITE_ROOT || '/',
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
          start_url: process.env.APP_ROOT || '/',
        },
        workbox: {
          globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,woff,woff2}']
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
  }
});
