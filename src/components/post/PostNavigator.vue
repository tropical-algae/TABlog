<template>
  <div class="post-list-group pb-3 router-elem-fade">
    <div v-for="relatedPost in relatedPosts" :key="relatedPost.tag">
      <div class="py-2 my-2 fw-bold" style="font-size: 1.2rem;">{{ relatedPost.tag }}</div>

      <div class="post-list px-2">
        <div class="list-rail">
          <div class="rail-node top"></div>
          <div class="rail-line"></div>
          <div class="rail-node bottom"></div>
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
