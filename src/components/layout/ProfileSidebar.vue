<template>
  <div>
    <div class="px-2">
      <img src="/images/avatar.png" class="profile-avatar img-fluid my-2" alt="">
    </div>
    
    <div class="d-flex flex-wrap justify-content-center align-items-center my-1 gap-3">
      <a v-for="(item, index) in socialLink" :key="index" :href="item.link" 
        class="col-2 col-sm-4 col-md-3 col-lg-2 d-flex link-raw justify-content-center align-items-center"
      >
        <component :is="item.icon" class="social-link-icon" />
      </a>
    </div>

    <div class="my-2">
      <RouterLink :to="{ name: 'Home'}" class="profile-home-link link-raw w-100">Home</RouterLink>
    </div>

    <hr class="split-line my-2"/>
    <div class="profile-bio my-2"> {{ configStore.introduction }} </div>
    <hr class="split-line my-2"/>

    <div class="post-tags justify-content-center my-2" v-if="tags">
      <RouterLink 
        :to="{ name: 'Archive'}"
        v-for="tag in tags" :key="tag" 
        class="post-tag link-raw small"
        :class="{ 'selected': isSelected(tag) }"
        @click="switchSelectStatus(tag)"
      >
      {{ tag }}
      </RouterLink>
    </div>
  </div>
</template>

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

<style scoped>
.social-link-icon { 
  min-width: 30px;
  max-width: 45px;
  height: auto;
  color: var(--color-primary-alt);
  border-radius: 5px;
  opacity: 0.91;
  fill: var(--color-primary-alt);
  stroke: var(--color-primary-alt);
  transition: 
    stroke 0.3s ease,
    fill 0.3s ease,
    color 0.3s ease;
}

.social-link-icon:hover {
  stroke: var(--color-accent-alt);
  fill: var(--color-accent-alt);
  color: var(--color-accent-alt);
}

.profile-avatar {
  border-radius: 15px;
  opacity: 0.65;
}

.profile-home-link {
  display: inline-block;
  padding: 0.15rem 0;
  color: var(--color-accent-alt);
  background: var(--color-accent);
  text-align: center;
  transition: color 0.5s ease, background-color 0.5s ease;
  text-decoration: none;
  font-weight: bold;
  border-radius: 7px;
}

.profile-home-link:hover {
  color: var(--color-accent);
  background: var(--color-accent-alt);
}

.profile-bio {
  color: var(--color-primary);
  text-align: center;
  transition: color 0.5s ease;
}

</style>
