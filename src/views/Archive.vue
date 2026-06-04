
<template>
  <div class="flex-grow-1 d-flex flex-column h-auto px-1" style="overflow: visible;">
    <h1 class="m-0 p-0" data-motion-scope="route" data-motion="slide">ARCHIVE</h1>
    <div ref="archiveListRoot" class="post-list-group flex-grow-1 py-1 px-2" data-motion-scope="route" data-motion="fade">
      <div class="post-list my-3">
        <div class="list-rail">
          <div class="rail-node top"></div>
          <div class="rail-line"></div>
          <div class="rail-node bottom"></div>
        </div>
        <ul>
          <li
            v-for="(post, index) in visiblePosts"
            :key="post.slug"
            class="d-flex justify-content-between align-items-center"
            data-motion-scope="archive-list"
            data-motion="slide"
            data-motion-x="-28"
            data-motion-y="0"
            :data-motion-order="index"
          >
            <RouterLink
              :to="{ name: 'Post', params: { title: post.title } }"
              class="flex-grow-1 text-truncate post-link"
            >
              {{ post.title }}
            </RouterLink>
            <div class="flex-shrink-0">
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
    </div>

    <div class="archive-pager" data-motion-scope="route" data-motion="slide">
      <RouterLink :to="{ name: 'Archive'}" class="link-raw" @click="prevPage">
        <component :is="BackIcon" class="pager-icon" />
      </RouterLink>

      <template v-for="page in pages" :key="page">
        <span v-if="page === '...'" class="pager-button ellipsis">
          {{ page }}
        </span>

        <RouterLink
          v-else :to="{ name: 'Archive'}" :class="{ 'selected': page === postStore.currentPage }"
          class="pager-button link-raw" @click="goToPage(page)"
        >
          {{ page }}
        </RouterLink>
      </template>

      <RouterLink 
        :to="{ name: 'Archive'}" :disabled="postStore.currentPage === totalPages"
        class="link-raw" @click="nextPage"
      >
        <component :is="ForwardIcon" class="pager-icon" />
      </RouterLink>
    </div>

    <TheNavbar/>
  </div>

</template>

<script setup>
import { useConfigStore } from "@/stores/config"
import { usePostStore } from "@/stores/post"
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue"
import { MOTION_CANCEL, MOTION_SCOPES, createMotionTransition } from "@/utils/animation"

import BackIcon from "@/assets/icons/chevron-back.svg?component"
import ForwardIcon from "@/assets/icons/chevron-forward.svg?component"
import TheNavbar from '@/components/layout/TheNavbar.vue'

const postStore = usePostStore()
const configStore = useConfigStore()
// post tag 预览数量
const postTagMaxNum = ref(3)
const archiveListRoot = ref(null)
// 页码左侧的存留页数
const frontDetain = ref(2)
// 页码右侧的存留页数
const endDetain = ref(3)
const archiveListMotion = createMotionTransition({
  scope: MOTION_SCOPES.archiveList,
  enter: {
    duration: 500,
    stagger: 90,
    maxStaggerItems: 10
  },
  leave: {
    duration: 180,
    stagger: 0
  }
})

const totalPages = computed(() => postStore.getFilteredPages(configStore.pageSize))
const visiblePosts = computed(() => postStore.getFilteredPaginatedPosts(configStore.pageSize))
const archiveListSignature = computed(() => [
  postStore.currentPage,
  postStore.selectedTags.slice().sort().join(","),
  visiblePosts.value.map(post => post.slug).join("|")
].join("::"))

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

function runArchiveListMotion() {
  if (!archiveListRoot.value) return
  return archiveListMotion.enterTargets(archiveListRoot.value, undefined, { deferStart: true })
}

onMounted(async () => {
  await nextTick()
  updateMaxTags()
  runArchiveListMotion()
  window.addEventListener("resize", updateMaxTags)
})

watch(
  archiveListSignature,
  async () => {
    await nextTick()
    runArchiveListMotion()
  },
  { flush: "post" }
)

onUnmounted(() => {
  if (archiveListRoot.value) {
    archiveListMotion.cancel(archiveListRoot.value, { mode: MOTION_CANCEL.cleanup })
  }
  window.removeEventListener("resize", updateMaxTags)
})

</script>

<style scoped>
/* 选页卡 */
.archive-pager {
  padding-top: 1rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
}

/* 选页按钮 */
.pager-button {
  position: relative;
  overflow: hidden;
  height: 1.4rem;
  padding: 0.1rem 0.2rem;
  color: var(--color-accent-alt);
  isolation: isolate;
  text-align: center;
  transition: transform 0.3s ease, color 0.6s ease;
  font-weight: bold;
  text-decoration: none;
  line-height: 1.2rem;
  min-width: 1.4rem;
  border-radius: 3px;
}

.pager-button::before,
.pager-button::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.pager-button::before {
  background: var(--color-accent);
}

.pager-button::after {
  background: var(--color-accent-alt);
  opacity: 0;
  transition: opacity 0.6s ease;
}

.pager-button:hover {
  transform: rotate(25deg);
}

.pager-button.selected {
  color: var(--color-accent);
}

.pager-button.selected::after {
  opacity: 1;
}

.pager-button.ellipsis {
  border-radius: 0;
  transition: none;
}

.pager-button.ellipsis::before,
.pager-button.ellipsis::after {
  content: none;
}

.pager-button.ellipsis:hover {
  transform: none;
}

.pager-icon {
  width: auto; 
  height: 1.4rem;
  color: var(--color-accent);
  transition: color 0.5s ease, opacity 0.5s ease;
  opacity: 0.8;
  fill: var(--color-accent);
  stroke: var(--color-accent);
}

.pager-icon:hover {
  opacity: 1;
  fill: var(--color-accent-alt);
  color: var(--color-accent-alt);
  stroke: var(--color-accent-alt);
}

</style>
