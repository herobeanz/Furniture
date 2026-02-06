<template>
  <div class="category-page">
    <div class="container">
      <Breadcrumb :items="breadcrumb" />

      <LoadingState v-if="loading" skeleton />
      <NotFoundView v-else-if="isNotFound" />
      <ErrorState v-else-if="error" :message="error" />

      <template v-else>
        <!-- Room view: show categories -->
        <template v-if="room && !category">
          <CategoryHeader :title="room.name" :description="room.description" />
          <CategoryGrid
            :categories="categories"
            :room-slug="roomSlug"
            :loading="loadingCategories"
          />
        </template>

        <!-- Category view: show products -->
        <template v-else-if="category">
          <CategoryHeader :title="category.name" :description="category.description" />
          <ProductFilters
            :total-products="totalProducts"
            :sort-option="sortOption"
            @update:sort-option="sortOption = $event"
          />
          <LoadingState v-if="loadingProducts" message="Đang tải sản phẩm..." />
          <EmptyState
            v-else-if="products.length === 0"
            message="Chưa có sản phẩm trong danh mục này."
          />
          <template v-else>
            <ProductGrid
              :products="products"
              :columns="4"
              show-sale-tag
              @add-to-cart="addToCart"
              @toggle-wishlist="toggleWishlist"
            />
            <Pagination :current-page="page" :total-pages="totalPages" @go-page="goPage" />
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductGrid from '@/components/ProductGrid.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import CategoryHeader from '@/components/category/CategoryHeader.vue'
import CategoryGrid from '@/components/category/CategoryGrid.vue'
import ProductFilters from '@/components/common/ProductFilters.vue'
import Pagination from '@/components/common/Pagination.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useCategoryData } from '@/composables/category/useCategoryData'
import { useProductActions } from '@/composables/useProductActions'

// Container component: orchestrates data and logic
const {
  room,
  category,
  categories,
  products,
  totalProducts,
  page,
  sortOption,
  loading,
  loadingCategories,
  loadingProducts,
  error,
  isNotFound,
  breadcrumb,
  totalPages,
  roomSlug,
  goPage,
} = useCategoryData()

const { toggleWishlist, addToCart } = useProductActions()
</script>

<style scoped>
.category-page {
  padding: 1.5rem 0 3rem;
}
</style>
