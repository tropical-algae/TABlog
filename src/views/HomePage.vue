<script setup>
import { useConfigStore } from '@/scripts/configStore'
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { removeMetadataFromMarkdown } from '@/scripts/markdownProcess'
import ActionBar from './components/ActionBar.vue'
import PostView from './components/PostView.vue'

const markdownHtml = ref('')
const config = useConfigStore()

onMounted(async () => {
  const res = await fetch('/config/home.md')
  const mdText = await res.text()
  const procText = removeMetadataFromMarkdown(mdText, Object.values(config.mdLables))
  markdownHtml.value = marked.parse(procText)
  // applyRandomTheme()
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