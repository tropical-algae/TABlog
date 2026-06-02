<template>
  <div class="full-screen-layout">
    <RouterView v-slot="{ Component }">
      <component :is="Component" :key="$route.fullPath" />
    </RouterView>
  </div>
</template>

<style scoped>
.full-screen-layout {
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
