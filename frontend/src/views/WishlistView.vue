<template>
  <div class="wishlist-page container">
    <h1>Yêu thích</h1>
    <div v-if="items.length === 0" class="empty">
      <p>Chưa có sản phẩm nào trong danh sách yêu thích.</p>
      <RouterLink to="/" class="btn btn-primary">Khám phá sản phẩm</RouterLink>
    </div>
    <div v-else class="wishlist-grid">
      <div v-for="item in items" :key="item.id" class="wishlist-card">
        <RouterLink :to="productLink(item)" class="wishlist-image">
          <img v-if="item.image" :src="item.image" :alt="item.name" />
          <div v-else class="no-img">Ảnh</div>
        </RouterLink>
        <div class="wishlist-info">
          <RouterLink :to="productLink(item)" class="wishlist-name">{{ item.name }}</RouterLink>
          <p class="wishlist-price">{{ formatPrice(item.price) }}</p>
          <div class="wishlist-actions">
            <button type="button" class="btn btn-primary btn-sm" @click="addToCart(item)">
              Thêm vào giỏ
            </button>
            <button type="button" class="btn btn-outline btn-sm" @click="goToProduct(item)">
              Xem sản phẩm
            </button>
            <button type="button" class="btn-remove" @click="removeItem(item.id)">
              Xóa khỏi yêu thích
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { useWishlist } from '@/composables/useWishlist'
import { useCart } from '@/composables/useCart'
import type { WishlistItem } from '@/stores/wishlist'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const { items, removeItem } = useWishlist()
const { addItem } = useCart()

function addToCart(item: WishlistItem) {
  addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: 1,
    image: item.image,
    slug: item.slug,
  })
}

function productLink(item: { id: string; slug?: string }) {
  return '/product/' + (item.slug || item.id)
}

function goToProduct(item: { id: string; slug?: string }) {
  router.push(productLink(item))
}
</script>

<style scoped>
.wishlist-page {
  padding: 2rem 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}
.wishlist-page h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
.empty {
  text-align: center;
  padding: 3rem;
}
.empty p {
  margin-bottom: 1rem;
  color: var(--color-text-muted);
}
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
.wishlist-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.wishlist-image {
  display: block;
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  overflow: hidden;
}
.wishlist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.875rem;
}
.wishlist-info {
  padding: 1rem;
}
.wishlist-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}
.wishlist-name:hover {
  color: var(--color-primary);
}
.wishlist-price {
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}
.wishlist-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}
.btn-remove {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.btn-remove:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
