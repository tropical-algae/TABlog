import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {

  const mapData = ref(null)

  const load = async () => {
    if (!mapData.value) { 
      const res = await fetch('/config_processed/map.json')
      mapData.value = await res.json() 
    }
  }

  const getValue = (key) => {
    return mapData.value?.[key] ?? null 
  }

  return {
    mapData,
    load,
    getValue
  }
})