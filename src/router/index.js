import { createRouter, createWebHistory } from "vue-router"
import { useConfigStore } from '@/scripts/configStore'

import HomePage from '@/views/HomePage.vue'
import PostPage from "@/views/PostPage.vue"
import IndexPage from "@/views/IndexPage.vue"
import TimelinePage from "@/views/TimelinePage.vue"

import EntityBar from "@/views/components/EntityBar.vue"
import IndexBar from "@/views/components/IndexBar.vue"
import FooterBar from "@/views/components/FooterBar.vue"
import IntroductionBar from "@/views/components/IntroductionBar.vue"

import { applyRandomTheme } from "@/scripts/webEffect"
import { initializeApp } from '@/scripts/globalInit'

const title = import.meta.env.VITE_SITE_TITLE || 'My Blog';
const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: HomePage,
      bar_left: IntroductionBar,
      bar_right: EntityBar,
      bar_bottom: FooterBar
    },
    meta: {"title": title}
  },
  {
    path: "/index",
    name: "Index",
    components: {
      default: IndexPage,
      bar_left: IntroductionBar,
      bar_right: EntityBar,
      bar_bottom: FooterBar
    },
    meta: {"title": 'Index - ' + title}
  },
  {
    path: "/timeline",
    name: "Timeline",
    components: {
      default: TimelinePage,
      bar_left: IntroductionBar,
      bar_right: EntityBar,
      bar_bottom: FooterBar
    },
    meta: {"title": 'Timeline - ' + title}
  },
  {
    path: "/post/:title",
    name: "Post",
    components: {
      default: PostPage,
      bar_left: IntroductionBar,
      bar_right: IndexBar,
      bar_bottom: FooterBar
    },
    props: {
      default: true,
      // bar_left: true,
      bar_right: true
    },
    meta: {"title": 'Post - ' + title}
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title

  await initializeApp()
  const config = useConfigStore()

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      applyRandomTheme(config);
    })
  }else{
    applyRandomTheme(config);
  }
  next()
})

export default router