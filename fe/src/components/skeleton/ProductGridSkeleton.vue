<template>
  <div class="product-grid-skeleton" :class="`cols-${columns}`">
    <ProductSkeleton v-for="i in count" :key="i" />
  </div>
</template>

<script setup lang="ts">
import ProductSkeleton from './ProductSkeleton.vue'

withDefaults(
  defineProps<{
    columns?: number
    count?: number
  }>(),
  {
    columns: 4,
    count: 8,
  }
)
</script>

<style scoped>
.product-grid-skeleton {
  display: grid;
  gap: 1.25rem;
}

.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  .cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid-skeleton {
    grid-template-columns: 1fr;
  }
}
</style>
