import { createRouter, createWebHistory } from "vue-router"
import { initializeApp } from '@/scripts/utils'
import { usePostStore } from '@/stores/post'

const HomePage = () => import("@/views/HomePage.vue")
const PostPage = () => import("@/views/PostPage.vue")
const IndexPage = () => import("@/views/IndexPage.vue")
const TimelinePage = () => import("@/views/TimelinePage.vue")
const IndexBar = () => import("@/components/IndexBar.vue")

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