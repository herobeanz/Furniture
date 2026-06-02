<template>
  <div class="products-page">
    <nav class="products-breadcrumb container" aria-label="Breadcrumb">
      <RouterLink to="/" class="products-breadcrumb-link">Trang chủ</RouterLink>
      <i
        class="fa-solid fa-chevron-right products-breadcrumb-sep"
        aria-hidden="true"
      />
      <span class="products-breadcrumb-current">Sản phẩm</span>
    </nav>

    <section class="products-hero">
      <div class="container products-hero-inner">
        <div class="products-hero-copy">
          <h1 class="products-hero-title">Sản phẩm</h1>
          <p class="products-hero-text">
            Khám phá các sản phẩm nội thất gỗ tự nhiên cao cấp được thiết kế
            tinh tế, bền đẹp theo thời gian.
          </p>
        </div>
        <div class="products-hero-visual">
          <img
            :src="PRODUCTS_HERO_IMAGE"
            alt="Tổng hợp nội thất gỗ"
            class="products-hero-image"
            loading="eager"
          />
        </div>
      </div>
    </section>

    <section
      v-if="categories.length > 0"
      class="products-strip-section container"
    >
      <div class="products-strip-scroll">
        <div class="products-strip">
          <button
            type="button"
            class="products-strip-item"
            :class="{ 'products-strip-item--active': !selectedCategorySlug }"
            @click="setCategorySlug(null)"
          >
            <i class="fa-solid fa-border-all" aria-hidden="true" />
            <span>Tất cả sản phẩm</span>
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="products-strip-item"
            :class="{
              'products-strip-item--active': selectedCategorySlug === cat.slug,
            }"
            @click="setCategorySlug(cat.slug)"
          >
            <i
              :class="['fa-solid', categoryStripIcon(cat.slug)]"
              aria-hidden="true"
            />
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="products-toolbar-section container">
      <div class="products-toolbar">
        <p class="products-result-count">Hiển thị {{ resultRange }}</p>
        <label class="products-sort-wrap">
          <span class="visually-hidden">Sắp xếp sản phẩm</span>
          <select
            class="products-sort-select"
            :value="sortKey"
            @change="onSortChange"
          >
            <option
              v-for="opt in PRODUCTS_PAGE_SORT_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
          <i
            class="fa-solid fa-chevron-down products-sort-chevron"
            aria-hidden="true"
          />
        </label>
      </div>
    </section>

    <section class="products-grid-section container">
      <div v-if="error" class="products-error">
        <ErrorState :message="error" />
        <button
          type="button"
          class="products-retry-btn"
          @click="() => fetchProducts({ force: true })"
        >
          Thử lại
        </button>
      </div>
      <ProductGridSkeleton v-else-if="loading" :count="12" :columns="4" />
      <EmptyState
        v-else-if="products.length === 0"
        message="Chưa có sản phẩm nào."
      />
      <ProductGrid v-else :products="products" :columns="4" variant="compact" />

      <nav
        v-if="!loading && !error && totalPages > 1"
        class="products-pagination"
        aria-label="Phân trang sản phẩm"
      >
        <button
          type="button"
          class="products-page-btn"
          :disabled="page <= 1"
          aria-label="Trang trước"
          @click="goToPage(page - 1)"
        >
          <i class="fa-solid fa-chevron-left" aria-hidden="true" />
        </button>
        <button
          v-for="p in pageNumbers"
          :key="p"
          type="button"
          class="products-page-btn"
          :class="{ 'products-page-btn--active': p === page }"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
        <button
          type="button"
          class="products-page-btn"
          :disabled="page >= totalPages"
          aria-label="Trang sau"
          @click="goToPage(page + 1)"
        >
          <i class="fa-solid fa-chevron-right" aria-hidden="true" />
        </button>
      </nav>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProductsListView' })

import { computed } from "vue";
import { RouterLink } from "vue-router";
import ProductGrid from "@/components/ProductGrid.vue";
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { useProductsListPage } from "@/composables/product/useProductsListPage";
import {
  PRODUCTS_HERO_IMAGE,
  PRODUCTS_PAGE_SORT_OPTIONS,
  type ProductsPageSortKey,
} from "@/constants/products-page";
import { categoryStripIcon } from "@/constants/products-page";

const {
  categories,
  products,
  page,
  sortKey,
  loading,
  error,
  totalPages,
  resultRange,
  selectedCategorySlug,
  setCategorySlug,
  setSort,
  goToPage,
  fetchProducts,
} = useProductsListPage();

const pageNumbers = computed(() => {
  const total = totalPages.value;
  const current = page.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
});

function onSortChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as ProductsPageSortKey;
  setSort(value);
}
</script>

<style scoped>
.products-page {
  padding-bottom: 3rem;
  background: #faf9f6;
}

.products-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 0 0.5rem;
  font-size: 0.6875rem;
  color: var(--color-text-light);
}

.products-breadcrumb-link {
  color: inherit;
  text-decoration: none;
}

.products-breadcrumb-link:hover {
  color: var(--color-primary);
}

.products-breadcrumb-sep {
  font-size: 0.5rem;
}

.products-breadcrumb-current {
  color: var(--color-text-muted);
}

.products-hero {
  background: #f5f2eb;
  padding: 2.5rem 0;
  margin-top: 0.5rem;
  overflow: hidden;
}

.products-hero-inner {
  display: grid;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 992px) {
  .products-hero-inner {
    grid-template-columns: 5fr 7fr;
  }
}

.products-hero-title {
  margin: 0 0 1rem;
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 600;
  color: var(--color-heading);
  letter-spacing: 0.02em;
}

.products-hero-text {
  margin: 0;
  max-width: 20rem;
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.products-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.products-hero-image {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.products-strip-section {
  margin-top: 2rem;
}

.products-strip-scroll {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.products-strip {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  min-width: min(100%, 760px);
}

.products-strip-item {
  flex: 1;
  min-width: 5.625rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-text-muted);
  text-decoration: none;
  text-align: center;
  background: transparent;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.products-strip-item:hover {
  background: #f9fafb;
  color: var(--color-heading);
}

.products-strip-item--active {
  background: #f5f2eb;
  color: var(--color-primary);
}

.products-strip-item i {
  font-size: 0.875rem;
}

.products-toolbar-section {
  margin-top: 2rem;
}

.products-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border-light);
}

.products-result-count {
  margin: 0;
  font-size: 0.6875rem;
  color: var(--color-text-light);
}

.products-sort-wrap {
  position: relative;
  width: 10rem;
}

.products-sort-select {
  width: 100%;
  padding: 0.375rem 1.75rem 0.375rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  background: #fff;
  appearance: none;
}

.products-sort-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.products-sort-chevron {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.5625rem;
  color: var(--color-text-light);
  pointer-events: none;
}

.products-grid-section {
  padding: 1.5rem 0 0;
}

.products-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  margin-top: 3rem;
  font-size: 0.75rem;
}

.products-page-btn {
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.375rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: #fff;
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.products-page-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.products-page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.products-page-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.products-error {
  text-align: center;
}

.products-retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.8125rem;
  cursor: pointer;
}

.products-retry-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
