import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHomeStore = defineStore('home', () => {
  const post = ref(null)
  const content = computed(() => post.value ?? 'NONE')

  const load = async (sourcePath) => {
    if (!post.value) {
      const res = await fetch(sourcePath)
      const mdText = await res.text()
      
      const [{ marked }] = await Promise.all([
        import("marked"),
      ])
      
      post.value = marked.parse(mdText)
    }
  }

  return {
    post,
    content,
    load
  }
})