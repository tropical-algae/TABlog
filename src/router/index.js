import { createRouter, createWebHistory } from "vue-router"
import { useConfigStore } from '@/scripts/configStore'

import HomePage from '@/views/HomePage.vue'
import EntityBar from "@/views/components/EntityBar.vue"
import IndexBar from "@/views/components/IndexBar.vue"
import IntroductionBar from "@/views/components/IntroductionBar.vue"
import IndexPage from "@/views/IndexPage.vue"
import PostPage from "@/views/PostPage.vue"
import { applyRandomTheme } from "@/scripts/webEffect"
import FooterBar from "@/views/components/FooterBar.vue"


const routes = [
    {
        path: "/",
        name: "Home",
        components: {
            default: HomePage,
            bar_left: IntroductionBar,
            bar_right: EntityBar,
            bar_bottom: FooterBar
        }
    },
    {
        path: "/index",
        name: "Index",
        components: {
            default: IndexPage,
            bar_left: IntroductionBar,
            bar_right: EntityBar,
            bar_bottom: FooterBar
        }
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
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
  const config = useConfigStore()

  if (!config.config){
    await config.loadConfig();
  }

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