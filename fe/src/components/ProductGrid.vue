<template>
  <div class="product-grid" :class="columnsClass">
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
      :variant="variant"
      :show-sale-tag="showSaleTag"
      :show-hot-tag="showHotTag && isHot(p)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProductCard from "./ProductCard.vue";
import type { Product } from "@/services/api/products";

const props = withDefaults(
  defineProps<{
    products: Product[];
    columns?: 2 | 3 | 4;
    variant?: "default" | "compact";
    showSaleTag?: boolean;
    showHotTag?: boolean;
    hotCount?: number;
  }>(),
  { columns: 4, variant: "default", showSaleTag: true, showHotTag: false, hotCount: 0 },
);

const columnsClass = computed(() => `cols-${props.columns}`);

function isHot(p: Product) {
  if (props.hotCount <= 0) return false;
  const index = props.products.findIndex((x) => x.id === p.id);
  return index >= 0 && index < props.hotCount;
}
</script>

<style scoped>
.product-grid {
  display: grid;
  gap: 1.5rem;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* Large Desktop */
@media (max-width: 1440px) {
  .product-grid {
    gap: 1.375rem;
  }
}

/* Desktop */
@media (max-width: 1280px) {
  .product-grid {
    gap: 1.25rem;
  }
}

/* Tablet Landscape */
@media (max-width: 1024px) {
  .product-grid {
    gap: 1.125rem;
  }

  .product-grid.cols-4 {
    grid-template-columns: repeat(3, 1fr);
  }

  .product-grid.cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet Portrait */
@media (max-width: 768px) {
  .product-grid {
    gap: 1rem;
  }

  .product-grid.cols-4,
  .product-grid.cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile Landscape */
@media (max-width: 640px) {
  .product-grid {
    gap: 0.875rem;
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  .product-grid {
    gap: 0.75rem;
  }

  .product-grid.cols-2,
  .product-grid.cols-3,
  .product-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Small Mobile */
@media (max-width: 360px) {
  .product-grid {
    gap: 0.625rem;
  }
}
</style>
