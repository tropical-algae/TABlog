<script setup>
import ActionBar from './ActionBar.vue';


const { title, clz, markdownHtml } = defineProps({
  "title": {
    type: String,
    required: true
  },
  "clz": {
    type: String,
    required: true
  },
  "markdownHtml": {
    type: String,
    required: true
  }
})

</script>

<template>
  <transition name="fade-slide" mode="out-in">
    <div v-if="markdownHtml" class="d-flex flex-column" >
      <div
        :class="[clz, ]"
        v-html="markdownHtml"
      ></div>
      <ActionBar />
    </div>
  </transition>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
  will-change: opacity, transform;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>