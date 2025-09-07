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
    mdLabels: (state) => state.config?.md_labels ?? {
      "created_time": "created_time",
      "tags": "tags"
    },
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
  }),

  actions: {
    async load(sourcePath) {
      if (!this.posts) {
        const res = await fetch(sourcePath)
        this.posts = await res.json()
      }
    },
  },

  getters: {
    // 按创建时间降序排序
    sortedByDate: (state) =>
      [...state.posts].sort((a, b) => new Date(b.created_time || 0) - new Date(a.created_time || 0)),
    // 所有标签合集（去重）
    allTags: (state) => {
      const set = new Set()
      state.posts.forEach(p => p.tags.forEach(l => set.add(l)))
      return Array.from(set)
    },
    // 按标签分组
    groupedByLabel: (state) => {
      const groups = {}
      state.posts.forEach(post => {
        post.tags.forEach(label => {
          if (!groups[label]) groups[label] = []
          groups[label].push(post)
        })
      })
      return groups
    },
    getByTitle: (state) => (title) => {
      return state.posts.find(p => p.title === title) || null
    },
    relatedTitlesByTags: (state) => (labelList, title = '') => {
      return labelList
        .map(label => {
          const titles = state.posts
            .filter(post => 
              post.tags.includes(label) && post.title !== title
            )
            .map(post => post.title)
    
          return titles.length > 0 ? { label, titles } : null
        })
        .filter(item => item !== null)
    }
  }
})