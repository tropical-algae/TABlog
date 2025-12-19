<template>
  <div class="ta-root-wrap">
     <div class="container-md ta-root-container">
      <div class="row align-items-start">

        <div class="col-md-2 col-0 py-4 px-0 d-none d-md-block mx-auto sticky-sidebar router-elem-slide-fadein">
          <IntroductionBar/>
        </div>

        <div class="col-md-10 col-12 px-0 mx-auto">
          <transition 
            :css="false" 
            mode="out-in" 
            @leave="onLeave" 
            @enter="(el, done) => onEnter(el, done, configStore)"
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
import gsap from "gsap"
import { onMounted, nextTick, computed } from "vue"
import { useRoute } from "vue-router"
import { useConfigStore } from "@/stores/config"
import { applyRandomTheme, preloadAllRouteChunks } from "@/scripts/utils"
import { onLoading, onEnter, onLeave } from "@/scripts/animation"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import IntroOnlyLayout from "@/layouts/IntroOnlyLayout.vue"
import IntroductionBar from "@/components/IntroductionBar.vue"

const route = useRoute()
const configStore = useConfigStore()

const layoutComponent = computed(() => {
  const layout = route.meta.layout || "default"
  switch (layout) {
    case "introOnly": return IntroOnlyLayout
    default: return DefaultLayout
  }
})

onMounted(async () => {
  await nextTick()
  await preloadAllRouteChunks()
  setTimeout(() => onLoading(), 500);
})

</script>
