<script setup>
import { usePostStore } from "@/stores/post"
import TheNavbar from "@/components/layout/TheNavbar.vue"

const postStore = usePostStore()
const months_map = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

</script>

<template>
  <div class="flex-grow-1 d-flex flex-column h-auto px-1" style="overflow: hidden auto;">
    <p class="timeline-title router-elem-fade anim-slide">TIMELINE</p>
    <div class="timeline-container router-elem-fade flex-grow-1 anim-slide">
      <div class="timeline-content">
        <div class="timeline-years-group" v-for="{ year, months } in postStore.timeGroupPosts">
          <div class="timeline-label primary">{{ year }}</div>
          <div>
            <div v-for="{month, posts} in months" class="timeline-months-group">
                <div class="timeline-label">{{ months_map[month - 1] }}</div>
                <RouterLink 
                  v-for="post in posts"
                  :to="{ name: 'Post', params: { title: post.title } }"
                  class="post-link my-1"
                >
                  {{ post.title }}
                </RouterLink>
              </div>
            </div>
        </div>
      </div>
    </div>

    <TheNavbar />
  </div>
</template>

<style scoped>
.timeline-title {
  margin: 0;
  padding: 0;
  color: var(--color-accent-alt);
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
}

.timeline-container {
  position: relative;
  overflow: hidden scroll;
  flex: 1 1 0%;
  overscroll-behavior: none;

  --mask: linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent);

  -webkit-mask-image: var(--mask);
  mask-image: var(--mask);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

.timeline-container::-webkit-scrollbar {
  display: none;
}


.timeline-content {
  position: absolute;
  min-height: 100%;
  width: 100%;
}

.timeline-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%; /* 这里的 100% = inner 的内容高度 */
  background-color: var(--color-accent-alt);
}

.timeline-months-group {
  display: flex;
  flex-direction: column;
}

.timeline-years-group {
  float: left;
  clear: both;
  width: calc(50% - 10px);
  padding: 20px;
  text-align: right;
}

.timeline-years-group:not(:first-child) {
  margin-top: -1rem;
}

.timeline-years-group .timeline-label {
  font-size: 1.3rem;
  font-size: clamp(1.1rem, 0.5vw + 1.1rem, 1.3rem);
  font-weight: bold;
  position: relative;
  color: var(--color-accent-alt);
  overflow-wrap: break-word;
}

.timeline-years-group .timeline-label::before {
  position: absolute;
  top: 50%;
  right: -38px;
  z-index: 1000;
  width: 16px;
  height: 16px;
  border: 5px solid var(--color-accent-alt);
  content: '';
  background-color: var(--color-accent);
  border-radius: 100%;
  transform: translateY(-50%);
}

.timeline-years-group .timeline-label.primary {
  font-size: clamp(1.2rem, 1vw + 1.2rem, 2rem);
  margin-bottom: 0.5rem;
}

.timeline-years-group .timeline-label.primary::before {
  width: 28px;
  height: 28px;
  transform: translate(6px, -50%);
}

.timeline-years-group:nth-child(2n) {
  float: right;
  text-align: left;
}

.timeline-years-group:nth-child(2n) .timeline-label::before {
  left: -38px;
}

.timeline-years-group:nth-child(2n) .timeline-label.primary::before {
  transform: translate(-6px, -50%);
}
</style>