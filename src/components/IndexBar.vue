<script setup>
import { usePostStore } from '@/stores/post'
const postStore = usePostStore()

const { title } = defineProps({
  title: {
    type: String,
    required: false
  }
})

const relatedPosts = postStore.getRelatedPosts(title)

</script>

<template>
  <div class="archive-container pb-3 router-elem-fade">
    <div v-for="relatedPost in relatedPosts" :key="relatedPost.tag">
      <h5 class="py-2 my-2 fw-bold">{{ relatedPost.tag }}</h5>

      <div class="archive-list px-2">
        <div class="decor-line-wrapper">
          <div class="dot top"></div>
          <div class="progress-line"></div>
          <div class="dot bottom"></div>
        </div>
        <ul>
          <li 
            v-for="postTitle in relatedPost.titles" 
            class="d-flex justify-content-between align-items-center"
          >
            <RouterLink :to="{ name: 'Post', params: {title: postTitle} }" class="post-link small text-truncate w-100">
              {{ postTitle }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>
