<template>
  <div class="w-100">
    <div class="px-md-4 px-3 pt-4 m-0 d-flex flex-column min-full-height">
      <div class="flex-grow-1 d-flex flex-column">
        <RouterView v-slot="{ Component }">
          <component :is="Component" :key="$route.fullPath" class="flex-grow-1"/>
        </RouterView>
      </div>
      <TheFooter/>
    </div>
  </div>
</template>

<script setup>
import TheFooter from "@/components/layout/TheFooter.vue"
</script>