<template>
  <div class="app-shell">
     <div :class="appContainerClass">
      <div class="row align-items-start">

        <div v-if="!isFullScreenLayout" class="col-md-2 col-0 py-4 px-0 d-none d-md-block mx-auto sticky-sidebar">
          <ProfileSidebar/>
        </div>

        <div :class="contentColumnClass">
          <transition
            :css="false"
            mode="out-in"
            @leave="onRouterLeave"
            @enter="onRouterEnter"
            @enter-cancelled="onRouterCancel"
            @leave-cancelled="onRouterCancel"
          >
            <component
              :is="layoutComponent"
              :key="route.fullPath"
            />
          </transition>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, computed } from "vue"
import { useRoute } from "vue-router"
import { preloadRouteChunksWhenIdle } from "@/utils/startup"
import { MOTION_CANCEL, MOTION_SCOPES, createMotionTransition, runInitialLoadMotion } from "@/utils/animation"
import { consumePageReady } from "@/utils/pageReady"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import FullScreenLayout from "@/layouts/FullScreenLayout.vue"
import IntroOnlyLayout from "@/layouts/IntroOnlyLayout.vue"
import ProfileSidebar from "@/components/layout/ProfileSidebar.vue"

const route = useRoute()
const routeMotion = createMotionTransition({
  scope: MOTION_SCOPES.route,
  scrollToTop: true,
  enter: {
    duration: 800,
    stagger: 110,
    maxStaggerItems: 8
  },
  leave: {
    duration: 280
  }
})
const isFullScreenLayout = computed(() => route.meta.layout === "fullScreen")
const appContainerClass = computed(() => [
  "app-main-layout",
  { "container-md": !isFullScreenLayout.value }
])
const contentColumnClass = computed(() => [
  "col-12",
  "px-0",
  "mx-auto",
  { "col-md-10": !isFullScreenLayout.value }
])

const layoutComponent = computed(() => {
  const layout = route.meta.layout || "default"
  switch (layout) {
    case "fullScreen": return FullScreenLayout
    case "introOnly": return IntroOnlyLayout
    default: return DefaultLayout
  }
})

const onRouterEnter = (el, done) => {
  routeMotion.enter(el, done, { ready: consumePageReady(route.fullPath) })
}

const onRouterLeave = (el, done) => {
  routeMotion.leave(el, done)
}

const onRouterCancel = (el) => {
  routeMotion.cancel(el, { mode: MOTION_CANCEL.preserve })
}

onMounted(async () => {
  await nextTick()
  await runInitialLoadMotion(MOTION_SCOPES.route, { ready: consumePageReady(route.fullPath) })
  preloadRouteChunksWhenIdle()
})

</script>
