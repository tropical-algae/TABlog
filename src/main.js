import '@/assets/css/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { useMapStore, useConfigStore, usePostStore } from '@/scripts/configStore'
import App from '@/App.vue'
import router from '@/router'


const app = createApp(App)
app.use(createPinia())
app.use(router)
// app.mount('#app')

const map = useMapStore()
const config = useConfigStore()
const postIndex = usePostStore()

Promise.all([
  map.loadMap(),
  config.loadConfig(),
  postIndex.loadPosts()
]).then(() => {
  app.mount('#app')
})
