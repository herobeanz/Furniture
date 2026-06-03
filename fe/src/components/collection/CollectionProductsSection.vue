<template>
  <section class="collection-products">
    <div class="toolbar">
      <p class="result-count">Hiển thị {{ resultRange }} sản phẩm</p>
      <label class="sort-wrap">
        <span class="sort-label">Sắp xếp</span>
        <select
          class="sort-select"
          :value="sortKey"
          aria-label="Sắp xếp sản phẩm"
          @change="onSortChange"
        >
          <option
            v-for="opt in COLLECTION_PRODUCT_SORT_OPTIONS"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </label>
    </div>

    <EmptyState
      v-if="paginatedProducts.length === 0"
      message="Chưa có sản phẩm trong bộ sưu tập này."
    />
    <ProductGrid
      v-else
      :products="paginatedProducts"
      :columns="4"
      variant="compact"
    />

    <nav
      v-if="totalPages > 1"
      class="pagination"
      aria-label="Phân trang sản phẩm"
    >
      <button
        type="button"
        class="page-btn"
        :disabled="currentPage <= 1"
        aria-label="Trang trước"
        @click="goToPage(currentPage - 1)"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>
      <button
        v-for="p in pageNumbers"
        :key="p"
        type="button"
        class="page-btn"
        :class="{ active: p === currentPage }"
        @click="goToPage(p)"
      >
        {{ p }}
      </button>
      <button
        type="button"
        class="page-btn"
        :disabled="currentPage >= totalPages"
        aria-label="Trang sau"
        @click="goToPage(currentPage + 1)"
      >
        <i class="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import ProductGrid from '@/components/ProductGrid.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Product } from '@/services/api/products'
import {
  COLLECTION_PRODUCT_SORT_OPTIONS,
  type CollectionProductSortKey,
} from '@/constants/collection-page'
import { useCollectionPageProducts } from '@/composables/collection/useCollectionPageProducts'

interface Props {
  products: Product[]
}

const props = defineProps<Props>()

const {
  sortKey,
  currentPage,
  paginatedProducts,
  totalPages,
  resultRange,
  setSort,
  goToPage,
} = useCollectionPageProducts(toRef(props, 'products'))

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = new Set<number>([1, total, current - 1, current, current + 1])
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
})

function onSortChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as CollectionProductSortKey
  setSort(value)
}
</script>

<style scoped>
.collection-products {
  margin-top: 1.5rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.result-count {
  margin: 0;
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
}

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
}

.sort-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-size: var(--fs-body-sm);
  background: #fff;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 2rem;
}

.page-btn {
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background: #fff;
  font-size: var(--fs-body-sm);
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
</style>
