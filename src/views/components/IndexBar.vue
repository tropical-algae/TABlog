<script setup>
import { usePostStore } from '@/scripts/configStore'


const { title } = defineProps({
  title: {
    type: String,
    required: true
  }
})

const postStore = usePostStore()
const labels = postStore.getByTitle(title).labels
const postTitles = postStore.relatedTitlesByLabels(labels)

</script>

<template>
  <div>
    <ul>
      <li v-for="postTitle in postTitles">
        <router-link :to="{ name: 'Post', params: {title: postTitle} }">
          {{ postTitle }}
        </router-link>
      </li>
    </ul>
  </div>
</template>