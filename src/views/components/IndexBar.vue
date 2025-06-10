<script setup>
import { usePostStore } from '@/scripts/configStore'

const { title } = defineProps({
  title: {
    type: String,
    required: true
  }
})

const postStore = usePostStore()
const tags = postStore.getByTitle(title).tags
const relatedPosts = postStore.relatedTitlesByTags(tags, title)

</script>

<template>
  <div class="index-content pb-3">
    <ul v-for="relatedPost in relatedPosts" :key="relatedPost.label" class="p-0">
      <h5 class="py-2 my-2 fw-bold">{{ relatedPost.label }}</h5>
      <li 
        v-for="postTitle in relatedPost.titles" 
        class="d-flex justify-content-between align-items-center"
      >
        <RouterLink :to="{ name: 'Post', params: {title: postTitle} }" class="index-link small text-truncate w-100">
          {{ postTitle }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
