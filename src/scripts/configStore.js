import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    config: null,
    loaded: false,
  }),

  actions: {
    async loadConfig() {
      if (this.loaded) return
      const resRoot = import.meta.env.VITE_CONFIG_ROOT || '/config'
      const res = await fetch(`${resRoot}/app.json`)
      this.config = await res.json()
      this.loaded = true
    },
  },

  getters: {
    title: (state) => state.config?.title || 'NONE',
    subTitle: (state) => state.config?.sub_title || 'NONE',
    introduction: (state) => state.config?.introduction || 'NONE',
    colors: (state) => state.config?.colors || [
        {
            "--color-bg": "rgba(0, 61, 123, 0.779)",
            "--color-primary": "rgb(255, 177, 88)",
            "--color-primary-alt": "rgb(245, 209, 168)",
            "--color-accent": "#003f5c",
            "--color-accent-alt": "#ffffff"
        }
    ],
    mdLables: (state) => state.config?.md_lables || {
      "create_time": "create_time",
      "labels": "labels"
    },
    links: (state) => state.config?.links || {
      "github": "",
      "discord": "",
      "notion": "",
      "website": ""
    },
  }
})


export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    loaded: false,
  }),

  actions: {
    async loadPosts() {
      if (this.loaded) return
      const res = await fetch('/markdowns_processed/index.json')
      this.posts = await res.json()
      this.loaded = true
    },
  },

  getters: {
    // 按创建时间降序排序
    sortedByDate: (state) =>
      [...state.posts].sort((a, b) => new Date(b.create_time || 0) - new Date(a.create_time || 0)),

    // 所有标签合集（去重）
    allLabels: (state) => {
      const set = new Set()
      state.posts.forEach(p => p.labels.forEach(l => set.add(l)))
      return Array.from(set)
    },

    // 按标签分组
    groupedByLabel: (state) => {
      const groups = {}
      state.posts.forEach(post => {
        post.labels.forEach(label => {
          if (!groups[label]) groups[label] = []
          groups[label].push(post)
        })
      })
      return groups
    },
    getByTitle: (state) => (title) => {
      return state.posts.find(p => p.title === title) || null
    },
    relatedTitlesByLabel: (state) => (label) => {
      return state.posts
        .filter(p => p.labels.includes(label))
        .map(p => p.title)
    },
    relatedTitlesByLabels: (state) => (labelList) => {
      return state.posts
        .filter(post => post.labels.some(label => labelList.includes(label)))
        .map(post => post.title)
    }
  }
})