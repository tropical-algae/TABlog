<script setup>
import { usePostStore, useConfigStore } from '@/scripts/configStore'
import ActionBar from '@/views/components/ActionBar.vue'

import { ref, onMounted } from 'vue'

const markdownHtml = ref('')
const config = useConfigStore()
const postStore = usePostStore()

console.log(postStore.timeGroupPosts)

const months_map = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

</script>

<template>
  <div class="timeline-bar">
    <p class="timeline-title">TIMELINE</p>

    <div class="timeline-content">
      <div class="timeline-years" v-for="{ year, months } in postStore.timeGroupPosts">
        <div class="title big">{{ year }}</div>
        <div>
          <div v-for="{month, posts} in months" class="timeline-months">
              <div class="title">{{ months_map[month - 1] }}</div>
              <RouterLink 
                v-for="post in posts"
                :to="{ name: 'Post', params: { title: post.title } }"
                class="timeline-posts "
              >
                {{ post.title }}
              </RouterLink>
            </div>
          </div>
      </div>
    </div>

    <ActionBar />
  </div>
</template>

<style scoped>
</style>