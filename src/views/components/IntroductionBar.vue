<script setup>
import GithubIcon from '@/assets/icons/icons8-github.svg?component'
import DiscordIcon from '@/assets/icons/icons8-discord.svg?component'
import NotionIcon from '@/assets/icons/icons8-notion.svg?component'
import WebsiteIcon from '@/assets/icons/icons8-website.svg?component'

import { useConfigStore } from '@/scripts/configStore'

// const { introduction } = defineProps({
//   'introduction': {
//     type: String,
//     required: true
//   }
// })

const config = useConfigStore()

const socialLink = [
  { icon: GithubIcon, link: config.links.github },
  { icon: NotionIcon, link: config.links.notion },
  { icon: DiscordIcon, link: config.links.discord },
  { icon: WebsiteIcon, link: config.links.website },
]

</script>


<template>
  <div class="d-flex flex-column mt-5 me-5">
    <!-- <img src="/images/avatar.jpg" class="introduction-image img-fluid mb-3" alt=""> -->
    
    <div class="d-flex flex-wrap justify-content-center align-items-center my-1 gap-3">
      <a v-for="(item, index) in socialLink" :key="index" :href="item.link" 
      class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center align-items-center">
        <component :is="item.icon" class="icon-style" />
      </a>
    </div>
    
    <hr class="split-line my-3"/>
    
    <div class="introduction-content my-1"> {{ config.introduction }} </div>
  </div>
</template>

<style>

</style>