<template>
  <div class="product-info">
    <h1 class="product-name">{{ product.name }}</h1>
    <div class="product-prices">
      <span v-if="product.isContactPrice" class="price-contact">Liên hệ</span>
      <template v-else>
        <span class="price-current">{{ formatPrice(product.price) }}</span>
        <span v-if="product.salePrice" class="price-old">
          {{ formatPrice(product.salePrice) }}
        </span>
        <span v-if="product.salePrice" class="sale-badge">Sale</span>
      </template>
    </div>

    <ProductDetails :product="product" />

    <p v-if="product.description" class="product-desc">
      {{ product.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/services/api/products'
import { formatPrice } from '@/utils/format'
import ProductDetails from './ProductDetails.vue'

defineProps<{
  product: Product
}>()
</script>

<style scoped>
.product-info {
  min-width: 0;
}
.product-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}
.product-prices {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.price-current {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}
.price-contact {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}
.price-old {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}
.sale-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 4px;
}
.product-desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
}
</style>
