<template>
  <div class="loading-state">
    <div v-if="skeleton" class="skeleton-wrapper">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-desc"></div>
    </div>
    <div v-else class="loading-text">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
  skeleton?: boolean
}>(), {
  message: 'Đang tải...',
  skeleton: false,
})
</script>

<style scoped>
.loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.skeleton-title {
  height: 1.75rem;
  width: 40%;
  margin: 0 auto 0.5rem;
}
.skeleton-desc {
  height: 1rem;
  width: 70%;
  margin: 0 auto;
}
.skeleton {
  background: var(--color-bg-alt);
  border-radius: 4px;
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.6;
  }
}
</style>
