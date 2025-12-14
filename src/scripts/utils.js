import { useConfigStore } from '@/stores/config'
import { useHomeStore } from '@/stores/home'
import { useMapStore } from '@/stores/map'
import { usePostStore } from '@/stores/post'

let initPromise = null

export function applyRandomTheme(config) {
  const themes = config.colors
  if (!themes || themes.length === 0) return
  const theme = themes[Math.floor(Math.random() * themes.length)]

  for (const key in theme) {
    if (key.startsWith('--')) {
      document.documentElement.style.setProperty(key, theme[key])
      // document.querySelector('html').style.setProperty(key, theme[key])
    }
  }
}

export function initializeApp() {
  if (!initPromise) {
    const mapStore = useMapStore()
    const homeStore = useHomeStore()
    const configStore = useConfigStore()
    const postStore = usePostStore()

    initPromise = mapStore.load().then(() => {
      return Promise.all([
        homeStore.load(mapStore.getValue('home')),
        configStore.load(mapStore.getValue('app')),
        postStore.load(mapStore.getValue('index'))
      ])
    })
  }
  return initPromise
}
