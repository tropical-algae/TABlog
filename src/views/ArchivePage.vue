
<template>
  <div class="archive-wrap">
    <h1 class="m-0 p-0 router-elem-slide-fadein">ARCHIVE</h1>
    <div :key="pageKey" class="archive-container py-1 px-2 router-elem-slide-fadein">
      <ul class="my-3">
        <li 
          v-for="post in postStore.getFilteredPaginatedPosts(configStore.pageSize)" :key="post.slug" 
          class="d-flex justify-content-between align-items-center"
        >
          <RouterLink 
            :to="{ name: 'Post', params: { title: post.title } }"
            class="flex-grow-1 text-truncate index-link"
          >
            {{ post.title }}
          </RouterLink>
          <div>
              <span 
                v-for="tag in post.tags.slice(0, postTagMaxNum)" :key="tag" 
                class="post-tag small ms-2"
              >
                {{ tag }}
              </span>
              <span
                v-if="post.created_time && post.created_time.trim() !== ''"
                class="post-tag small ms-2"
              >
                {{ post.created_time }}
              </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="archive-pagination router-elem-slide-fadein">
      <RouterLink :to="{ name: 'Archive'}" class="default-style" @click="prevPage">
        <component :is="BackIcon" class="page-svg-button" />
      </RouterLink>

      <template v-for="page in pages" :key="page">
        <span v-if="page === '...'" class="page-button ellipsis">
          {{ page }}
        </span>

        <RouterLink
          v-else :to="{ name: 'Archive'}" :class="{ 'selected': page === postStore.currentPage }"
          class="page-button default-style" @click="goToPage(page)"
        >
          {{ page }}
        </RouterLink>
      </template>

      <RouterLink 
        :to="{ name: 'Archive'}" :disabled="postStore.currentPage === totalPages"
        class="default-style" @click="nextPage"
      >
        <component :is="ForwardIcon" class="page-svg-button" />
      </RouterLink>
    </div>

    <NavBar/>
  </div>

</template>

<script setup>
import { useConfigStore } from "@/stores/config"
import { usePostStore } from "@/stores/post"
import { ref, watch, computed, onMounted, onUnmounted } from "vue"
import BackIcon from "@/assets/icons/chevron-back.svg?component"
import ForwardIcon from "@/assets/icons/chevron-forward.svg?component"
import NavBar from '@/components/NavBar.vue'

const postStore = usePostStore()
const configStore = useConfigStore()
 // post tag 预览数量
const postTagMaxNum = ref(3)
// 页码左侧的存留页数
const frontDetain = ref(2)
// 页码右侧的存留页数
const endDetain = ref(3)

const pageKey = computed(() => 
  postStore.getFilteredPaginatedPosts(configStore.pageSize).map(p => p.id).join(",")
)
const totalPages = computed(() => postStore.getFilteredPages(configStore.pageSize))

function updateMaxTags() {
  const width = window.innerWidth
  if (width < 576) {
    postTagMaxNum.value = 0
    frontDetain.value = 1
    endDetain.value = 1
  } else if (width < 768) {
    postTagMaxNum.value = 1
    frontDetain.value = 2
    endDetain.value = 1
  } else if (width < 992) {
    postTagMaxNum.value = 2
    frontDetain.value = 2
    endDetain.value = 2
  } else {
    postTagMaxNum.value = 3
    frontDetain.value = 2
    endDetain.value = 3
  }
}

const pages = computed(() => {
  const out = []

  if (totalPages.value <= 1) return [1]

  let frontStart = Math.max(1, postStore.currentPage - frontDetain.value)
  let frontEnd = Math.max(
    frontStart, Math.min(totalPages.value - endDetain.value, postStore.currentPage + frontDetain.value)
  )
  let rightStart = Math.max(frontEnd, totalPages.value - endDetain.value + 1)

  for (let i = frontStart; i <= frontEnd; i++) out.push(i)
  if (frontEnd < rightStart - 1) {
    out.push("...")
  } else if (frontStart > 1) {
    out.unshift("...")
  }
  for (let i = rightStart; i <= totalPages.value; i++) {
    if (!out.includes(i)) {
      out.push(i)
    }
  }
  return out
})

const goToPage = (page) => {
  if (page === "...") return
  postStore.currentPage = page
}

const prevPage = () => {
  if (postStore.currentPage > 1) {
    postStore.currentPage--
  }
}

const nextPage = () => {
  if (postStore.currentPage < totalPages.value) {
    postStore.currentPage++
  }
}

onMounted(() => {
  updateMaxTags()
  window.addEventListener("resize", updateMaxTags)
})

onUnmounted(() => {
  window.removeEventListener("resize", updateMaxTags)
})

watch(
  () => postStore.selectedTags,
  () => {
    if (postStore.currentPage != 1) {
      postStore.currentPage = 1
    }
  },
  { immediate: true, deep: true }
)
</script>
