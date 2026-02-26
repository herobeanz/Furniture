<template>
  <div class="room-page">
    <div class="container">
      <Breadcrumb :items="breadcrumb" />

      <LoadingState v-if="loading" skeleton />
      <NotFoundView v-else-if="isNotFound" />
      <ErrorState v-else-if="error" :message="error" />

      <template v-else-if="room">
        <CategoryHeader :title="room.name" :description="room.description" />
        <RoomProductsView
          v-if="categories.length > 0"
          :categories="categories"
          :room-slug="roomSlug"
          @add-to-cart="addToCart"
          @toggle-wishlist="toggleWishlist"
        />
        <div v-else-if="loadingCategories" class="loading-categories">
          Đang tải danh mục...
        </div>
        <EmptyState v-else message="Chưa có danh mục trong phòng này." />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import NotFoundView from '@/views/NotFoundView.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import CategoryHeader from '@/components/category/CategoryHeader.vue'
import RoomProductsView from '@/components/category/RoomProductsView.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useRoomData } from '@/composables/room/useRoomData'
import { useProductActions } from '@/composables/useProductActions'

// Container component: orchestrates data and logic
const {
  room,
  categories,
  loading,
  loadingCategories,
  error,
  isNotFound,
  breadcrumb,
  roomSlug,
} = useRoomData()

const { toggleWishlist, addToCart } = useProductActions()
</script>

<style scoped>
.room-page {
  padding: 1.5rem 0 3rem;
}

.loading-categories {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .room-page {
    padding: 1rem 0 2rem;
  }

  .loading-categories {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .room-page {
    padding: 0.75rem 0 1.5rem;
  }
}
</style>
