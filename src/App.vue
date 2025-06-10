<script setup>
import FooterBar from '@/views/components/FooterBar.vue'
import { useConfigStore } from '@/scripts/configStore'

const config = useConfigStore()

</script>

<template>
  <main class="main-body d-flex flex-column">
    <div class="main-contain container-md pt-5">
      <div class="row">
        
        <div class="left-bar col-md-3 pt-5 d-none d-md-block mx-auto">
          <RouterView v-slot="{ Component }" name="bar_left">
            <transition name="main-body-fade-anime" mode="out-in">
              <component :is="Component"/>
            </transition>
          </RouterView>
          <!-- <RouterView name="bar_left" /> -->
          <!-- <RouterView name="bar_left" v-slot="{ Component }">
            <component :is="Component" :introduction="config.introduction" />
          </RouterView> -->
        </div>

        <div class="col-10 col-md-7 mx-auto">
          <!-- <RouterView :key="$route.fullPath" /> -->
          <RouterView v-slot="{ Component }">
            <transition name="main-body-fade-anime" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </transition>
          </RouterView>
        </div>

        <div class="right-bar col-md-2 pt-5 d-none d-md-block mx-auto">
          <!-- <RouterView name="bar_right" /> -->
          <RouterView v-slot="{ Component }" name="bar_right">
            <transition name="main-body-fade-anime" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </transition>
          </RouterView>
        </div>
      </div>
      
    </div>
    <div class="bottom-bar">
      <FooterBar />
    </div>
  </main>
  
</template>

<style scoped>
.main-body-fade-anime-enter-active, 
.main-body-fade-anime-leave-active {
  transition: opacity 0.2s ease;
  will-change: opacity;
}
.main-body-fade-anime-enter-from, 
.main-body-fade-anime-leave-to {
  opacity: 0;
  /* transform: translateY(15px); */
}
.main-body-fade-anime-enter-to, 
.main-body-fade-anime-leave-from {
  opacity: 1;
  /* transform: translateY(0); */
}
</style>
