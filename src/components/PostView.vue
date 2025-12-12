<script setup>
import ActionBar from '@/components/ActionBar.vue';


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
  <transition name="fade-post" mode="out-in">
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

</style>