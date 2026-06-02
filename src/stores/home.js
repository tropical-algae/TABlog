import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchOk } from '@/utils/http'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

export const useHomeStore = defineStore('home', () => {
  const post = ref(null)
  const content = computed(() => post.value ?? 'NONE')

  const load = async (sourcePath) => {
    if (!post.value) {
      const res = await fetchOk(sourcePath)
      const mdText = await res.text()
      
      const [{ marked }] = await Promise.all([
        import("marked"),
      ])
      
      post.value = sanitizeHtml(marked.parse(mdText))
    }
  }

  const reset = () => {
    post.value = null
  }

  return {
    post,
    content,
    load,
    reset
  }
})
