import { createRouter, createWebHistory } from "vue-router"
import { initializeApp } from '@/utils/startup'
import { usePostStore } from '@/stores/post'

const Home = () => import("@/views/Home.vue")
const Post = () => import("@/views/Post.vue")
const Archive = () => import("@/views/Archive.vue")
const Timeline = () => import("@/views/Timeline.vue")
const PostNavigator = () => import("@/components/post/PostNavigator.vue")

const siteTitle = import.meta.env.VITE_SITE_TITLE || 'My Blog';
const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: Home,
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
      default: Archive,
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
      default: Timeline,
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
      default: Post,
      postNavigator: PostNavigator
    },
    props: {
      default: true,
      postNavigator: true
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