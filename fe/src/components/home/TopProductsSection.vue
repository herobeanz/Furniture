<template>
  <section class="home-top-products section-shell section-shell--white">
    <div class="container">
      <div class="section-header-row">
        <h2 class="section-heading">Sản phẩm nổi bật</h2>
        <RouterLink to="/san-pham" class="section-link">
          Xem tất cả sản phẩm
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </RouterLink>
      </div>

      <div class="products-wrap">
        <ProductGridSkeleton v-if="loading && products.length === 0" :columns="4" :count="4" />
        <div v-else-if="products.length === 0" class="empty">
          Chưa có sản phẩm.
        </div>
        <template v-else>
          <div class="product-grid four-cols">
            <ProductCard
              v-for="product in visibleProducts"
              :key="product.id"
              :product="product"
              :show-hot-tag="product.isHot"
              variant="compact"
            />
          </div>

          <nav
            v-if="showNav"
            class="carousel-nav"
            aria-label="Điều hướng sản phẩm nổi bật"
          >
            <button
              type="button"
              class="carousel-arrow"
              aria-label="Trang trước"
              @click="prevPage"
            >
              <i class="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <div class="carousel-dots">
              <button
                v-for="i in totalPages"
                :key="i"
                type="button"
                class="carousel-dot"
                :class="{ active: currentPage === i - 1 }"
                :aria-label="`Trang ${i}`"
                @click="goToPage(i - 1)"
              />
            </div>
            <button
              type="button"
              class="carousel-arrow"
              aria-label="Trang sau"
              @click="nextPage"
            >
              <i class="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
          </nav>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import ProductCard from '../ProductCard.vue'
import ProductGridSkeleton from '../skeleton/ProductGridSkeleton.vue'
import type { Product } from '@/services/api/products'

const PAGE_SIZE = 4

const props = withDefaults(
  defineProps<{
    products: Product[]
    loading?: boolean
  }>(),
  { loading: false },
)

const currentPage = ref(0)

const showNav = computed(() => props.products.length > PAGE_SIZE)

const totalPages = computed(() =>
  showNav.value ? Math.ceil(props.products.length / PAGE_SIZE) : 1,
)

const visibleProducts = computed(() => {
  if (!showNav.value) return props.products
  const start = currentPage.value * PAGE_SIZE
  return props.products.slice(start, start + PAGE_SIZE)
})

function goToPage(index: number) {
  if (index < 0 || index >= totalPages.value) return
  currentPage.value = index
}

function nextPage() {
  if (totalPages.value <= 1) return
  currentPage.value = (currentPage.value + 1) % totalPages.value
}

function prevPage() {
  if (totalPages.value <= 1) return
  currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value
}

watch(
  () => props.products,
  () => {
    currentPage.value = 0
  },
)
</script>

<style scoped>
.product-grid {
  display: grid;
  gap: 1.5rem;
}

.products-wrap {
  position: relative;
}

.four-cols {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  .four-cols {
    grid-template-columns: repeat(4, 1fr);
  }
}

.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.carousel-nav {
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.carousel-arrow {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 1px solid rgba(92, 60, 36, 0.35);
  background: #fff;
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-body-sm);
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.carousel-arrow:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.carousel-dots {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.carousel-dot {
  width: 0.375rem;
  height: 0.375rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: #d1d5db;
  cursor: pointer;
  transition:
    width var(--transition-fast),
    background var(--transition-fast);
}

.carousel-dot.active {
  width: 1.25rem;
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .section-header-row {
    margin-bottom: 1.25rem;
  }
}
</style>
