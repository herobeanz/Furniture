<template>
  <div class="category-page">
    <LoadingState v-if="loading" skeleton />
    <NotFoundView v-else-if="isNotFound" />
    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="category">
      <section class="category-hero">
        <div class="container category-hero-inner">
          <div class="category-hero-copy">
            <h1 class="category-hero-title">{{ category.name }}</h1>
            <p v-if="category.description" class="category-hero-text">
              {{ category.description }}
            </p>
            <p class="category-hero-count">
              <i
                :class="['fa-solid', categoryIcon]"
                class="category-hero-count-icon"
                aria-hidden="true"
              />
              {{ productCountLabel }}
            </p>
          </div>
          <div class="category-hero-visual">
            <OptimizedImage
              :src="heroImage"
              :alt="`Danh mục ${category.name}`"
              img-class="category-hero-image"
              :widths="IMAGE_WIDTHS.hero"
              :sizes="IMAGE_SIZES.hero"
              loading="eager"
              fetch-priority="high"
            />
          </div>
        </div>
      </section>

      <section class="container category-toolbar-section">
        <CategoryProductToolbar v-model:sort-key="sortKey" />
      </section>

      <section class="container category-grid-section">
        <ProductGridSkeleton v-if="loadingProducts" :columns="4" :count="8" />
        <EmptyState
          v-else-if="products.length === 0"
          message="Chưa có sản phẩm trong danh mục này."
        />
        <template v-else>
          <ProductGrid
            class="category-product-grid"
            :products="products"
            :columns="4"
            variant="compact"
            show-sale-tag
          />

          <nav
            v-if="totalPages > 1"
            class="category-pagination"
            aria-label="Phân trang sản phẩm"
          >
            <button
              type="button"
              class="category-page-btn"
              :disabled="page <= 1"
              aria-label="Trang trước"
              @click="goPage(page - 1)"
            >
              <i class="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <template
              v-for="(item, index) in paginationItems"
              :key="`${item}-${index}`"
            >
              <span
                v-if="item === 'ellipsis'"
                class="category-page-ellipsis"
                aria-hidden="true"
              >
                ...
              </span>
              <button
                v-else
                type="button"
                class="category-page-btn"
                :class="{ 'category-page-btn--active': item === page }"
                @click="goPage(item)"
              >
                {{ item }}
              </button>
            </template>
            <button
              type="button"
              class="category-page-btn"
              :disabled="page >= totalPages"
              aria-label="Trang sau"
              @click="goPage(page + 1)"
            >
              <i class="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
          </nav>
        </template>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProductGrid from "@/components/ProductGrid.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import CategoryProductToolbar from "@/components/category/CategoryProductToolbar.vue";
import LoadingState from "@/components/common/LoadingState.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton.vue";
import { useCategoryData } from "@/composables/category/useCategoryData";
import { categoryStripIcon } from "@/constants/products-page";
import OptimizedImage from "@/components/common/OptimizedImage.vue";
import { PRODUCTS_HERO_IMAGE } from "@/constants/category-page";
import { IMAGE_SIZES, IMAGE_WIDTHS } from "@/utils/imageUrl";

const {
  category,
  products,
  totalProducts,
  page,
  sortKey,
  loading,
  loadingProducts,
  error,
  isNotFound,
  totalPages,
  goPage,
} = useCategoryData();

const categoryIcon = computed(() =>
  category.value ? categoryStripIcon(category.value.slug) : "fa-box",
);

const heroImage = computed(() => {
  const thumb = category.value?.thumbnail?.trim();
  if (thumb) return thumb;
  return PRODUCTS_HERO_IMAGE;
});

const productCountLabel = computed(() => `${totalProducts.value} sản phẩm`);

type PaginationItem = number | "ellipsis";

const paginationItems = computed((): PaginationItem[] => {
  const total = totalPages.value;
  const current = page.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: PaginationItem[] = [1];
  const windowStart = Math.max(2, current - 1);
  const windowEnd = Math.min(total - 1, current + 1);

  if (windowStart > 2) {
    items.push("ellipsis");
  }

  for (let p = windowStart; p <= windowEnd; p += 1) {
    items.push(p);
  }

  if (windowEnd < total - 1) {
    items.push("ellipsis");
  }

  items.push(total);
  return items;
});
</script>

<style scoped>
.category-page {
  padding-bottom: 0;
  background: #faf9f6;
}

.category-hero {
  position: relative;
  background: #f5f2eb;
  padding: 2.5rem 0;
  margin-top: 0.5rem;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .category-hero {
    padding: 3.5rem 0;
  }
}

.category-hero-inner {
  display: grid;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .category-hero-inner {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .category-hero-copy {
    grid-column: span 6;
  }

  .category-hero-visual {
    grid-column: span 6;
  }
}

.category-hero-title {
  margin: 0 0 0.75rem;
  font-family: var(--font-serif, Georgia, serif);
  font-size: var(--fs-page-title);
  font-weight: 600;
  color: #111827;
  letter-spacing: 0.04em;
}

.category-hero-text {
  margin: 0 0 1rem;
  font-size: var(--fs-body-sm);
  line-height: 1.65;
  color: #4b5563;
}

.category-hero-count {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: var(--fs-body-sm);
  color: #6b7280;
}

.category-hero-count-icon {
  color: var(--color-primary);
  font-size: var(--fs-body-sm);
}

.category-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.category-hero-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.category-toolbar-section {
  margin-top: 2rem;
}

.category-grid-section {
  padding: 0.5rem 0 0;
}

.category-grid-section :deep(.product-grid) {
  gap: 1.5rem;
}

.category-grid-section :deep(.product-card--compact) {
  background: #fff;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.category-grid-section :deep(.product-card--compact .product-card-image) {
  height: 11rem;
  margin: 0.75rem 0.75rem 0;
  background: #f9fafb;
}

.category-grid-section
  :deep(.product-card--compact:hover .product-card-image img) {
  transform: scale(1.02);
}

.category-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  padding: 3rem 0;
  font-size: var(--fs-body-sm);
  color: #4b5563;
}

.category-page-btn {
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.375rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background: #fff;
  color: #4b5563;
  cursor: pointer;
  transition: background 0.15s ease;
}

.category-page-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.category-page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.category-page-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.category-page-ellipsis {
  padding: 0 0.25rem;
  color: #9ca3af;
  user-select: none;
}
</style>
