import { createRouter, createWebHistory } from "vue-router"
import { initializeApp } from '@/scripts/utils'
import { usePostStore } from '@/stores/post'

const HomePage = () => import("@/views/HomePage.vue")
const PostPage = () => import("@/views/PostPage.vue")
const ArchivePage = () => import("@/views/ArchivePage.vue")
const TimelinePage = () => import("@/views/TimelinePage.vue")
const IndexBar = () => import("@/components/IndexBar.vue")

const siteTitle = import.meta.env.VITE_SITE_TITLE || 'My Blog';
const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: HomePage,
    },
    meta: {
      "layout": "introOnly",
      "title": siteTitle
    }
  },
  {
    path: "/archive",
    name: "Archive",
    components: {
      default: ArchivePage,
    },
    meta: {
      "layout": "introOnly",
      "title": 'Archive - ' + siteTitle
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
      "title": 'Timeline - ' + siteTitle
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
      "title": 'Post - ' + siteTitle
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
  {
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
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