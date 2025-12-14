import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    config: null,
  }),

  actions: {
    async load(sourcePath) {
      if (!this.config) {
        const res = await fetch(sourcePath)
        this.config = await res.json()
      }
    },
  },

  getters: {
    title: (state) => state.config?.title ?? 'NONE',
    subTitle: (state) => state.config?.sub_title ?? 'NONE',
    introduction: (state) => state.config?.introduction ?? 'NONE',
    colors: (state) => state.config?.colors ?? [
        {
            "--color-bg": "rgb(0, 61, 123)",
            "--color-primary": "rgb(255, 177, 88)",
            "--color-primary-alt": "rgb(245, 209, 168)",
            "--color-accent": "#003f5c",
            "--color-accent-alt": "#ffffff"
        }
    ],
    labelMap: (state) => state.config?.label_map ?? {
      "created_time": "created_time",
      "tags": "tags"
    },
    pageSize: (state) => state.config?.page_size ?? 12,
    links: (state) => state.config?.links ?? {
      "github": "",
      "discord": "",
      "notion": "",
      "website": ""
    },
  }
})
