<template>
  <div v-if="hasDetails" class="product-details">
    <h3 class="details-title">Chi tiết sản phẩm</h3>
    <ul class="details-list">
      <li v-if="product.material">
        <strong>Chất liệu:</strong> {{ product.material }}
      </li>
      <li v-if="product.dimensions">
        <strong>Kích thước:</strong> {{ product.dimensions }}
      </li>
      <li v-if="product.color">
        <strong>Màu sắc:</strong> {{ product.color }}
      </li>
      <li v-if="product.warranty">
        <strong>Bảo hành:</strong> {{ product.warranty }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/services/product.service'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const hasDetails = computed(() => {
  return !!(props.product.material || props.product.dimensions || props.product.color || props.product.warranty)
})
</script>

<style scoped>
.product-details {
  margin: 1.5rem 0;
  padding: 1.25rem;
  background: var(--color-bg-alt, #f8f8f8);
  border-radius: 8px;
}

.details-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.details-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.details-list li {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}

.details-list li strong {
  font-weight: 600;
  color: #1a1a1a;
  margin-right: 0.5rem;
}
</style>
