<script setup>
import GithubIcon from '@/assets/icons/icons8-github.svg?component'
import DiscordIcon from '@/assets/icons/icons8-discord.svg?component'
import NotionIcon from '@/assets/icons/icons8-notion.svg?component'
import WebsiteIcon from '@/assets/icons/icons8-website.svg?component'
import { useConfigStore } from '@/stores/config'
import { usePostStore } from '@/stores/post'

const configStore = useConfigStore()
const postStore = usePostStore()
const tags = postStore.getAllTags

const socialLink = [
  { icon: GithubIcon, link: configStore.links.github },
  { icon: NotionIcon, link: configStore.links.notion },
  { icon: DiscordIcon, link: configStore.links.discord },
  { icon: WebsiteIcon, link: configStore.links.website },
]

function switchSelectStatus(tag) {
  if (postStore.selectedTags.includes(tag)) {
    postStore.unselectTag(tag)
  } else {
    postStore.selectTag(tag)
  }
}

const isSelected = (tag) => postStore.selectedTags.includes(tag)

</script>

<template>
  <div>
    <div class="px-2">
      <img src="/images/avatar.png" class="introduction-image img-fluid my-2" alt="">
    </div>
    
    <div class="d-flex flex-wrap justify-content-center align-items-center my-1 gap-3">
      <a v-for="(item, index) in socialLink" :key="index" :href="item.link" 
        class="col-2 col-sm-4 col-md-3 col-lg-2 d-flex default-style justify-content-center align-items-center"
      >
        <component :is="item.icon" class="social-link-icon" />
      </a>
    </div>

    <div class="my-2">
      <RouterLink :to="{ name: 'Home'}" class="home-link-button default-style w-100">Home</RouterLink>
    </div>

    <hr class="split-line my-2"/>

    <div class="introduction-content my-2"> {{ configStore.introduction }} </div>

    <hr class="split-line my-2"/>

    <div class="index-tags-container justify-content-center my-2" v-if="tags">
      <RouterLink 
        :to="{ name: 'Index'}"
        v-for="tag in tags" :key="tag" 
        class="index-tags default-style small"
        :class="{ 'selected': isSelected(tag) }"
        @click="switchSelectStatus(tag)"
      >
      {{ tag }}
      </RouterLink>
    </div>
  </div>
</template>
