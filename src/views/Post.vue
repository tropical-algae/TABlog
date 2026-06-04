
<template>
  <div class="d-flex flex-column px-1" style="user-select: text;">
    <div v-if="post" class="motion-slide-layer" data-motion-scope="route" data-motion="slide">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-attribute">
        <table>
          <tbody>
            <tr v-if="post.created_time && post.created_time.trim() !== ''">
              <td>created time:</td>
              <td><span>{{ post.created_time }}</span></td>
            </tr>
            <tr v-if="post.tags?.length">
              <td>tags:</td>
              <td class="post-tags">
                <span 
                  v-for="tag in post.tags" :key="tag" 
                  class="post-tag small"
                >
                  {{ tag }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr class="split-line">
    </div>

    <PostContent v-if="post" data-motion-scope="route" data-motion="fade" :title="post.title" :clz="'post-content'" :markdownHtml="markdownHtml" />
    <TheNavbar/>
  </div>
</template>

<script setup>
import { nextTick, ref, watch, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { usePostStore } from "@/stores/post"
import { cancelPageReady, registerPageReady } from "@/utils/pageReady"
import PostContent from "@/components/post/PostContent.vue"
import TheNavbar from "@/components/layout/TheNavbar.vue"

const { title } = defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const markdownHtml = ref("")
const postStore = usePostStore()
const post = ref(postStore.getPostByTitle(title))
const imageReadyTimeoutMs = 3000
const readyKeys = new Set()
let loadTaskId = 0

function isAbortError(err) {
  return err?.name === "AbortError"
}

function getAbortError(signal) {
  return signal?.reason || new DOMException("Post loading aborted", "AbortError")
}

function isCurrentTask(taskId, signal) {
  return taskId === loadTaskId && !signal?.aborted
}

function waitForImage(src, signal) {
  if (!src) return Promise.resolve()
  if (signal?.aborted) return Promise.reject(getAbortError(signal))

  return new Promise((resolve, reject) => {
    const image = new Image()
    let settled = false

    const cleanup = () => {
      window.clearTimeout(timer)
      signal?.removeEventListener("abort", abort)
      image.onload = null
      image.onerror = null
    }

    const finish = (resolveImage = true) => {
      if (settled) return
      settled = true
      cleanup()
      if (resolveImage) {
        resolve()
      } else {
        reject(getAbortError(signal))
      }
    }

    const abort = () => {
      finish(false)
    }

    const timer = window.setTimeout(() => finish(), imageReadyTimeoutMs)
    signal?.addEventListener("abort", abort, { once: true })
    image.onload = () => finish()
    image.onerror = () => finish()
    image.src = src

    if (image.complete) {
      finish()
    }
  })
}

const preloadImagesFromHtml = (htmlStr, signal) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlStr, "text/html")
  const imgs = doc.querySelectorAll("img")

  return Promise.all(Array.from(imgs).map(img => waitForImage(img.src, signal)))
}

async function loadPost(titleToLoad, signal) {
  const taskId = ++loadTaskId
  const nextPost = postStore.getPostByTitle(titleToLoad)

  if (!nextPost) {
    if (!signal?.aborted) {
      router.replace({ name: "NotFound", query: { from: route.fullPath } })
    }
    return
  }

  post.value = nextPost
  markdownHtml.value = ""

  try {
    const html = await postStore.fetchPostHtml(titleToLoad, { signal })
    if (!isCurrentTask(taskId, signal)) return

    markdownHtml.value = html
    await nextTick()
    if (!isCurrentTask(taskId, signal)) return

    await preloadImagesFromHtml(html, signal)
  } catch (err) {
    if (!isCurrentTask(taskId, signal) || isAbortError(err)) return
    console.error("[post load error]", err)
    router.replace({ name: "NotFound", query: { from: route.fullPath } })
  }
}

function registerPostReady(titleToLoad, readyKey) {
  readyKeys.add(readyKey)
  registerPageReady(signal => loadPost(titleToLoad, signal), readyKey)
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
