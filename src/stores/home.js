import { defineStore } from 'pinia'
import { marked } from 'marked'

export const useHomeStore = defineStore('home', {
  state: () => ({
    post: null,
  }),

  actions: {
    async load(sourcePath) {
      if (!this.post) {
        const res = await fetch(sourcePath)
        const mdText = await res.text()
        this.post = marked.parse(mdText)
      }
    },
  },

  getters: {
    content: (state) => state.post ?? 'NONE',
  }
})