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
  <div class="d-flex flex-column mt-0 mx-5">

    <img src="/images/avatar.png" class="introduction-image img-fluid my-2" alt="">

    <!-- <router-link :to="{ name: 'Home'}" class="introduction-img-link mb-3">
      <img src="/images/avatar.png" class="img-fluid" alt="">
    </router-link> -->
    
    <div class="d-flex flex-wrap justify-content-center align-items-center my-2 gap-3">
      <a v-for="(item, index) in socialLink" :key="index" :href="item.link" 
        class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center align-items-center"
      >
        <component :is="item.icon" class="icon-style" />
      </a>
    </div>

    <div class="introduction-home-link my-2">
      <router-link :to="{ name: 'Home'}" class="w-100 mb-0">Home</router-link>
    </div>
    
    <hr class="split-line my-2"/>
    
    <div class="introduction-content py-0 my-2"> {{ config.introduction }} </div>
  </div>
</template>

<style>

</style>