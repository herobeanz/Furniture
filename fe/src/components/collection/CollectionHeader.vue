<template>
  <div class="collection-header">
    <h1 class="collection-title">{{ title }}</h1>
    <p v-if="description" class="collection-desc">{{ description }}</p>
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
.collection-header {
  margin-bottom: 1.5rem;
}
.collection-title {
  font-size: var(--fs-subtitle);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.collection-desc {
  color: var(--color-text-muted);
  font-size: var(--fs-body);
}
</style>
