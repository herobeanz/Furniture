<template>
  <div class="category-page">
    <div class="container">
      <Breadcrumb :items="breadcrumb" />

      <LoadingState v-if="loading" skeleton />
      <NotFoundView v-else-if="isNotFound" />
      <ErrorState v-else-if="error" :message="error" />

      <template v-else-if="category">
        <CategoryHeader :title="category.name" :description="category.description" />
        <ProductFilters
          :total-products="totalProducts"
          :sort-option="sortOption"
          @update:sort-option="sortOption = $event"
        />
        <ProductGridSkeleton v-if="loadingProducts" :columns="4" :count="8" />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductGrid from '@/components/ProductGrid.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import CategoryHeader from '@/components/category/CategoryHeader.vue'
import ProductFilters from '@/components/common/ProductFilters.vue'
import Pagination from '@/components/common/Pagination.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import ProductGridSkeleton from '@/components/skeleton/ProductGridSkeleton.vue'
import { useCategoryData } from '@/composables/category/useCategoryData'
import { useProductActions } from '@/composables/useProductActions'

// Container component: orchestrates data and logic
const {
  category,
  products,
  totalProducts,
  page,
  sortOption,
  loading,
  loadingProducts,
  error,
  isNotFound,
  breadcrumb,
  totalPages,
  goPage,
} = useCategoryData()

const { toggleWishlist, addToCart } = useProductActions()
</script>

<style scoped>
.category-page {
  padding: 1.5rem 0 3rem;
}

@media (max-width: 768px) {
  .category-page {
    padding: 1rem 0 2rem;
  }
}

@media (max-width: 480px) {
  .category-page {
    padding: 0.75rem 0 1.5rem;
  }
}
</style>
