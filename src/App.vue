<script setup>

const scrollToTop = () =>
  new Promise((resolve) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const checkScroll = () => {
      if (window.scrollY === 0) {
        resolve()
      } else {
        requestAnimationFrame(checkScroll)
      }
    }
    checkScroll()
  })

async function handleAfterLeave() {
  await scrollToTop()
}

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
            <transition name="main-body-fade-anime" mode="out-in" @before-enter="handleAfterLeave">
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
      <RouterView v-slot="{ Component }" name="bar_bottom">
        <transition name="main-body-fade-anime" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </RouterView>
    </div>
  </main>
  
</template>

<style scoped>

</style>
