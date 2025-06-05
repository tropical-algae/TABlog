import '@/assets/css/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { useConfigStore, usePostStore } from '@/scripts/configStore'


import App from './App.vue'
import router from './router'


const app = createApp(App)
app.use(createPinia())
app.use(router)
// app.mount('#app')

const config = useConfigStore()
const postIndex = usePostStore()

Promise.all([
  config.loadConfig(),
  postIndex.loadPosts()
]).then(() => {
  app.mount('#app')
})
