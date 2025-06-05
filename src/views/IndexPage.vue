<script setup>
import { useConfigStore, usePostStore } from '@/scripts/configStore'
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import ActionBar from './components/ActionBar.vue'

const config = useConfigStore()
const postIndex = usePostStore()
const posts = postIndex.sortedByDate

</script>

<template>
  <div>
    <h3 class="index-title">INDEX</h3>
    <div class="index-content">
      <ul>
        <li v-for="post in posts" :key="post.slug" class="d-flex justify-content-between align-items-center">
          <!-- <router-link :to="'/post/' + post.slug">{{ post.title }}</router-link> -->
          <router-link :to="{ name: 'Post', params: { title: post.title } }">{{ post.title }}</router-link>

          <div class="text-end">
            <span 
              v-for="label in post.labels" :key="label" 
              class="index-labels small ms-2"
            >
              {{ label }}
            </span>
            <span
              v-if="post.create_time && post.create_time.trim() !== ''"
              class="index-labels small ms-2"
            >
              {{ post.create_time }}
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