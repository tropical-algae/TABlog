<script setup>
import { usePostStore } from '@/scripts/configStore'
import ActionBar from './components/ActionBar.vue'
import { ref, watch, onMounted, onUnmounted } from 'vue'

const postStore = usePostStore()
const postTagMaxNum = ref(3) // 初始值
const posts = ref(postStore.filterBySelectedTags)
const pageKey = ref(posts.value.map(p => p.id).join(','))

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

watch(
  () => postStore.selectedTags,
  () => {
    posts.value = postStore.filterBySelectedTags
    pageKey.value = ref(posts.value.map(p => p.id).join(','))

  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="d-flex flex-column h-100">
    <h3 class="index-title">ARCHIVE</h3>
    <transition name="fade-comp" mode="out-in">
      <div :key="pageKey" class="index-content py-4 px-2">
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
                  v-for="tag in post.tags.slice(0, postTagMaxNum)" :key="tag" 
                  class="index-tags small ms-2"
                >
                  {{ tag }}
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
    </transition>
    <ActionBar />
  </div>

</template>

<style scoped>

</style>