import '@/assets/styles/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { initializeApp } from '@/scripts/utils'
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

const app = createApp(App)
app.use(createPinia())
app.use(router)

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

initializeApp().then(() => {
  router.isReady().then(() => {
    app.mount('#app')
  })
})