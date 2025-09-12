<script setup>
import { onMounted } from 'vue'
import { useConfigStore } from '@/scripts/configStore'
import { applyGlobalStyle } from "@/scripts/webEffect"

const config = useConfigStore()

onMounted(async () => {
  applyGlobalStyle(config)
})

</script>

<template>
  <div class="main-page">
    <main class="main-body">
      <div class="container-md pt-5">
        <div class="row">

          <div class="left-bar col-md-2 pt-3 px-0 d-none d-md-block mx-auto">
            <RouterView v-slot="{ Component }" name="bar_left">
              <transition name="fade-comp" mode="out-in">
                <component :is="Component"/>
              </transition>
            </RouterView>
            <!-- <RouterView name="bar_left" /> -->
            <!-- <RouterView name="bar_left" v-slot="{ Component }">
              <component :is="Component" :introduction="config.introduction" />
            </RouterView> -->
          </div>

          <div class="col-10 col-md-8 px-4 mx-auto">
            <!-- <RouterView :key="$route.fullPath" /> -->
            <RouterView v-slot="{ Component }">
              <transition name="fade-comp" mode="out-in">
                <component :is="Component" :key="$route.fullPath" />
              </transition>
            </RouterView>
          </div>

          <div class="right-bar col-md-2 pt-3 px-2 d-none d-md-block mx-auto">
            <!-- <RouterView name="bar_right" /> -->
            <RouterView v-slot="{ Component }" name="bar_right">
              <transition name="fade-comp" mode="out-in">
                <component :is="Component" :key="$route.fullPath" />
              </transition>
            </RouterView>
          </div>
        </div>
        
      </div>
    </main>
    <div class="footer-bar">
      <RouterView v-slot="{ Component }" name="bar_bottom">
        <transition name="fade-footer" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </RouterView>
    </div>

  </div>

</template>

<style scoped>

</style>
