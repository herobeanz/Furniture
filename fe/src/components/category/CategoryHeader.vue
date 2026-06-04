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
  font-size: var(--fs-subtitle);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.category-desc {
  color: var(--color-text-muted);
  font-size: var(--fs-body);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .category-header {
    margin-bottom: 1.25rem;
  }

  .category-title {
    font-size: var(--fs-section-title);
  }

  .category-desc {
    font-size: var(--fs-body-sm);
  }
}

@media (max-width: 480px) {
  .category-header {
    margin-bottom: 1rem;
  }

  .category-title {
    font-size: var(--fs-card-title);
  }

  .category-desc {
    font-size: var(--fs-body-sm);
  }
}
</style>
