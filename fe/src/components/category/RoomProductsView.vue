<template>
  <div class="room-products-view">
    <!-- Category Navigation Tabs -->
    <CategoryTabs :categories="categories" :room-slug="roomSlug" />

    <!-- Filter Bar -->
    <div class="filters-section">
      <div class="filter-left">
        <button class="btn-filter" @click="toggleFilterPanel">
          <span class="filter-icon">★</span>
          <span>Lọc</span>
        </button>
        <div class="sort-options">
          <label class="sort-option">
            <input
              type="radio"
              name="sort"
              value="createdAt:desc"
              v-model="localSortOption"
              @change="updateSort"
            />
            <span>Hàng mới</span>
          </label>
          <label class="sort-option">
            <input
              type="radio"
              name="sort"
              value="viewCount:desc"
              v-model="localSortOption"
              @change="updateSort"
            />
            <span>Xem nhiều</span>
          </label>
          <label class="sort-option">
            <input
              type="radio"
              name="sort"
              value="price:desc"
              v-model="localSortOption"
              @change="updateSort"
            />
            <span>Giá cao trước</span>
          </label>
          <label class="sort-option">
            <input
              type="radio"
              name="sort"
              value="price:asc"
              v-model="localSortOption"
              @change="updateSort"
            />
            <span>Giá thấp trước</span>
          </label>
        </div>
      </div>
      <div class="filter-right">
        <PriceRangeSlider
          :min="0"
          :max="50000000"
          :step="100000"
          v-model="priceRange"
          @update:model-value="updatePriceFilter"
        />
      </div>
    </div>

    <!-- Product Sections by Category -->
    <div v-if="loading" class="loading-state">
      <div class="loading-text">Đang tải sản phẩm...</div>
    </div>
    <div v-else-if="categoryProducts.length === 0" class="empty-state">
      <p>Chưa có sản phẩm trong phòng này.</p>
    </div>
    <template v-else>
      <div
        v-for="categoryData in categoryProducts"
        :key="categoryData.category.id"
        class="category-section"
      >
        <h2 class="category-section-title">{{ categoryData.category.name }}</h2>
        <ProductGrid
          v-if="categoryData.products.length > 0"
          :products="categoryData.products"
          :columns="4"
          show-sale-tag
        />
        <div v-else class="no-products">Chưa có sản phẩm trong danh mục này.</div>
        <div class="view-more-container">
          <RouterLink
            :to="`/${roomSlug}/${categoryData.category.slug}`"
            class="btn-view-more"
          >
            Xem thêm {{ categoryData.category.name }}
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { RouterLink } from 'vue-router'
import CategoryTabs from './CategoryTabs.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import PriceRangeSlider from '@/components/common/PriceRangeSlider.vue'
import type { Category } from '@/services/category.service'
import type { Product } from '@/services/product.service'
import { useRoomProducts } from '@/composables/category/useRoomProducts'

interface Props {
  categories: Category[]
  roomSlug: string
}

const props = defineProps<Props>()

const localSortOption = ref('createdAt:desc')
const priceRange = ref({ min: 0, max: 50000000 })
const showFilterPanel = ref(false)

const { categoryProducts, loading, loadProducts } = useRoomProducts(
  props.categories,
  props.roomSlug
)

function toggleFilterPanel() {
  showFilterPanel.value = !showFilterPanel.value
}

function updateSort() {
  loadProducts(localSortOption.value, priceRange.value.min, priceRange.value.max)
}

function updatePriceFilter() {
  loadProducts(localSortOption.value, priceRange.value.min, priceRange.value.max)
}

// Load products on mount
watch(
  () => props.categories,
  () => {
    if (props.categories.length > 0) {
      loadProducts(localSortOption.value, priceRange.value.min, priceRange.value.max)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.room-products-view {
  padding: 0;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  gap: 2rem;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text);
  transition: all 0.2s;
}

.btn-filter:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-icon {
  font-size: 1rem;
  color: #ffa500;
}

.sort-options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
}

.sort-option input[type="radio"] {
  cursor: pointer;
}

.sort-option span {
  color: var(--color-text);
}

.sort-option:hover span {
  color: var(--color-primary);
}

.sort-option input[type="radio"]:checked + span {
  color: var(--color-primary);
  font-weight: 600;
}

.filter-right {
  min-width: 300px;
  flex-shrink: 0;
}

.category-section {
  margin-bottom: 3rem;
}

.category-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  text-transform: uppercase;
}

.no-products {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

.view-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-view-more {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #4a4a4a;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-view-more:hover {
  background: #333;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .filters-section {
    gap: 1.5rem;
  }
  .filter-left {
    gap: 1rem;
  }
  .sort-options {
    gap: 1rem;
    flex-wrap: wrap;
  }
  .filter-right {
    min-width: 250px;
  }
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    gap: 1rem;
    padding: 0.75rem 0;
  }

  .filter-left {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-filter {
    font-size: 0.85rem;
    padding: 0.4rem 0.875rem;
  }

  .sort-options {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .sort-option {
    font-size: 0.85rem;
  }

  .filter-right {
    width: 100%;
    min-width: auto;
  }

  .category-section {
    margin-bottom: 2rem;
  }

  .category-section-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .view-more-container {
    margin-top: 1.5rem;
  }

  .btn-view-more {
    padding: 0.625rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .filters-section {
    padding: 0.5rem 0;
  }

  .btn-filter {
    width: 100%;
    justify-content: center;
    font-size: 0.8rem;
  }

  .sort-options {
    flex-direction: column;
    gap: 0.5rem;
  }

  .sort-option {
    font-size: 0.8rem;
    width: 100%;
  }

  .category-section-title {
    font-size: 1.1rem;
  }

  .btn-view-more {
    width: 100%;
    padding: 0.75rem;
  }
}
</style>
