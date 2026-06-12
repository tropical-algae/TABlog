<template>
  <footer class="copyright-area">
    <LinkStyleScope variant="normal">
      <span class="text-center small" v-html="'&copy; ' + configStore.copyright"></span>
    </LinkStyleScope>
  </footer>
</template>

<script setup>
import LinkStyleScope from '@/components/common/LinkStyleScope.vue'
import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()
</script>

<style scoped>
.copyright-area {
  display: flex;
  width: 100%;
  height: 1.5rem;
  color: var(--color-accent-alt);
  overflow-x: hidden;
  white-space: nowrap;
  justify-content: left; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  transition: color 0.5s ease;
}
</style>
