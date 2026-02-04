<template>
  <div class="ui-skeleton" :class="{ 'ui-skeleton-circle': circle }" :style="style" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    width?: string | number
    height?: string | number
    circle?: boolean
  }>(),
  { circle: false }
)

const style = computed(() => {
  const s: Record<string, string> = {}
  if (props.width) s.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height) s.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  return s
})
</script>

<style scoped>
.ui-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-alt) 25%,
    #eee 50%,
    var(--color-bg-alt) 75%
  );
  background-size: 200% 100%;
  animation: ui-skeleton-shine 1.2s ease-in-out infinite;
  border-radius: 6px;
}
.ui-skeleton-circle {
  border-radius: 50%;
}
@keyframes ui-skeleton-shine {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
