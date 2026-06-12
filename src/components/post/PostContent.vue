<script setup>
const { clz, markdownHtml } = defineProps({
  clz: {
    type: String,
    required: true
  },
  markdownHtml: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div>
    <div v-if="markdownHtml" class="d-flex flex-column">
      <div :class="[clz]" v-html="markdownHtml"></div>
    </div>
  </div>
</template>
