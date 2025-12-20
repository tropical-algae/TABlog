<script setup>
import { useConfigStore } from "@/stores/config"
import { useHomeStore } from "@/stores/home"
import { ref, onMounted, nextTick } from "vue"
import PostView from "@/components/PostView.vue"
import NavBar from "@/components/NavBar.vue";

const markdownHtml = ref("")
const configStore = useConfigStore()
const homeStore = useHomeStore()

onMounted(async () => {
  await nextTick()
  markdownHtml.value = homeStore.content
})

</script>

<template>
  <div>
    <h1 class="m-0 p-0 home-title router-elem-slide-fadein">{{ configStore.title }}</h1>
    <div class="home-sub-title router-elem-slide-fadein">{{ configStore.subTitle }}</div>
    <PostView :title="'home-page'" :clz="'home-content'" :markdownHtml="markdownHtml"/>
    <NavBar/>
  </div>
</template>

<style scoped>
</style>