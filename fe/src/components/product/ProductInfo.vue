<template>
  <div class="product-info-panel">
    <h1 class="product-title">{{ product.name }}</h1>

    <div class="product-prices">
      <span v-if="product.isContactPrice" class="price-display price-contact">
        Liên hệ
      </span>
      <template v-else>
        <span v-if="hasDiscount" class="price-display">{{
          formatPrice(product.salePrice!)
        }}</span>
        <span v-else class="price-display">{{ formatPrice(product.price) }}</span>
        <span v-if="hasDiscount" class="price-old">{{
          formatPrice(product.price)
        }}</span>
      </template>
    </div>

    <p v-if="summaryText" class="product-summary">{{ summaryText }}</p>

    <ProductDetails :product="product" />

    <div class="product-actions">
      <a
        v-if="zaloUrl"
        :href="zaloUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="product-cta product-cta--primary"
      >
        <i class="fa-solid fa-phone" aria-hidden="true" />
        Đặt hàng qua Zalo
      </a>
      <a
        v-if="facebookUrl"
        :href="facebookUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="product-cta product-cta--outline"
      >
        <i class="fa-brands fa-facebook-messenger" aria-hidden="true" />
        Đặt hàng qua Messenger
      </a>
      <a :href="telHref" class="product-cta product-cta--call">
        <i class="fa-solid fa-phone-volume" aria-hidden="true" />
        Gọi ngay: {{ phoneDisplay }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/services/api/products'
import { formatPrice } from '@/utils/format'
import { useContactInfo } from '@/composables/common/useContactInfo'
import ProductDetails from './ProductDetails.vue'

const props = defineProps<{
  product: Product
}>()

const { phoneDisplay, phoneTel: telHref, facebookUrl, zaloUrl } = useContactInfo()

const hasDiscount = computed(
  () =>
    props.product.salePrice != null &&
    props.product.salePrice < props.product.price,
)

const summaryText = computed(() => props.product.shortDescription?.trim() || '')

</script>

<style scoped>
.product-info-panel {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 1.5rem 2rem;
}

@media (max-width: 640px) {
  .product-info-panel {
    padding: 1.25rem 1rem;
  }
}

.product-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem;
  line-height: 1.25;
}

.product-prices {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 0.75rem;
  margin-bottom: 1rem;
}

.price-display {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.price-contact {
  font-size: 1.25rem;
}

.price-old {
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.product-summary {
  font-size: 0.75rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin: 0 0 1.5rem;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.product-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-decoration: none;
  border-radius: 0.25rem;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.product-cta--primary {
  background: #5c3c24;
  color: #fff;
}

.product-cta--primary:hover {
  background: #492f1b;
  color: #fff;
}

.product-cta--outline {
  background: #fff;
  color: #1f2937;
  border: 1px solid var(--color-border-light);
}

.product-cta--outline:hover {
  background: #f9fafb;
}

.product-cta--outline i {
  color: #2563eb;
  font-size: 0.875rem;
}

.product-cta--call {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid rgba(92, 60, 36, 0.4);
  font-weight: 700;
}

.product-cta--call:hover {
  border-color: var(--color-primary);
}

.product-cta i {
  font-size: 0.6875rem;
}
</style>
