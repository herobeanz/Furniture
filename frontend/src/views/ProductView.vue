<template>
  <div class="product-page">
    <div class="container">
      <Breadcrumb :items="breadcrumb" />

      <NotFoundView v-if="isNotFound" />
      <ErrorState v-else-if="error" :message="error" />
      <ProductDetailSkeleton v-else-if="loading && !product" />

      <template v-else-if="product">
        <section class="product-detail">
          <ProductGallery
            :images="(product.images || []) as string[]"
            :current-image="currentImage || ''"
            :product-name="product.name"
            :selected-index="selectedIndex"
            @select-image="setSelectedImage"
          />
          <ProductInfo
            :product="product"
            :quantity="quantity"
            :in-wishlist="inWishlist"
            @add-to-cart="handleAddToCart"
            @toggle-wishlist="handleToggleWishlist"
            @update-quantity="setQuantity"
          />
        </section>

        <section v-if="related.length > 0" class="related-section">
          <h2 class="section-title">Sản phẩm liên quan</h2>
          <ProductGrid
            :products="related"
            :columns="4"
            show-sale-tag
            @add-to-cart="handleAddToCartRelated"
            @toggle-wishlist="handleToggleWishlistRelated"
          />
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProductGrid from '@/components/ProductGrid.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductInfo from '@/components/product/ProductInfo.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import ProductDetailSkeleton from '@/components/skeleton/ProductDetailSkeleton.vue'
import { useProductData } from '@/composables/product/useProductData'
import { useCart } from '@/composables/useCart'
import { useProductActions } from '@/composables/useProductActions'
import type { Product } from '@/services/product.service'

// Container component: orchestrates data and logic
const {
  product,
  related,
  loading,
  error,
  isNotFound,
  selectedIndex,
  quantity,
  currentImage,
  breadcrumb,
  setSelectedImage,
  setQuantity,
} = useProductData()

const { addItem } = useCart()
const { toggleWishlist: toggleWishlistComposable, isInWishlist, addToCart: addToCartComposable } = useProductActions()

const inWishlist = computed(() =>
  product.value ? isInWishlist(product.value.id) : false
)

function handleAddToCart() {
  if (!product.value) return
  addItem({
    id: String(product.value.id),
    name: product.value.name,
    price: product.value.price,
    quantity: quantity.value,
    image: product.value.images?.[0] || product.value.thumbnail,
    slug: product.value.slug,
    breadcrumb: product.value.breadcrumb,
  })
  // Toast is automatically shown by useCart composable
}

function handleToggleWishlist() {
  if (!product.value) return
  toggleWishlistComposable(product.value)
  // Toast is automatically shown by useProductActions composable
}

function handleAddToCartRelated(p: Product) {
  addToCartComposable(p)
  // Toast is automatically shown by useProductActions composable
}

function handleToggleWishlistRelated(p: Product) {
  toggleWishlistComposable(p)
  // Toast is automatically shown by useProductActions composable
}
</script>

<style scoped>
.product-page {
  padding: 1.5rem 0 3rem;
}
.breadcrumb {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}
.breadcrumb .sep {
  margin: 0 0.5rem;
}
.breadcrumb a:hover {
  color: var(--color-primary);
}
.skeleton-text {
  opacity: 0.7;
}
.error-msg {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.error-msg .btn {
  margin-top: 1rem;
}
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: start;
}
@media (max-width: 900px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
.product-gallery {
  position: sticky;
  top: calc(var(--header-height, 60px) + 1rem);
}
.gallery-main {
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gallery-main .no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.thumb {
  width: 64px;
  height: 64px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background: var(--color-bg-alt);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb.active,
.thumb:hover {
  border-color: var(--color-primary);
}
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
.add-to-cart-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
.quantity-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.quantity-wrap label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.qty-input {
  width: 4rem;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
}
.btn-add-cart {
  padding: 0.75rem 1.5rem;
}
.btn-wishlist.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.related-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>
