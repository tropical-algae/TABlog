<script setup>
import { useConfigStore } from "@/stores/config"
import { useHomeStore } from "@/stores/home"
import { ref, onMounted, nextTick } from "vue"
import PostContent from "@/components/post/PostContent.vue"
import TheNavbar from "@/components/layout/TheNavbar.vue";

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
    <h1 class="m-0 p-0 home-title motion-slide-layer" data-motion-scope="route" data-motion="slide">{{ configStore.title }}</h1>
    <div class="home-sub-title motion-slide-layer" data-motion-scope="route" data-motion="slide">{{ configStore.subTitle }}</div>
    <PostContent class="motion-slide-layer" data-motion-scope="route" data-motion="slide" :title="'home-page'" :clz="'home-content'" :markdownHtml="markdownHtml"/>
    <TheNavbar/>
  </div>
</template>
