<script setup>
import { ref, watch, onMounted } from 'vue'
import { marked } from 'marked'
import { removeMetadataFromMarkdown } from '@/scripts/markdownProcess'
import { useConfigStore, usePostStore } from '@/scripts/configStore'
import ActionBar from './components/ActionBar.vue'
import { useRoute } from 'vue-router'
import PostView from './components/PostView.vue'


const { title } = defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const markdownHtml = ref('')
const config = useConfigStore()
const postStore = usePostStore()
const post = ref(postStore.getByTitle(title))

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
    await updatePost()
  } catch (err) {
    console.log("[onMounted error]", err)
  }
})

watch(
  () => route.params.title,
  async (newTitle, oldTitle) => {
    if (newTitle !== oldTitle) {
      try {
        const newPost = postStore.getByTitle(newTitle)
        if (!newPost) {
          throw new Error(`Post not found for title: ${newTitle}`)
        }
        post.value = newPost
        await updatePost()
      } catch (err) {
        console.error("[watch error]", err)
      }
    }
  }
)

</script>

<template>
  <div class="d-flex flex-column">
    <h3 class="post-title">{{ post.title }}</h3>
    <div class="post-attribute">
      <table>
        <tbody>
          <tr v-if="post.create_time && post.create_time.trim() !== ''">
            <td>created time:</td>
            <td><span class="ms-2">{{ post.create_time }}</span></td>
          </tr>
          <tr v-if="post.labels && post.create_time.trim() !== ''">
            <td>labels:</td>
            <td>
              <span 
                v-for="label in post.labels" :key="label" 
                class="index-labels small ms-2"
              >
                {{ label }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr class="split-line">
    <PostView :title="post.title" :clz="'post-content'" :markdownHtml="markdownHtml" /> 
  </div>
</template>


<style scoped>


</style>