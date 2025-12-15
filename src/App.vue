<template>
  <div class="ta-root-wrap">
     <div class="container-md ta-root-container">
      <div class="row align-items-start">

        <div class="col-md-2 py-4 px-0 d-none d-md-block mx-auto sticky-sidebar router-elem-slide-fadein">
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
import { onMounted, nextTick } from "vue"
import gsap from "gsap"
import { computed } from 'vue'
import { useRoute } from "vue-router"
import { useConfigStore } from '@/stores/config'
import { applyRandomTheme } from "@/scripts/utils"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import IntroOnlyLayout from "@/layouts/IntroOnlyLayout.vue"
import IntroductionBar from "@/components/IntroductionBar.vue"

const configStore = useConfigStore()
const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta.layout || "default"
  switch (layout) {
    case "introOnly": return IntroOnlyLayout
    default: return DefaultLayout
  }
})

onMounted(async () => {
  await nextTick()

  const loader = document.getElementById("app-loader")
  if (loader) {
    const fill = loader.querySelector(".loader-line-fill")
    const percent = loader.querySelector(".status-percent")
    const text = loader.querySelector(".status-text")
    const slideFadein = document.querySelectorAll(".router-elem-slide-fadein")
    
    const tl = gsap.timeline({
      onComplete: () => {
        loader.remove();
      }
    })

    tl.to(fill, {
      width: "100%", 
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: function() {
        const p = Math.round(this.progress() * 100)
        if(percent) percent.innerText = p < 100 ? `0${p}%`.slice(-3) : "OK"
      }
    })
    
    tl.to(text, {
      duration: 0.1,
      // text: "DONE.",
      onStart: () => { if(text) text.innerText = "DONE." }
    })

    tl.to(".loader-container", {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in"
    }, ">0.5")

    tl.to(loader, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut"
    }, ">0.5")


    if (slideFadein.length > 0) {
      tl.fromTo(slideFadein, 
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.inOut"
      }, "<0.2")
    }

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
