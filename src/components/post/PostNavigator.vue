<template>
  <div class="post-list-group pb-3" data-motion-scope="route" data-motion="fade">
    <div v-for="relatedPost in relatedPosts" :key="relatedPost.tag">
      <div class="py-2 my-2 fw-bold" style="font-size: 1.2rem">{{ relatedPost.tag }}</div>

      <div class="post-list px-2">
        <div class="list-rail">
          <div class="rail-node top"></div>
          <div class="rail-line"></div>
          <div class="rail-node bottom"></div>
        </div>
        <ul>
          <li
            v-for="postTitle in relatedPost.titles"
            :key="postTitle"
            class="d-flex justify-content-between align-items-center"
          >
            <RouterLink
              :to="{ name: 'Post', params: { title: postTitle } }"
              class="post-link small w-100"
            >
              <div class="text-truncate">
                {{ postTitle }}
              </div>
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
    default: ''
  }
})

const relatedPosts = postStore.getRelatedPosts(title)
</script>
