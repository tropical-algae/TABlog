
<template>
  <div class="post-wrap">
    <h1 class="post-title router-elem-slide-fadein">{{ post.title }}</h1>
    <div class="post-attribute router-elem-slide-fadein">
      <table class="router-elem-slide-fadein">
        <tbody>
          <tr v-if="post.created_time && post.created_time.trim() !== ''">
            <td>created time:</td>
            <td><span>{{ post.created_time }}</span></td>
          </tr>
          <tr v-if="post.tags && post.created_time.trim() !== ''">
            <td>tags:</td>
            <td class="post-tag-container">
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
    <hr class="split-line scale-x router-elem-slide-fadein">
    <PostView :title="post.title" :clz="'post-content'" :markdownHtml="markdownHtml" /> 
    <NavBar/>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"
import { useRoute, onBeforeRouteUpdate } from "vue-router"
import { marked } from "marked"
import { usePostStore } from "@/stores/post"
import katexExtension from "@/scripts/mdKatex.js"
import PostView from "@/components/PostView.vue"
import NavBar from "@/components/NavBar.vue"

marked.use(katexExtension())

const { title } = defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const markdownHtml = ref("")
const postStore = usePostStore()
const post = ref(postStore.getPostByTitle(title))

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.title !== from.params.title) {
    try {
      await postStore.fetchPostAndParse(to.params.title)
    } catch (err) {
      console.error(err)
    }
  }
})

onMounted(async () => {
  try {
    if (!post.value) {
      throw new Error(`Post not found for title: ${title}`)
    }
    // await updatePost()
    markdownHtml.value =  postStore.currentHtml
  } catch (err) {
    console.log("[onMounted error]", err)
  }
});

watch(
  () => route.params.title,
  async (newTitle, oldTitle) => {
    if (newTitle !== oldTitle) {
      try {
        const newPost = postStore.getPostByTitle(newTitle)
        if (!newPost) {
          throw new Error(`Post not found for title: ${newTitle}`)
        }
        post.value = newPost
        markdownHtml.value = postStore.currentHtml

      } catch (err) {
        console.error("[watch error]", err)
      }
    }
  }
)

</script>
