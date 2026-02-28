
<template>
  <div class="post-wrap">
    <div class="router-elem-fade anim-slide">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-attribute">
        <table>
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
      <hr class="split-line">
    </div>

    <PostContent class="router-elem-fade anim-slide" :title="post.title" :clz="'post-content'" :markdownHtml="markdownHtml" /> 
    <TheNavbar/>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue"
import { useRoute, onBeforeRouteUpdate } from "vue-router"
import { usePostStore } from "@/stores/post"
import PostContent from "@/components/post/PostContent.vue"
import TheNavbar from "@/components/layout/TheNavbar.vue"

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

const preloadImagesFromHtml = (htmlStr) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, "text/html");
  const imgs = doc.querySelectorAll("img");
  
  const promises = Array.from(imgs).map(img => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = img.src;
      
      image.onload = () => resolve();
      image.onerror = () => resolve();
    });
  });

  return Promise.all(promises);
};


onBeforeRouteUpdate(async (to, from) => {
  if (to.params.title !== from.params.title) {
    try {
      await postStore.fetchPostAndParse(to.params.title)
      preloadImagesFromHtml(postStore.currentHtml)
    } catch (err) {
      console.error(err)
    }
  }
})

onMounted(async () => {
  await nextTick()
  try {
    if (!post.value) {
      throw new Error(`Post not found for title: ${title}`)
    }
    // await updatePost()
    markdownHtml.value = postStore.currentHtml
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
