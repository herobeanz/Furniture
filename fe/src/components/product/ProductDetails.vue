<template>
  <div v-if="hasDetails" class="product-specs">
    <div v-if="product.material" class="product-spec-row">
      <span class="product-spec-label">
        <i class="fa-solid fa-cubes" aria-hidden="true" />
        Chất liệu:
      </span>
      <span class="product-spec-value">{{ product.material }}</span>
    </div>
    <div v-if="product.dimensions" class="product-spec-row">
      <span class="product-spec-label">
        <i class="fa-solid fa-arrows-left-right" aria-hidden="true" />
        Kích thước:
      </span>
      <span class="product-spec-value">{{ product.dimensions }}</span>
    </div>
    <div v-if="product.color" class="product-spec-row">
      <span class="product-spec-label">
        <i class="fa-solid fa-palette" aria-hidden="true" />
        Màu sắc:
      </span>
      <span class="product-spec-value">{{ product.color }}</span>
    </div>
    <div v-if="product.warranty" class="product-spec-row">
      <span class="product-spec-label">
        <i class="fa-solid fa-shield-halved" aria-hidden="true" />
        Bảo hành:
      </span>
      <span class="product-spec-value">{{ product.warranty }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/services/api/products'

const props = defineProps<{
  product: Product
}>()

const hasDetails = computed(
  () =>
    !!(
      props.product.material ||
      props.product.dimensions ||
      props.product.color ||
      props.product.warranty
    ),
)
</script>

<style scoped>
.product-specs {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-spec-row {
  display: grid;
  grid-template-columns: minmax(7rem, 1fr) 3fr;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--fs-body-sm);
}

.product-spec-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-light);
  font-weight: 500;
}

.product-spec-label i {
  font-size: var(--fs-body-sm);
  color: var(--color-primary);
  width: 0.875rem;
  text-align: center;
}

.product-spec-value {
  color: var(--color-heading);
  font-weight: 600;
}

@media (max-width: 480px) {
  .product-spec-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
