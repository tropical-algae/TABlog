import '@/assets/styles/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { initializeApp } from '@/utils/startup'

const app = createApp(App)
app.use(createPinia())

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

const startupRetryDelay = 1500

function updateStartupStatus(textContent, percentContent) {
  const loader = document.getElementById("app-loader")
  if (!loader) return

  const text = loader.querySelector(".status-text")
  const percent = loader.querySelector(".status-percent")

  if (text) text.textContent = textContent
  if (percent) percent.textContent = percentContent
}

async function startApp() {
  let attempt = 0

  while (true) {
    try {
      await initializeApp()
      break
    } catch (err) {
      attempt += 1
      console.error(`[startup error] retry ${attempt}`, err)
      updateStartupStatus(`LOAD FAILED. RETRY ${attempt}...`, "ERR")
      await new Promise(resolve => setTimeout(resolve, startupRetryDelay))
    }
  }

  app.use(router)
  await router.isReady()
  app.mount('#app')
}

startApp()
