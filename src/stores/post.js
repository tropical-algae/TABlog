import { defineStore } from "pinia"
import { marked } from "marked";
import katexExtension from "@/scripts/mdKatex.js";

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: null,
    sortedPosts: null,
    timeGroupPosts: null,
    tags: null,
    selectedTags: [],
    currentPage: 1,
    currentHtml: ""
  }),

  actions: {
    async load(sourcePath) {
      if (!this.posts) {
        const res = await fetch(sourcePath)
        this.posts = (await res.json()).map(p => {
          if (p.created_time) {
            // 补齐日期格式
            const [y, m, d] = p.created_time.split("-")
            p.created_time = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
          }
          return p
        })
        this.tags = [...new Set(this.posts.flatMap(post => post.tags))].sort()
        this.sortedPosts = [...this.posts].sort(
          (a, b) => new Date(b.created_time || 0) - new Date(a.created_time || 0)
        )
        this.timeGroupPosts = this.groupByYearMonth
      }
    },
    selectTag(tag) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag)
      }
    },
    unselectTag(tag) {
      this.selectedTags = this.selectedTags.filter(_tag => _tag !== tag)
    },
    async fetchPostAndParse(title) {
      const post = this.getPostByTitle(title);
      if (!post) throw new Error("Post not found");

      const slugPath = `${post.dir}\\${post.slug}`;
      const res = await fetch(slugPath);
      const mdText = await res.text();
      marked.use(katexExtension());
      this.currentHtml = marked.parse(mdText);
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
      return (title = "", limit = 8) => {
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
    },
    groupByYearMonth: (state) => {
      if (!state.sortedPosts) return {}
  
      const grouped = {}
  
      state.sortedPosts.forEach(post => {
        if (!post.created_time) return
  
        const date = new Date(post.created_time)
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // 月份 0-11，所以要 +1
  
        if (!grouped[year]) {
          grouped[year] = {}
        }
        if (!grouped[year][month]) {
          grouped[year][month] = []
        }
        grouped[year][month].push(post)
      })

      // 把年份和月份排序（降序）
      const sorted = Object.keys(grouped)
        .sort((a, b) => b - a) // 年份从大到小
        .map(year => ({
          year: Number(year),
          months: Object.keys(grouped[year])
            .sort((a, b) => b - a) // 月份从大到小
            .map(month => ({
              month: Number(month),
              posts: grouped[year][month]
            }))
        }))
  
      return sorted
    }
  }
})

