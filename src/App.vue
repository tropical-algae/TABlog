<template>
  <div class="ta-root-wrap">
     <div class="container-md ta-root-container">
      <div class="row align-items-start">

        <div class="col-md-2 py-4 px-0 d-none d-md-block mx-auto sticky-sidebar">
          <IntroductionBar/>
        </div>

        <div class="col-md-10 px-0 mx-auto">
  
          <transition 
            :css="false" 
            mode="out-in" 
            @leave="onLeave" 
            @enter="onEnter"
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
import IntroductionBar from "@/components/IntroductionBar.vue"

import { computed } from 'vue'
import { useRoute } from "vue-router"
import { useConfigStore } from '@/stores/config'
import { applyRandomTheme } from "@/scripts/utils"

import DefaultLayout from "@/layouts/DefaultLayout.vue"
import IntroOnlyLayout from "@/layouts/IntroOnlyLayout.vue"

const configStore = useConfigStore()
const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta.layout || "default"
  switch (layout) {
    case "introOnly": return IntroOnlyLayout
    default: return DefaultLayout
  }
})

const onLeave = (el, done) => {
  const fadeout = el.querySelectorAll(".router-elem-fade")
  
  if (fadeout.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ onComplete: done })
  tl.to(fadeout, {
    opacity: 0,
    duration: 0.7,
    stagger: 0,
    ease: "power4.inOut"
  })
}

const onEnter = async (el, done) => {
  requestAnimationFrame(() => {
    applyRandomTheme(configStore)
  })

  const fadein = el.querySelectorAll(".router-elem-fade")
  const slideFadein = el.querySelectorAll(".router-elem-slide-fadein")

  if (fadein.length === 0 && slideFadein.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ onComplete: done })

  if (fadein.length > 0) {
    tl.fromTo(fadein, 
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: "power2.out"
    })
  }

  if (slideFadein.length > 0) {
    tl.fromTo(slideFadein, 
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.inOut"
    }, "<0.1")
  }
}
</script>
