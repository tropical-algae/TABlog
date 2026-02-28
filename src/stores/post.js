import { defineStore } from "pinia"

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
        this.currentPage = 1
      }
    },
    unselectTag(tag) {
      if (this.selectedTags.includes(tag)) {
        this.selectedTags = this.selectedTags.filter(_tag => _tag !== tag)
        this.currentPage = 1
      }
    },
    async fetchPostAndParse(title) {
      const post = this.getPostByTitle(title);
      if (!post) throw new Error("Post not found");

      const slugPath = `${post.dir}\\${post.slug}`;
      const res = await fetch(slugPath);
      const mdText = await res.text();
      const [ { marked }, { default: katexExt } ] = await Promise.all([
        import("marked"),
        import("@/utils/mdKatex.js")
      ]);
      marked.use(katexExt());
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

// import { defineStore } from "pinia"
// import { ref, computed } from 'vue'

// export const usePostStore = defineStore("post", () => {
//   // --- State ---
//   const posts = ref([]) // 初始化为数组防止报错
//   const sortedPosts = ref([])
//   const tags = ref([])
//   const selectedTags = ref([])
//   const currentPage = ref(1)
//   const currentHtml = ref("")

//   // --- Getters (Computed) ---
//   const getFilteredPosts = computed(() => {
//     // 增加安全判断
//     if (!sortedPosts.value) return []
//     if (selectedTags.value.length === 0) {
//       return sortedPosts.value
//     }
//     return sortedPosts.value.filter(post =>
//       post.tags?.some(tag => selectedTags.value.includes(tag))
//     )
//   })

//   const getFilteredPaginatedPosts = computed(() => (pageSize) => {
//     const start = (currentPage.value - 1) * pageSize
//     const end = start + pageSize
//     return getFilteredPosts.value.slice(start, end)
//   })

//   const getFilteredPages = computed(() => (pageSize) => {
//     if (!getFilteredPosts.value.length) return 1
//     return Math.ceil(getFilteredPosts.value.length / pageSize)
//   })

//   const getAllTags = computed(() => tags.value)

//   const getPostByTitle = computed(() => (title) => {
//     return posts.value.find(p => p.title === title) || null
//   })

//   const getRelatedPosts = computed(() => (title = "", limit = 8) => {
//     // 内部调用计算属性函数记得加 .value
//     const post = getPostByTitle.value(title)
//     if (!post) return []

//     const tagsList = post.tags || []
//     return tagsList
//       .map(tag => {
//         const titles = posts.value
//           .filter(p => p.tags.includes(tag) && p.title !== title)
//           .map(p => p.title)
//           .slice(0, limit)

//         return titles.length > 0 ? { tag, titles } : null
//       })
//       .filter(item => item !== null)
//   })

//   const groupByYearMonth = computed(() => {
//     if (!sortedPosts.value || sortedPosts.value.length === 0) return []

//     const grouped = {}
//     sortedPosts.value.forEach(post => {
//       if (!post.created_time) return
//       const date = new Date(post.created_time)
//       const year = date.getFullYear()
//       const month = date.getMonth() + 1

//       if (!grouped[year]) grouped[year] = {}
//       if (!grouped[year][month]) grouped[year][month] = []
//       grouped[year][month].push(post)
//     })

//     return Object.keys(grouped)
//       .sort((a, b) => b - a)
//       .map(year => ({
//         year: Number(year),
//         months: Object.keys(grouped[year])
//           .sort((a, b) => b - a)
//           .map(month => ({
//             month: Number(month),
//             posts: grouped[year][month]
//           }))
//       }))
//   })

//   // --- Actions ---
//   const load = async (sourcePath) => {
//     // 注意判断逻辑使用 .value
//     if (posts.value.length === 0) {
//       const res = await fetch(sourcePath)
//       const data = await res.json()
      
//       posts.value = data.map(p => {
//         if (p.created_time) {
//           const [y, m, d] = p.created_time.split("-")
//           p.created_time = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
//         }
//         return p
//       })

//       tags.value = [...new Set(posts.value.flatMap(post => post.tags))].sort()
      
//       sortedPosts.value = [...posts.value].sort(
//         (a, b) => new Date(b.created_time || 0) - new Date(a.created_time || 0)
//       )
//     }
//   }

//   const selectTag = (tag) => {
//     if (!selectedTags.value.includes(tag)) {
//       selectedTags.value.push(tag) // 使用 .value.push
//       currentPage.value = 1
//     }
//   }

//   const unselectTag = (tag) => {
//     if (selectedTags.value.includes(tag)) {
//       selectedTags.value = selectedTags.value.filter(_tag => _tag !== tag)
//       currentPage.value = 1
//     }
//   }
  
//   const fetchPostAndParse = async (title) => {
//     const post = getPostByTitle.value(title) // 加 .value
//     if (!post) throw new Error("Post not found")

//     // 建议使用正斜杠，兼容性更好
//     const slugPath = `${post.dir}/${post.slug}`
//     const res = await fetch(slugPath)
//     const mdText = await res.text()
    
//     const [ { marked }, { default: katexExt } ] = await Promise.all([
//       import("marked"),
//       import("@/utils/mdKatex.js")
//     ])
    
//     marked.use(katexExt())
//     currentHtml.value = marked.parse(mdText) // 加 .value
//   }

//   return {
//     posts,
//     sortedPosts,
//     tags,
//     selectedTags,
//     currentPage,
//     currentHtml,
//     // 将计算属性暴露出去，UI里访问 timeGroupPosts 就会得到归档数据
//     timeGroupPosts: groupByYearMonth, 
//     getFilteredPosts,
//     getFilteredPaginatedPosts,
//     getFilteredPages,
//     getAllTags,
//     getPostByTitle,
//     getRelatedPosts,
//     load,
//     selectTag,
//     unselectTag,
//     fetchPostAndParse
//   }
// })