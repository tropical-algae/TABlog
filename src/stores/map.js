import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchOk } from '@/utils/http'

export const useMapStore = defineStore('map', () => {

  const mapData = ref(null)

  const load = async () => {
    if (!mapData.value) { 
      const res = await fetchOk('/config_processed/map.json')
      mapData.value = await res.json() 
    }
  }

  const getValue = (key) => {
    return mapData.value?.[key] ?? null 
  }

  const reset = () => {
    mapData.value = null
  }

  return {
    mapData,
    load,
    getValue,
    reset
  }
})
