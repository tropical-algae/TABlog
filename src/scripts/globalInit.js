import { useMapStore, useHomePost, useConfigStore, usePostStore } from '@/scripts/configStore'

let initPromise = null

export function initializeApp() {
  if (!initPromise) {
    const map = useMapStore()
    const homePost = useHomePost()
    const config = useConfigStore()
    const postIndex = usePostStore()

    initPromise = map.load().then(() => {
      return Promise.all([
        homePost.load(map.getValue('home')),
        config.load(map.getValue('app')),
        postIndex.load(map.getValue('index'))
      ])
    })
  }
  return initPromise
}
