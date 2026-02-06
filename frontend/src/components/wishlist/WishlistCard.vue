<template>
  <div class="wishlist-card">
    <RouterLink :to="productLink" class="wishlist-image">
      <img v-if="item.image" :src="item.image" :alt="item.name" />
      <div v-else class="no-img">Ảnh</div>
    </RouterLink>
    <div class="wishlist-info">
      <RouterLink :to="productLink" class="wishlist-name">{{ item.name }}</RouterLink>
      <p class="wishlist-price">{{ formatPrice(item.price) }}</p>
      <div class="wishlist-actions">
        <button type="button" class="btn btn-primary btn-sm" @click="$emit('addToCart')">
          Thêm vào giỏ hàng
        </button>
        <button type="button" class="btn btn-outline btn-sm" @click="$emit('viewProduct')">
          Xem sản phẩm
        </button>
        <button type="button" class="btn-remove" @click="$emit('remove')">
          Xóa khỏi yêu thích
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { WishlistItem } from '@/stores/wishlist'
import { formatPrice } from '@/utils/format'

interface Props {
  item: WishlistItem
  productLink: string
}

defineProps<Props>()

defineEmits<{
  addToCart: []
  viewProduct: []
  remove: []
}>()
</script>

<style scoped>
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
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
}
.btn-remove:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
