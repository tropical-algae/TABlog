<template>
  <div
    class="link-style-scope"
    :class="scopeClass"
    :style="scopeStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  variant: {
    type: String,
    default: "default"  /* normal filled default */
  },
  selectable: {
    type: Boolean,
    default: false
  },
  backgroundRadius: {
    type: String,
    default: ""
  },
  hoverScale: {
    type: Number,
    default: null
  },
  color: {
    type: String,
    default: ""
  },
  selectColor: {
    type: String,
    default: ""
  }
})

const scopeClass = computed(() => (
  [
    props.variant && props.variant !== "default" ? `link-style-scope-${props.variant}` : "",
    { "link-style-scope-selectable": props.selectable }
  ]
))

const scopeStyle = computed(() => (
  [
    props.color
      ? { "--bubble-link-color": props.color }
      : undefined,
    props.selectColor
      ? { "--bubble-link-hover-color": props.selectColor }
      : undefined,
    props.backgroundRadius
      ? { "--bubble-link-border-radius": props.backgroundRadius }
      : undefined,
    props.hoverScale
      ? { "--bubble-link-hover-scale": props.hoverScale }
      : undefined
    ]
))
</script>

<style scoped>
.link-style-scope {
  display: contents;
  --bubble-link-weight: 700;
  --bubble-link-border-radius: 6px;
  --bubble-link-color: var(--color-accent-alt);
  --bubble-link-bg: var(--color-accent);
  --bubble-link-hover-color: var(--bubble-link-color);
  --bubble-link-hover-bg: var(--bubble-link-bg);
  --bubble-link-active-color: var(--bubble-link-hover-color);
  --bubble-link-active-bg: var(--bubble-link-hover-bg);
  --bubble-link-bg-opacity: 0;
  --bubble-link-hover-bg-opacity: 1;
  --bubble-link-active-bg-opacity: 1;
  --bubble-link-padding: 0.15rem 0.5rem;
  --bubble-link-bg-scale: 0.85;
  --bubble-link-hover-scale: 1;
  --bubble-link-active-scale: 0.95;
  --bubble-link-easing: cubic-bezier(0.34, 1.6, 0.64, 1);
  --bubble-link-color-duration: 0.24s;
  --bubble-link-opacity-duration: 0.22s;
  --bubble-link-transform-duration: 0.32s;
}

.link-style-scope-filled {
  --bubble-link-border-radius: 3px;
  --bubble-link-color: var(--color-accent-alt);
  --bubble-link-bg: var(--color-accent);

  --bubble-link-hover-color: var(--color-accent);
  --bubble-link-hover-bg: var(--color-accent-alt);
  --bubble-link-active-color: var(--bubble-link-hover-color);
  --bubble-link-active-bg: var(--bubble-link-hover-bg);
  --bubble-link-easing: cubic-bezier(0.34, 1.76, 0.64, 1);
  --bubble-link-bg-opacity: 1;
  --bubble-link-bg-scale: 1;
  --bubble-link-hover-scale: 1.1;
}

.link-style-scope-normal {
  --bubble-link-weight: 400;
  --bubble-link-padding: 0;

  --bubble-link-color: var(--color-accent);
  --bubble-link-bg: var(--color-accent-alt);

  --bubble-link-hover-color: var(--color-accent-alt);
  --bubble-link-hover-bg: var(--color-accent-alt);
  --bubble-link-bg-opacity: 0;
  --bubble-link-hover-bg-opacity: 0;
  --bubble-link-active-bg-opacity: 0;
  --bubble-link-bg-scale: 1;
  --bubble-link-hover-scale: 1;
  --bubble-link-active-scale: 1;

  --bubble-link-color-duration: 0.35s;
}

.link-style-scope :where(a) {
  display: inline-block;
  position: relative;
  font-weight: var(--bubble-link-weight);
  padding: var(--bubble-link-padding);
  z-index: 0;
  color: var(--bubble-link-color);
  fill: var(--bubble-link-color);
  stroke: var(--bubble-link-color);
  background-color: transparent;
  text-decoration: none;
  transition: 
    color var(--bubble-link-color-duration) ease,
    fill var(--bubble-link-color-duration) ease,
    stroke var(--bubble-link-color-duration) ease;
}

.link-style-scope :where(a)::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: var(--bubble-link-border-radius);
  background-color: var(--bubble-link-bg);
  opacity: var(--bubble-link-bg-opacity);
  transform: scale(var(--bubble-link-bg-scale));
  transform-origin: center;
  transition:
    opacity var(--bubble-link-opacity-duration) ease,
    background-color var(--bubble-link-color-duration) ease,
    transform var(--bubble-link-transform-duration) var(--bubble-link-easing);
  will-change: transform, background-color, opacity;
}

.link-style-scope :where(a:hover, a:focus-visible) {
  color: var(--bubble-link-hover-color);
  fill: var(--bubble-link-hover-color);
  stroke: var(--bubble-link-hover-color);
  outline: none;
}

.link-style-scope :where(a:hover, a:focus-visible)::before {
  background-color: var(--bubble-link-hover-bg);
  opacity: var(--bubble-link-hover-bg-opacity);
  transform: scale(var(--bubble-link-hover-scale));
}

.link-style-scope :where(a:active) {
  color: var(--bubble-link-active-color);
  fill: var(--bubble-link-active-color);
  stroke: var(--bubble-link-active-color);
}

.link-style-scope :where(a:active)::before {
  background-color: var(--bubble-link-active-bg);
  opacity: var(--bubble-link-active-bg-opacity);
  transform: scale(var(--bubble-link-active-scale));
}

.link-style-scope-selectable :where(a.selected) {
  color: var(--bubble-link-bg);
}

.link-style-scope-selectable :where(a.selected)::before {
  --bubble-link-bg-opacity: 1;
  --bubble-link-hover-bg-opacity: 1;
  --bubble-link-active-bg-opacity: 1;
  background-color: var(--bubble-link-color);
}

@media screen and (hover: none) and (pointer: coarse) {

  .link-style-scope :where(a) {
    -webkit-tap-highlight-color: transparent;
  }

  .link-style-scope :where(a:hover) {
    color: var(--bubble-link-color);
  }

  .link-style-scope :where(a:hover)::before {
    background-color: var(--bubble-link-bg);
    opacity: var(--bubble-link-bg-opacity);
    transform: scale(var(--bubble-link-bg-scale));
  }

  .link-style-scope :where(a:active) {
    color: var(--bubble-link-hover-color);
  }

  .link-style-scope :where(a:active)::before {
    background-color: var(--bubble-link-hover-bg);
    opacity: var(--bubble-link-hover-bg-opacity);
    transform: scale(var(--bubble-link-active-scale));
  }

  .link-style-scope-selectable :where(a.selected, a.selected:hover) {
    color: var(--color-accent);
  }

  .link-style-scope-selectable :where(a.selected, a.selected:hover)::before {
    background-color: var(--color-accent-alt);
  }

}
</style>
