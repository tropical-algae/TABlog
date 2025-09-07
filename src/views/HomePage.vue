<script setup>
import { useHomePost, useConfigStore } from '@/scripts/configStore'
import { ref, onMounted } from 'vue'
import PostView from './components/PostView.vue'

const markdownHtml = ref('')
const config = useConfigStore()
const home = useHomePost()

onMounted(async () => {
  markdownHtml.value = home.content
})

</script>

<template>
  <div>
    <div class="row home-title"><h3>{{ config.title }}</h3></div>
    <div class="row home-sub-title">{{ config.subTitle }}</div>
    <PostView :title="'home-page'" :clz="'row home-content'" :markdownHtml="markdownHtml" />
  </div>
</template>

<style scoped>
</style>