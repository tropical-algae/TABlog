
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { marked } from 'marked'
import { usePostStore } from '@/stores/post'
import PostView from '@/components/PostView.vue'
import ActionBar from '@/components/ActionBar.vue';

import katexExtension from '@/scripts/mdKatex.js'

marked.use(katexExtension())

const { title } = defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const markdownHtml = ref('')
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

async function updatePost() {
  const slugPath = `${post.value.dir}\\${post.value.slug}`
  const res = await fetch(slugPath)
  const mdText = await res.text()
  const htmlText = marked.parse(mdText)
  markdownHtml.value = htmlText
}

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
        // await updatePost()
        markdownHtml.value = postStore.currentHtml

      } catch (err) {
        console.error("[watch error]", err)
      }
    }
  }
)

</script>

<template>
  <div class="post-bar">
    <h1 class="p-0 m-0 router-elem-slide-fadein">{{ post.title }}</h1>
    <div class="post-attribute router-elem-slide-fadein">
      <table class="router-elem-slide-fadein">
        <tbody>
          <tr v-if="post.created_time && post.created_time.trim() !== ''">
            <td>created time:</td>
            <td><span>{{ post.created_time }}</span></td>
          </tr>
          <tr v-if="post.tags && post.created_time.trim() !== ''">
            <td>tags:</td>
            <td class="index-tags-container">
              <span 
                v-for="tag in post.tags" :key="tag" 
                class="index-tags small"
              >
                {{ tag }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr class="split-line router-elem-slide-fadein">
    <PostView :title="post.title" :clz="'post-content'" :markdownHtml="markdownHtml" /> 
    <ActionBar/>

  </div>
</template>


<style scoped>

</style>