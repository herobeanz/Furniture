<template>
  <div class="product-grid" :class="columnsClass">
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
      :show-sale-tag="showSaleTag"
      :show-hot-tag="showHotTag && isHot(p)"
      @add-to-cart="$emit('addToCart', $event)"
      @toggle-wishlist="$emit('toggleWishlist', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'
import type { Product } from '@/services/product.service'

const props = withDefaults(
  defineProps<{
    products: Product[]
    columns?: 2 | 3 | 4
    showSaleTag?: boolean
    showHotTag?: boolean
    hotCount?: number
  }>(),
  { columns: 4, showSaleTag: true, showHotTag: false, hotCount: 0 }
)

defineEmits<{
  addToCart: [product: Product]
  toggleWishlist: [product: Product]
}>()

const columnsClass = computed(() => `cols-${props.columns}`)

function isHot(p: Product) {
  if (props.hotCount <= 0) return false
  const index = props.products.findIndex((x) => x.id === p.id)
  return index >= 0 && index < props.hotCount
}
</script>

<style scoped>
.product-grid {
  display: grid;
  gap: 1.25rem;
}
.product-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}
.product-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}
.product-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}
@media (max-width: 1024px) {
  .product-grid {
    gap: 1rem;
  }
  .product-grid.cols-4,
  .product-grid.cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    gap: 0.875rem;
  }
}

@media (max-width: 600px) {
  .product-grid {
    gap: 0.75rem;
  }
  .product-grid.cols-2,
  .product-grid.cols-3,
  .product-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .product-grid {
    gap: 0.625rem;
  }
}
</style>
