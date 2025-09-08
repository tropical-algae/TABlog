<script setup>
import GithubIcon from '@/assets/icons/icons8-github.svg?component'
import DiscordIcon from '@/assets/icons/icons8-discord.svg?component'
import NotionIcon from '@/assets/icons/icons8-notion.svg?component'
import WebsiteIcon from '@/assets/icons/icons8-website.svg?component'
import { usePostStore, useConfigStore } from '@/scripts/configStore'

const config = useConfigStore()
const postStore = usePostStore()
const tags = postStore.getAllTags

const socialLink = [
  { icon: GithubIcon, link: config.links.github },
  { icon: NotionIcon, link: config.links.notion },
  { icon: DiscordIcon, link: config.links.discord },
  { icon: WebsiteIcon, link: config.links.website },
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
  <div class="introduction-bar">
    <div class="px-3">
      <img src="/images/avatar.png" class="introduction-image img-fluid my-2" alt="">
    </div>
    
    <div class="d-flex flex-wrap justify-content-center align-items-center my-1 gap-3">
      <a v-for="(item, index) in socialLink" :key="index" :href="item.link" 
        class="col-2 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center align-items-center"
      >
        <component :is="item.icon" class="icon-style" />
      </a>
    </div>

    <div class="my-2">
      <RouterLink :to="{ name: 'Home'}" class="introduction-home-link default-style w-100">Home</RouterLink>
    </div>

    <hr class="split-line my-2"/>

    <div class="introduction-content my-2"> {{ config.introduction }} </div>

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


<style>

</style>