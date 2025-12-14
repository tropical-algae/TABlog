import { createRouter, createWebHistory } from "vue-router"

import HomePage from '@/views/HomePage.vue'
import PostPage from "@/views/PostPage.vue"
import IndexPage from "@/views/IndexPage.vue"
import TimelinePage from "@/views/TimelinePage.vue"

import IndexBar from "@/components/IndexBar.vue"

import { initializeApp } from '@/scripts/utils'
import { usePostStore } from '@/stores/post'

const title = import.meta.env.VITE_SITE_TITLE || 'My Blog';
const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: HomePage,
    },
    meta: {
      "layout": "introOnly",
      "title": title
    }
  },
  {
    path: "/index",
    name: "Index",
    components: {
      default: IndexPage,
    },
    meta: {
      "layout": "introOnly",
      "title": 'Index - ' + title
    }
  },
  {
    path: "/timeline",
    name: "Timeline",
    components: {
      default: TimelinePage,
    },
    meta: {
      "layout": "introOnly",
      "title": 'Timeline - ' + title
    }
  },
  {
    path: "/post/:title",
    name: "Post",
    components: {
      default: PostPage,
      indexBar: IndexBar
    },
    props: {
      default: true,
      indexBar: true
    },
    meta: {
      "layout": "default",
      "title": 'Post - ' + title
    },
    beforeEnter: async (to, from, next) => {
      const postStore = usePostStore()
      try {
        await postStore.fetchPostAndParse(to.params.title)
        next()
      } catch (err) {
        console.error(err)
        next()
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title
  await initializeApp()
  next()
})

export default router