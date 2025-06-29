<script setup>
import { ref, watch, onMounted } from 'vue'
import { marked } from 'marked'
import { usePostStore } from '@/scripts/configStore'
import { useRoute } from 'vue-router'
import PostView from './components/PostView.vue'
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
          <tr v-if="post.created_time && post.created_time.trim() !== ''">
            <td>created time:</td>
            <td><span class="ms-2">{{ post.created_time }}</span></td>
          </tr>
          <tr v-if="post.tags && post.created_time.trim() !== ''">
            <td>tags:</td>
            <td>
              <span 
                v-for="label in post.tags" :key="label" 
                class="index-tags small ms-2"
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