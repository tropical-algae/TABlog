<template>
  <main class="not-found-page router-elem-fade anim-slide">
    <section>
      <div class="not-found-status">
        <span class="post-tag small">HTTP 404</span>
        <span>RESOURCE NOT FOUND</span>
      </div>

      <div class="not-found-code" aria-label="404">404</div>

      <h1>Page not found.</h1>
      <p>
        The requested address is unavailable. It may have moved,
        or it may never have existed.
      </p>

      <hr class="split-line">

      <nav class="not-found-actions" aria-label="Recovery links">
        <RouterLink :to="{ name: 'Home' }">Home...</RouterLink>
        <RouterLink :to="{ name: 'Archive' }">Archive...</RouterLink>
        <RouterLink :to="{ name: 'Timeline' }">Timeline...</RouterLink>
      </nav>
    </section>
  </main>
</template>

<style scoped>
.not-found-page {
  display: flex;
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 2rem;
  overflow: hidden;
  isolation: isolate;
  align-items: center;
  justify-content: center;
}

.not-found-grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-size: 42px 42px;
  opacity: 0.12;
}

.not-found-status {
  display: flex;
  gap: 0.75rem;
  color: var(--color-primary);
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  align-items: center;
}

.not-found-code {
  display: flex;
  margin: 1.25rem 0 0;
  color: var(--color-accent-alt);
  font-size: 15rem;
  font-weight: bold;
  /* letter-spacing: -0.18em; */
  line-height: 0.85;
}

.not-found-panel h1 {
  margin: 0;
  color: var(--color-primary-alt);
  font-size: clamp(1.5rem, 5vw, 2.5rem);
}

.not-found-panel p {
  max-width: 32rem;
  margin: 1rem 0;
  color: var(--color-primary);
  line-height: 1.8;
}

.not-found-panel .split-line {
  margin: 1.75rem 0 1rem;
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
