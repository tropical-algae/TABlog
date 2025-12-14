<script setup>

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
  <div class="router-elem-slide-fadein">
    <div v-if="markdownHtml" class="d-flex flex-column" >
      <div
        :class="[clz, ]"
        v-html="markdownHtml"
      ></div>
    </div>
  </div>
</template>
