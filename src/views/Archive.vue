
<template>
  <div class="flex-grow-1 d-flex flex-column h-auto" style="overflow: visible;">
    <h1 class="archive-title motion-slide-layer" data-motion-scope="route" data-motion="slide">ARCHIVE</h1>
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
            class="d-flex justify-content-between align-items-center motion-slide-layer"
            data-motion-scope="archive-list"
            data-motion="slide"
            data-motion-x="28"
            data-motion-y="0"
            :data-motion-order="index"
          >
            <RouterLink
              :to="{ name: 'Post', params: { title: post.title } }"
              class="flex-grow-1 post-link"
            >
              <div class="text-truncate">
                {{ post.title }}
              </div>
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

    <div class="archive-pager motion-slide-layer" data-motion-scope="route" data-motion="slide">
      <LinkStyleScope variant="normal">

        <RouterLink :to="{ name: 'Archive'}" @click="prevPage">
          <component :is="BackIcon" class="pagination-icon" />
        </RouterLink>

        <LinkStyleScope variant="default" selectable>

          <template v-for="page in pages" :key="page">
            <span v-if="page === '...'" class="pagination-item ellipsis">
              . . .
            </span>

            <RouterLink
              v-else :to="{ name: 'Archive'}" :class="{ 'selected': page === postStore.currentPage }"
              class="pagination-item" @click="goToPage(page)"
            >
              {{ page }}
            </RouterLink>
          </template>

        </LinkStyleScope>

        <RouterLink 
          :to="{ name: 'Archive'}" :disabled="postStore.currentPage === totalPages"
          @click="nextPage"
        >
          <component :is="ForwardIcon" class="pagination-icon" />
        </RouterLink>

      </LinkStyleScope>
    </div>

    <TheNavbar/>
  </div>

</template>

<script setup>
import { useConfigStore } from "@/stores/config"
import { usePostStore } from "@/stores/post"
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue"
import { useRoute } from "vue-router"
import { MOTION_CANCEL, MOTION_SCOPES, createMotionTransition } from "@/utils/animation"
import { waitForPageMotionStart } from "@/utils/pageMotion"

import BackIcon from "@/assets/icons/chevron-back.svg?component"
import ForwardIcon from "@/assets/icons/chevron-forward.svg?component"
import TheNavbar from '@/components/layout/TheNavbar.vue'
import LinkStyleScope from '@/components/common/LinkStyleScope.vue'

const postStore = usePostStore()
const configStore = useConfigStore()
const route = useRoute()
// post tag 预览数量
const postTagMaxNum = ref(3)
const archiveListRoot = ref(null)
let archiveMotionRunId = 0
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
  return archiveListMotion.enterTargets(archiveListRoot.value)
}

async function runArchiveListMotionAtPageMotionStart() {
  const runId = ++archiveMotionRunId
  await waitForPageMotionStart(route.fullPath)
  await nextTick()

  if (runId !== archiveMotionRunId || !archiveListRoot.value) return
  return runArchiveListMotion()
}

onMounted(async () => {
  await nextTick()
  updateMaxTags()
  runArchiveListMotionAtPageMotionStart()
  window.addEventListener("resize", updateMaxTags)
})

watch(
  archiveListSignature,
  async () => {
    await nextTick()
    runArchiveListMotionAtPageMotionStart()
  },
  { flush: "post" }
)

onUnmounted(() => {
  archiveMotionRunId++
  if (archiveListRoot.value) {
    archiveListMotion.cancel(archiveListRoot.value, { mode: MOTION_CANCEL.cleanup })
  }
  window.removeEventListener("resize", updateMaxTags)
})

</script>

<style scoped>

.archive-title {
  margin: 0;
  padding: 0;
  color: var(--color-accent);
  font-weight: 700;
}

/* 选页卡 */
.archive-pager {
  padding-top: 1rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
}

/* 选页按钮 */
.pagination-item {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 1.7rem;
  min-width: 1.7rem;
  padding: 0;
}

.pagination-item.ellipsis {
  color: var(--color-accent-alt);
  font-weight: 700;
  background-color: none !important;
  border-radius: 0 !important;
  transition: none !important;
}

.pagination-icon {
  width: auto; 
  height: 1.7rem;
  /* display: block; */
}

</style>
