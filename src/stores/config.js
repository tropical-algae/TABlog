import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref(null)

  const title = computed(() => config.value?.title ?? 'NONE')
  const subTitle = computed(() => config.value?.sub_title ?? 'NONE')
  const introduction = computed(() => config.value?.introduction ?? 'NONE')
  const copyright = computed(() => config.value?.copyright ?? 
    '2026 powered by <a href="https://github.com/tropical-algae">tropical algae</a>\'s cat (Mia).'
  )
  const colors = computed(() => config.value?.colors ?? [
    {
      "--color-bg": "rgb(0, 61, 123)",
      "--color-primary": "rgb(255, 177, 88)",
      "--color-primary-alt": "rgb(245, 209, 168)",
      "--color-accent": "#003f5c",
      "--color-accent-alt": "#ffffff"
    }
  ])
  const labelMap = computed(() => config.value?.label_map ?? {
    "created_time": "created_time",
    "tags": "tags"
  })
  const pageSize = computed(() => config.value?.page_size ?? 12)
  const links = computed(() => config.value?.links ?? {
    "github": "",
    "discord": "",
    "notion": "",
    "website": ""
  })

  const load = async (sourcePath) => {
    if (!config.value) {
      const res = await fetch(sourcePath)
      config.value = await res.json()
    }
  }

  return {
    config,
    title,
    subTitle,
    introduction,
    copyright,
    colors,
    labelMap,
    pageSize,
    links,
    load
  }
})