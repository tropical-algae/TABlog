import '@/assets/css/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { initializeApp } from '@/scripts/globalInit'

const app = createApp(App)
app.use(createPinia())
app.use(router)

initializeApp().then(() => {
  app.mount('#app')
})
