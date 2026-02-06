<template>
  <div class="collection-page">
    <div class="container">
      <Breadcrumb :items="breadcrumb" />

      <ProductGridSkeleton v-if="loading" :columns="4" :count="8" />
      <NotFoundView v-else-if="isNotFound" />
      <ErrorState v-else-if="error" :message="error" />

      <template v-else-if="collection">
        <CollectionHeader :title="collection.name" :description="collection.description" />
        <EmptyState
          v-if="products.length === 0"
          message="Chưa có sản phẩm trong bộ sưu tập này."
        />
        <ProductGrid
          v-else
          :products="products"
          @add-to-cart="addToCart"
          @toggle-wishlist="toggleWishlist"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProductGrid from '@/components/ProductGrid.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import CollectionHeader from '@/components/collection/CollectionHeader.vue'
import ProductGridSkeleton from '@/components/skeleton/ProductGridSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useCollectionData } from '@/composables/collection/useCollectionData'
import { useProductActions } from '@/composables/useProductActions'

// Container component: orchestrates data and logic
const {
  collection,
  products,
  loading,
  error,
  isNotFound,
} = useCollectionData()

const { toggleWishlist, addToCart } = useProductActions()

const breadcrumb = computed(() => {
  if (!collection.value) return []
  return [
    { name: 'Bộ sưu tập', path: '/bo-suu-tap' },
    { name: collection.value.name, path: `/bo-suu-tap/${collection.value.slug}` },
  ]
})
</script>

<style scoped>
.collection-page {
  padding: 1.5rem 0 3rem;
}
</style>
