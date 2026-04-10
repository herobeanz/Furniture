<template>
  <article class="product-card">
    <RouterLink :to="getProductPath(product)" class="product-card-image">
      <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name" />
      <img v-else-if="product.thumbnail" :src="product.thumbnail" :alt="product.name" />
      <div v-else class="no-image">Ảnh</div>
      <!-- <span v-if="showSaleTag && hasDiscount" class="tag sale">SALE CỰC SỐC</span> -->
      <!-- <span v-if="showSaleTag && hasDiscount" class="tag discount">{{ discountPercentage }}%</span> -->
      <span v-if="showHotTag" class="tag hot">HOT</span>
      <div class="product-quickview-overlay">
        <span class="product-quickview-label">Xem chi tiết</span>
      </div>
    </RouterLink>
    <div class="product-card-info">
      <div v-if="product.sku" class="product-code">MÃ: {{ product.sku }}</div>
      <RouterLink :to="getProductPath(product)" class="product-card-name">{{ product.name }}</RouterLink>
      <div class="product-card-prices">
        <span v-if="product.isContactPrice" class="price-contact">Liên hệ</span>
        <template v-else>
          <span v-if="hasDiscount" class="price-current">{{ formatPrice(product.salePrice!) }}</span>
          <span v-if="hasDiscount" class="price-old">{{ formatPrice(product.price) }}</span>
          <span v-else class="price-current">{{ formatPrice(product.price) }}</span>
        </template>
      </div>
      <div class="product-meta-row">
        <div class="product-meta sold">
          <span class="meta-icon bag">🛍️</span>
          <span class="meta-text">
            Đã bán: {{ (product.soldCount ?? 0).toLocaleString('vi-VN') }}+
          </span>
        </div>
        <div class="product-meta rating" v-if="product.rating != null">
          <span class="meta-icon star">⭐</span>
          <span class="meta-text">
            {{ product.rating.toFixed(1) }}/5
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/services/product.service'
import { formatPrice } from '@/utils/format'
import { getProductPath } from '@/utils/navigation'

const props = withDefaults(
  defineProps<{
    product: Product
    showSaleTag?: boolean
    showHotTag?: boolean
  }>(),
  { showSaleTag: true, showHotTag: false }
)

// Calculate discount
const hasDiscount = computed(() => {
  return props.product.salePrice != null && props.product.salePrice < props.product.price
})
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
.product-card-image {
  position: relative;
  display: block;
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  overflow: hidden;
}
.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.875rem;
}
.product-quickview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
  transition: opacity 0.2s ease, background 0.2s ease;
}
.product-card:hover .product-quickview-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.18);
  pointer-events: auto;
}
.product-quickview-label {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: #fff;
  color: #333;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}
.tag {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: #fff;
}
.tag.sale {
  background: var(--color-primary);
  top: 8px;
  left: 8px;
}
.tag.discount {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--color-primary);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: #fff;
}
.tag.hot {
  background: #c00;
  top: 8px;
  right: 8px;
  /* left: auto; */
  right: auto;
}
.product-card-info {
  padding: 1rem;
}
.product-code {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}
.product-card-name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}
.product-card-name:hover {
  color: var(--color-primary);
}
.product-card-prices {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}
.price-current {
  font-weight: 700;
  color: var(--color-primary);
}
.price-contact {
  font-weight: 700;
  color: #111827;
}
.price-old {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
}
.product-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}
.product-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #111827;
}
.product-meta .meta-icon {
  font-size: 0.9rem;
}
.product-meta.rating .meta-icon {
  color: #facc15;
}

@media (max-width: 768px) {
  .product-card-info {
    padding: 0.875rem;
  }
  .product-card-name {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }
  .product-card-prices {
    margin-bottom: 0.4rem;
  }
  .price-current {
    font-size: 0.95rem;
  }
  .price-old {
    font-size: 0.8rem;
  }
  .btn-add-cart {
    padding: 0.45rem 0.65rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .product-card-info {
    padding: 0.75rem;
  }
  .product-code {
    font-size: 0.75rem;
  }
  .product-card-name {
    font-size: 0.85rem;
    line-height: 1.4;
  }
  .btn-add-cart {
    font-size: 0.7rem;
    padding: 0.4rem 0.5rem;
  }
}
</style>
