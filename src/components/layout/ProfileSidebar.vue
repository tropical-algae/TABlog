<template>
  <div>
    <div class="px-2">
      <img src="/images/avatar.png" class="profile-avatar img-fluid my-2" alt="">
    </div>
    
    <div class="d-flex flex-wrap justify-content-center align-items-center my-1 gap-3">
      <LinkStyleScope variant="normal" color="var(--color-primary-alt)">
        <a v-for="(item, index) in socialLink" :key="index" :href="item.link"
          class="col-2 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center align-items-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <component :is="item.icon" class="social-link-icon" />
        </a>
      </LinkStyleScope>
    </div>

    <div class="my-2">
      <LinkStyleScope variant="filled" background-radius="7px">
        <RouterLink :to="{ name: 'Home'}" class="profile-home-link w-100">Home</RouterLink>
      </LinkStyleScope>
    </div>

    <hr class="split-line my-0"/>
    <div class="profile-bio my-2"> {{ configStore.introduction }} </div>
    <hr class="split-line my-0"/>

    <LinkStyleScope variant="filled" hover-scale="1.17" selectable>
      <div class="post-tags justify-content-center my-2" v-if="tags">
        <RouterLink
          :to="{ name: 'Archive'}"
          v-for="tag in tags" :key="tag"
          class="post-tag small"
          :class="{ 'selected': isSelected(tag) }"
          @click="switchSelectStatus(tag)"
        >
        {{ tag }}
        </RouterLink>
      </div>
    </LinkStyleScope>
  </div>
</template>

<script setup>
import GithubIcon from '@/assets/icons/icons8-github.svg?component'
import DiscordIcon from '@/assets/icons/icons8-discord.svg?component'
import NotionIcon from '@/assets/icons/icons8-notion.svg?component'
import WebsiteIcon from '@/assets/icons/icons8-website.svg?component'
import LinkStyleScope from '@/components/common/LinkStyleScope.vue'
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
}

.profile-avatar {
  border-radius: 15px;
  opacity: 0.75;
}

.profile-home-link {
  text-align: center;
  overflow: visible;
}

.profile-bio {
  color: var(--color-primary);
  text-align: center;
  transition: color 0.5s ease;
}

</style>
