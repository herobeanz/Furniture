<template>
  <section class="home-daily-sale-section">
    <div class="container">
      <h2 class="flash-title">Daily Flash Sale!</h2>
      <div class="flash-countdown" v-if="countdownText">{{ countdownText }}</div>
      <ProductGridSkeleton v-if="loading" :columns="4" :count="4" />
      <div v-else-if="products.length === 0" class="empty">Chưa có sản phẩm.</div>
      <div v-else class="product-grid four-cols">
        <article v-for="product in products" :key="product.id" class="product-card flash-card">
          <RouterLink :to="getProductPath(product)" class="product-image-wrap">
            <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name" />
            <div v-else class="no-image">Ảnh</div>
            <span v-if="countdownText" class="flash-countdown-tag">{{ countdownText }}</span>
            <span v-if="product.salePrice" class="product-sale-tag">Sale</span>
          </RouterLink>
          <div class="product-info">
            <RouterLink :to="getProductPath(product)" class="product-name">{{ product.name }}</RouterLink>
            <div class="product-prices">
              <span v-if="product.salePrice" class="price-old">{{ formatPrice(product.salePrice) }}</span>
              <span class="price-current">{{ formatPrice(product.price) }}</span>
            </div>
            <div class="product-actions">
              <button type="button" class="action-btn add-cart" @click="$emit('addToCart', product)">Thêm vào giỏ hàng</button>
              <button
                type="button"
                class="action-btn icon-only"
                :class="{ active: isInWishlist(product.id) }"
                @click="$emit('toggleWishlist', product)"
                title="Yêu thích"
              >
                ♥
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ProductGridSkeleton from '../skeleton/ProductGridSkeleton.vue'
import type { Product } from '../../services/product.service'
import { formatPrice } from '../../utils/format'
import { getProductPath } from '../../utils/navigation'
import { useProductActions } from '../../composables/useProductActions'

interface Props {
  products: Product[]
  countdownText?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

defineEmits<{
  addToCart: [product: Product]
  toggleWishlist: [product: Product]
}>()

const { isInWishlist } = useProductActions()
</script>

<style scoped>
.home-daily-sale-section {
  padding: 2.5rem 0;
  background: var(--color-bg-alt);
}
.flash-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.flash-countdown {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.product-grid {
  display: grid;
  gap: 1.25rem;
}
.four-cols {
  grid-template-columns: repeat(4, 1fr);
}
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
.product-image-wrap {
  position: relative;
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  overflow: hidden;
  display: block;
}
.product-image-wrap img {
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
.flash-countdown-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  background: rgba(204, 0, 0, 0.9);
  color: #fff;
  font-size: 0.7rem;
  padding: 0.25rem;
  text-align: center;
  border-radius: 4px;
}
.product-sale-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
.product-info {
  padding: 1rem;
}
.product-name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}
.product-name:hover {
  color: var(--color-primary);
}
.product-prices {
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
.price-old {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
}
.product-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.action-btn {
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.action-btn.add-cart {
  flex: 1;
  background: var(--color-primary);
  color: #fff;
}
.action-btn.add-cart:hover {
  background: var(--color-primary-hover, #a00);
}
.action-btn.icon-only {
  width: 32px;
  padding: 0.4rem;
  border: 1px solid var(--color-border);
  background: #fff;
}
.action-btn.icon-only:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.action-btn.icon-only {
  width: 32px;
  padding: 0.4rem;
}
.action-btn.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .four-cols {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .four-cols {
    grid-template-columns: 1fr;
  }
}
</style>
