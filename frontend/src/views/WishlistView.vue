<template>
  <div class="wishlist-page container">
    <h1>Yêu thích</h1>
    <EmptyState
      v-if="items.length === 0"
      message="Chưa có sản phẩm nào trong danh sách yêu thích."
      action-text="Khám phá sản phẩm"
      action-link="/"
    />
    <div v-else class="wishlist-grid">
      <WishlistCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :product-link="productLink(item)"
        @add-to-cart="addToCart(item)"
        @view-product="goToProduct(item)"
        @remove="removeItem(item.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyState from '@/components/common/EmptyState.vue'
import WishlistCard from '@/components/wishlist/WishlistCard.vue'
import { useWishlistData } from '@/composables/wishlist/useWishlistData'
import { useProductActions } from '@/composables/useProductActions'

// Container component: orchestrates data and logic
const { items, removeItem, productLink, goToProduct } = useWishlistData()
const { addToCart } = useProductActions()
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
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
</style>
