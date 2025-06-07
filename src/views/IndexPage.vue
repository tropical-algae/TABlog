<script setup>
import { useConfigStore, usePostStore } from '@/scripts/configStore'
import ActionBar from './components/ActionBar.vue'

const config = useConfigStore()
const postIndex = usePostStore()
const posts = postIndex.sortedByDate

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
          <router-link 
            :to="{ name: 'Post', params: { title: post.title } }"
            class="flex-grow-1 text-truncate index-link"
          >
            {{ post.title }}
          </router-link>

          <div>
            <span 
              v-for="label in post.labels" :key="label" 
              class="index-labels small ms-2"
            >
              {{ label }}
            </span>
            <span
              v-if="post.created_time && post.created_time.trim() !== ''"
              class="index-labels small ms-2"
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