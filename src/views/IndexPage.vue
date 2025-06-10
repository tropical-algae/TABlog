<script setup>
import { usePostStore } from '@/scripts/configStore'
import ActionBar from './components/ActionBar.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const postIndex = usePostStore()
const posts = postIndex.sortedByDate
const postTagMaxNum = ref(3) // 初始值

function updateMaxTags() {
  const width = window.innerWidth
  if (width < 576) {
    postTagMaxNum.value = 0
  } else if (width < 768) {
    postTagMaxNum.value = 1
  } else if (width < 992) {
    postTagMaxNum.value = 2
  } else {
    postTagMaxNum.value = 3
  }
}

onMounted(() => {
  updateMaxTags()
  window.addEventListener('resize', updateMaxTags)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMaxTags)
})

</script>

<template>
  <div>
    <h3 class="index-title">ARCHIVE</h3>
    <div class="index-content py-4 px-2">
      <ul>
        <li 
          v-for="post in posts" :key="post.slug" 
          class="d-flex justify-content-between align-items-center"
        >
          <RouterLink 
            :to="{ name: 'Post', params: { title: post.title } }"
            class="flex-grow-1 text-truncate index-link"
          >
            {{ post.title }}
          </RouterLink>

          <div>
            <span 
              v-for="label in post.tags.slice(0, postTagMaxNum)" :key="label" 
              class="index-tags small ms-2"
            >
              {{ label }}
            </span>
            <span
              v-if="post.created_time && post.created_time.trim() !== ''"
              class="index-tags small ms-2"
            >
              {{ post.created_time }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <hr class="split-line my-3"/>

    <ActionBar />

  </div>

</template>
  

<style scoped>

</style>