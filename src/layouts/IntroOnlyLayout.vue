<template>
  <div class="w-100">
    <div class="px-md-4 px-3 pt-4 m-0 d-flex flex-column min-vh-100 h-auto">
      <div class="flex-grow-1 router-elem-fade">
        <RouterView v-slot="{ Component }">
          <component :is="Component" :key="$route.fullPath" />
        </RouterView>
      </div>
      <FooterBar/>
    </div>
  </div>
</template>

<script setup>
import FooterBar from "@/components/FooterBar.vue"
</script>