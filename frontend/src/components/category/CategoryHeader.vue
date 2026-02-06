<template>
  <div class="category-header">
    <h1 class="category-title">{{ title }}</h1>
    <p v-if="description" class="category-desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<style scoped>
.category-header {
  margin-bottom: 1.5rem;
}
.category-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.category-desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
</style>
