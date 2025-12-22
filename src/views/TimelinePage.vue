<script setup>
import { usePostStore } from "@/stores/post"
import NavBar from "@/components/NavBar.vue"

const postStore = usePostStore()
const months_map = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

</script>

<template>
  <div class="timeline-wrap flex-grow-1 d-flex flex-column">
    <p class="timeline-title router-elem-fade anim-slide">TIMELINE</p>
    <div class="timeline-container router-elem-fade flex-grow-1 anim-slide">
      <div class="timeline-inner">
        <div class="timeline-years" v-for="{ year, months } in postStore.timeGroupPosts">
          <div class="title big">{{ year }}</div>
          <div>
            <div v-for="{month, posts} in months" class="timeline-months">
                <div class="title">{{ months_map[month - 1] }}</div>
                <RouterLink 
                  v-for="post in posts"
                  :to="{ name: 'Post', params: { title: post.title } }"
                  class="timeline-posts"
                >
                  {{ post.title }}
                </RouterLink>
              </div>
            </div>
        </div>
      </div>
    </div>

    <NavBar />
  </div>
</template>

<style scoped>
</style>