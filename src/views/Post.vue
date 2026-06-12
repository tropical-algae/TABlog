<template>
  <div class="d-flex flex-column" style="user-select: text">
    <div v-if="post" class="motion-slide-layer" data-motion-scope="route" data-motion="slide">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-attribute">
        <table>
          <tbody>
            <tr v-if="post.created_time && post.created_time.trim() !== ''">
              <td>created time:</td>
              <td>
                <span>{{ post.created_time }}</span>
              </td>
            </tr>
            <tr v-if="post.tags?.length">
              <td>tags:</td>
              <td class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="post-tag small">
                  {{ tag }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr class="split-line" />
    </div>

    <PostContent
      v-if="post"
      data-motion-scope="route"
      data-motion="fade"
      :clz="'post-content'"
      :markdown-html="markdownHtml"
    />
    <TheNavbar />
  </div>
</template>

<script setup>
import { nextTick, ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { cancelPageReady, registerPageReady } from '@/utils/pageReady'
import PostContent from '@/components/post/PostContent.vue'
import TheNavbar from '@/components/layout/TheNavbar.vue'

const { title } = defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const markdownHtml = ref('')
const postStore = usePostStore()
const post = ref(postStore.getPostByTitle(title))
const readyKeys = new Set()
let loadTaskId = 0

function isAbortError(err) {
  return err?.name === 'AbortError'
}

function isCurrentTask(taskId, signal) {
  return taskId === loadTaskId && !signal?.aborted
}

async function loadPost(titleToLoad, signal) {
  const taskId = ++loadTaskId
  const nextPost = postStore.getPostByTitle(titleToLoad)

  if (!nextPost) {
    if (!signal?.aborted) {
      router.replace({ name: 'NotFound', query: { from: route.fullPath } })
    }
    return
  }

  post.value = nextPost
  markdownHtml.value = ''

  try {
    const html = await postStore.fetchPostHtml(titleToLoad, { signal })
    if (!isCurrentTask(taskId, signal)) return

    markdownHtml.value = html
    await nextTick()
    if (!isCurrentTask(taskId, signal)) return
  } catch (err) {
    if (!isCurrentTask(taskId, signal) || isAbortError(err)) return
    console.error('[post load error]', err)
    router.replace({ name: 'NotFound', query: { from: route.fullPath } })
  }
}

function registerPostReady(titleToLoad, readyKey) {
  readyKeys.add(readyKey)
  registerPageReady((signal) => loadPost(titleToLoad, signal), readyKey)
}

registerPostReady(title, route.fullPath)

watch(
  () => route.params.title,
  (newTitle, oldTitle) => {
    if (newTitle !== oldTitle) {
      registerPostReady(newTitle, route.fullPath)
    }
  }
)

onUnmounted(() => {
  loadTaskId += 1
  readyKeys.forEach(cancelPageReady)
  readyKeys.clear()
})
</script>
