<script setup>
import { usePostStore } from '@/stores/post'
import ActionBar from '@/components/ActionBar.vue'

const postStore = usePostStore()
const months_map = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

</script>

<template>
  <div class="timeline-bar">
    <p class="timeline-title router-elem-slide-fadein">TIMELINE</p>
    <div class="timeline-content router-elem-slide-fadein">
      <div class="timeline-inner">
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
    </div>

    <ActionBar />
  </div>
</template>

<style scoped>
</style>