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
import { useConfigStore } from "@/stores/config"
import { preloadAllRouteChunks, applyRandomTheme } from "@/utils/startup"
import { onLoading, onEnter, onLeave } from "@/utils/animation"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import FullScreenLayout from "@/layouts/FullScreenLayout.vue"
import IntroOnlyLayout from "@/layouts/IntroOnlyLayout.vue"
import ProfileSidebar from "@/components/layout/ProfileSidebar.vue"

const route = useRoute()
const configStore = useConfigStore()
const routerAnimClass = ".router-elem-fade"
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
  requestAnimationFrame(() => {
    applyRandomTheme(configStore)
  })
  onEnter(el, done, routerAnimClass);
}

const onRouterLeave = (el, done) => {
  onLeave(el, done, routerAnimClass);
}

onMounted(async () => {
  await nextTick()
  await preloadAllRouteChunks()
  setTimeout(() => onLoading(routerAnimClass), 500);
})

</script>
