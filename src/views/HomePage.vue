<script setup>
import { useConfigStore } from '@/scripts/configStore'
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import PostView from './components/PostView.vue'

const markdownHtml = ref('')
const config = useConfigStore()

onMounted(async () => {
  const res = await fetch('/config/home.md')
  const mdText = await res.text()
  markdownHtml.value = marked.parse(mdText)
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