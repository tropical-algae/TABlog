import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());
  console.log("env:", env)

  return {
    plugins: [
      vue(),
      vueDevTools(),
      svgLoader(),
    ],
    server: {
      port: parseInt(env.VITE_WEB_PORT) || 8000,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})

