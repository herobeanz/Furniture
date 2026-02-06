<template>
  <article class="product-card">
    <RouterLink :to="getProductPath(product)" class="product-card-image">
      <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name" />
      <img v-else-if="product.thumbnail" :src="product.thumbnail" :alt="product.name" />
      <div v-else class="no-image">Ảnh</div>
      <span v-if="showSaleTag && product.salePrice" class="tag sale">Sale</span>
      <span v-if="showHotTag" class="tag hot">HOT</span>
    </RouterLink>
    <div class="product-card-info">
      <RouterLink :to="getProductPath(product)" class="product-card-name">{{ product.name }}</RouterLink>
      <div class="product-card-prices">
        <span v-if="product.salePrice" class="price-old">{{ formatPrice(product.salePrice) }}</span>
        <span class="price-current">{{ formatPrice(product.price) }}</span>
      </div>
      <div class="product-card-actions">
        <button type="button" class="btn-add-cart" @click="$emit('addToCart', product)">+ Thêm vào giỏ</button>
        <button
          type="button"
          class="btn-wishlist"
          :class="{ active: inWishlist }"
          @click="$emit('toggleWishlist', product)"
          title="Yêu thích"
        >
          ♥
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/services/product.service'
import { formatPrice } from '@/utils/format'
import { getProductPath } from '@/utils/navigation'
import { useWishlistStore } from '@/stores/wishlist'

const props = withDefaults(
  defineProps<{
    product: Product
    showSaleTag?: boolean
    showHotTag?: boolean
  }>(),
  { showSaleTag: true, showHotTag: false }
)

defineEmits<{
  addToCart: [product: Product]
  toggleWishlist: [product: Product]
}>()

const wishlistStore = useWishlistStore()
const inWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))
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
}
.tag.hot {
  background: #c00;
}
.product-card-info {
  padding: 1rem;
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
.price-old {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
}
.product-card-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.btn-add-cart {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.btn-add-cart:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.btn-wishlist {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
}
.btn-wishlist:hover,
.btn-wishlist.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
</style>
