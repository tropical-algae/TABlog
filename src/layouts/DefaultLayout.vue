<template>
  <div class="container-md w-100">
    <div class="row align-items-start">
      <div class="col-md-9 col-10 pt-4 px-4 mx-auto d-flex flex-column min-vh-100 h-auto">
        <div class="flex-grow-1 router-elem-fade">
          <RouterView v-slot="{ Component }">
            <component :is="Component" :key="$route.fullPath" />
          </RouterView>
        </div>
        <FooterBar/>
      </div>
      <div class="col-md-3 py-4 px-0 d-none d-md-block mx-auto router-elem-fade sticky-sidebar">
         <RouterView v-slot="{ Component }" name="indexBar">
          <component :is="Component" :key="$route.fullPath" />
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup>
import FooterBar from "@/components/FooterBar.vue"
</script>