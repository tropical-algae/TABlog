import { useConfigStore } from '@/stores/config'
import { useHomeStore } from '@/stores/home'
import { useMapStore } from '@/stores/map'
import { usePostStore } from '@/stores/post'

let initPromise = null

export function initializeApp() {
  if (!initPromise) {
    const mapStore = useMapStore()
    const homeStore = useHomeStore()
    const configStore = useConfigStore()
    const postStore = usePostStore()

    initPromise = mapStore
      .load()
      .then(async () => {
        const results = await Promise.allSettled([
          homeStore.load(mapStore.getValue('home')),
          configStore.load(mapStore.getValue('app')),
          postStore.load(mapStore.getValue('index'))
        ])
        const rejected = results.find((result) => result.status === 'rejected')
        if (rejected) throw rejected.reason
      })
      .catch((err) => {
        mapStore.reset()
        homeStore.reset()
        configStore.reset()
        postStore.reset()
        initPromise = null
        throw err
      })
  }
  return initPromise
}

export function preloadAllRouteChunks() {
  const preloadModules = [
    () => import('@/views/Home.vue'),
    () => import('@/views/Post.vue'),
    () => import('@/views/Archive.vue'),
    () => import('@/views/Timeline.vue'),
    () => import('@/components/post/PostNavigator.vue'),
    () => import('@/utils/mdKatex.js'),
    () => import('marked')
  ]
  const loadingPromises = preloadModules.map((loader) =>
    loader().catch((err) => {
      console.error('preload error:', err)
    })
  )
  return Promise.all(loadingPromises)
}

export function preloadRouteChunksWhenIdle() {
  const preload = () => {
    preloadAllRouteChunks()
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preload, { timeout: 3000 })
    return
  }

  window.setTimeout(preload, 1000)
}
