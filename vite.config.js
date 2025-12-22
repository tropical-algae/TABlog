import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());
  const isCI = process.env.GITHUB_ACTIONS === 'true';
  console.log("ci:", isCI, "env:", env)

  return {
    plugins: [
      vue(),
      vueDevTools(),
      svgLoader(),
      visualizer({ open: !isCI, filename: 'stats.html' })
    ],
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_WEB_PORT) || 8000,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})

