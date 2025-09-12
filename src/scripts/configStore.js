import { defineStore } from 'pinia'
import { marked } from 'marked'


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

export const useHomePost = defineStore('home', {
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
    isDynamicFooter: (state) => state.config?.dynamic_footer ?? true,
    colors: (state) => state.config?.colors ?? [
        {
            "--color-bg": "rgba(0, 61, 123, 0.779)",
            "--color-bg-opaque": "rgb(0, 61, 123)",
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

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: null,
    sortedPosts: null,
    tags: null,
    selectedTags: [],
    currentPage: 1,
  }),

  actions: {
    async load(sourcePath) {
      if (!this.posts) {
        const res = await fetch(sourcePath)
        this.posts = await res.json()
        this.tags = [...new Set(this.posts.flatMap(post => post.tags))].sort()
        this.sortedPosts = [...this.posts].sort(
          (a, b) => new Date(b.created_time || 0) - new Date(a.created_time || 0)
        )
      }
    },
    selectTag(tag) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag)
      }
    },
    unselectTag(tag) {
      this.selectedTags = this.selectedTags.filter(_tag => _tag !== tag)
    }
  },

  getters: {
    getFilteredPosts: (state) => {
      // 如果没选任何标签，返回排序后的所有 post
      if (state.selectedTags.length === 0) {
        return state.sortedPosts
      }
      // 否则返回至少包含一个选中标签的 post
      return state.sortedPosts.filter(post =>
        post.tags?.some(tag => state.selectedTags.includes(tag))
      )
    },
    getFilteredPaginatedPosts: (state) => (pageSize) => {
      const start = (state.currentPage - 1) * pageSize
      const end = start + pageSize
      return state.getFilteredPosts.slice(start, end)
    },
    getFilteredPages: (state) => (pageSize) => {
      if (!state.getFilteredPosts.length) return 1
      return Math.ceil(state.getFilteredPosts.length / pageSize)
    },
    getAllTags: (state) => { return state.tags },
    getPostByTitle: (state) => (title) => {
      return state.posts.find(p => p.title === title) || null
    },
    getRelatedPosts(state) {
      return (title = '', limit = 8) => {
        const post = this.getPostByTitle(title)
        if (!post) return []

        const tags = post.tags || []
        return tags
          .map(tag => {
            const titles = state.posts
              .filter(p => p.tags.includes(tag) && p.title !== title)
              .map(p => p.title)
              .slice(0, limit)

            return titles.length > 0 ? { tag, titles } : null
          })
          .filter(item => item !== null)
      }
    }
  }
})