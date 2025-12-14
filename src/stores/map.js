import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    mapData: null,
  }),

  actions: {
    async load() {
      if (!this.mapData) {
        const res = await fetch('/config_processed/map.json')
        this.mapData = await res.json()
      }
    },

    getValue(key) {
      return this.mapData?.[key] ?? null
    }
  },
})
