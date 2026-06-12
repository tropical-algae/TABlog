import { createRouter, createWebHistory } from 'vue-router'
import { initializeApp } from '@/utils/startup'
import { usePostStore } from '@/stores/post'
import { beginPageReady } from '@/utils/pageReady'
import { beginPageMotion } from '@/utils/pageMotion'

const Home = () => import('@/views/Home.vue')
const Post = () => import('@/views/Post.vue')
const Archive = () => import('@/views/Archive.vue')
const Timeline = () => import('@/views/Timeline.vue')
const NotFound = () => import('@/views/NotFound.vue')
const PostNavigator = () => import('@/components/post/PostNavigator.vue')

const siteTitle = import.meta.env.VITE_SITE_TITLE || 'My Blog'
const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home
    },
    meta: {
      layout: 'introOnly',
      title: siteTitle
    }
  },
  {
    path: '/archive',
    name: 'Archive',
    components: {
      default: Archive
    },
    meta: {
      layout: 'introOnly',
      title: 'Archive - ' + siteTitle
    }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    components: {
      default: Timeline
    },
    meta: {
      layout: 'introOnly',
      title: 'Timeline - ' + siteTitle
    }
  },
  {
    path: '/post/:title',
    name: 'Post',
    components: {
      default: Post,
      postNavigator: PostNavigator
    },
    props: {
      default: true,
      postNavigator: true
    },
    meta: {
      layout: 'default',
      title: 'Post - ' + siteTitle
    },
    beforeEnter: async (to) => {
      const postStore = usePostStore()
      if (!postStore.getPostByTitle(to.params.title)) {
        return { name: 'NotFound', query: { from: to.fullPath } }
      }

      return true
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      layout: 'introOnly',
      title: '404 - ' + siteTitle
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => ({ name: 'NotFound', query: { from: to.fullPath } })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  beginPageReady(to.fullPath)
  beginPageMotion(to.fullPath)
  document.title = to.meta.title || siteTitle
  await initializeApp()
  next()
})

export default router
