<script setup>
import FooterBar from '@/views/components/FooterBar.vue'
import { useConfigStore } from '@/scripts/configStore'
import { ref, onMounted } from 'vue'

const config = useConfigStore()

</script>

<template>
  <main class="d-flex flex-column min-vh-100 main-body">
    <div class="container-md flex-fill pt-5">
      <div class="row">
        
        <div class="left-bar col-md-3 pt-5 d-none d-md-block mx-auto">
          <router-view v-slot="{ Component }" name="bar_left">
            <transition name="fade-slide2" mode="out-in">
              <component :is="Component"/>
            </transition>
          </router-view>
          <!-- <router-view name="bar_left" /> -->
          <!-- <router-view name="bar_left" v-slot="{ Component }">
            <component :is="Component" :introduction="config.introduction" />
          </router-view> -->
        </div>

        <div class="col-10 col-md-7 mx-auto">
          <!-- <router-view :key="$route.fullPath" /> -->
          <router-view v-slot="{ Component }">
            <transition name="fade-slide2" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </transition>
          </router-view>
        </div>

        <div class="right-bar col-md-2 pt-5 d-none d-md-block mx-auto">
          <!-- <router-view name="bar_right" /> -->
          <router-view v-slot="{ Component }" name="bar_right">
            <transition name="fade-slide2" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </transition>
          </router-view>
        </div>
      </div>
      
    </div>
    <FooterBar />
  </main>
  
</template>

<style scoped>

.fade-slide2-enter-active, .fade-slide2-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide2-enter-from, .fade-slide2-leave-to {
  opacity: 0;
  /* transform: translateY(15px); */
}
.fade-slide2-enter-to, .fade-slide2-leave-from {
  opacity: 1;
  /* transform: translateY(0); */
}
</style>
