import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss"; @import "@/assets/styles/index.scss";',
        },
      },
    },
    // server: {
    //   proxy: {
    //     '/proxy': {
    //       target: env.VITE_BASE_URL,
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/proxy/, '')
    //     }
    //   }
    // }
  };
});
