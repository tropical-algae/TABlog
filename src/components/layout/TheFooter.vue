<template>
  <footer class="copyright-area">
    <span 
      class="text-center small link-raw" 
      v-html="'&copy; ' + configStore.copyright"
    ></span>
  </footer>
</template>

<script setup>
import { useConfigStore } from '@/stores/config';
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
  justify-content: left;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  transition: color 0.5s ease;
}

.copyright-area :deep(a) {
  /* all: initial !important; */
  /* font-weight: bold; */
  text-decoration: none;
  color: var(--color-primary-alt);
  transition: color 0.5s ease;
}

.copyright-area :deep(a:hover) {
  color: var(--color-accent-alt);
}

.copyright-area :deep(a:active) {
  color: var(--color-primary);
}

</style>
