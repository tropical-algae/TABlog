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
  <div class="home-bar">
    <div class="home-title"><h1>{{ config.title }}</h1></div>
    <div class="home-sub-title">{{ config.subTitle }}</div>
    <PostView :title="'home-page'" :clz="'home-content'" :markdownHtml="markdownHtml" />
  </div>
</template>

<style scoped>
</style>