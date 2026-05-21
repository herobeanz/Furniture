<template>
  <section class="related-carousel">
    <div class="related-carousel-header">
      <h2 class="related-carousel-title">Sản phẩm tương tự</h2>
      <div class="related-carousel-accent" aria-hidden="true" />
    </div>

    <div class="related-carousel-viewport">
      <div class="related-carousel-grid">
        <ProductCard
          v-for="p in visibleProducts"
          :key="p.id"
          :product="p"
          variant="compact"
          show-sale-tag
        />
      </div>
    </div>

    <nav
      v-if="showNav"
      class="related-carousel-nav"
      aria-label="Điều hướng sản phẩm tương tự"
    >
      <button
        type="button"
        class="related-carousel-arrow"
        aria-label="Trang trước"
        @click="prevPage"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>
      <div class="related-carousel-dots">
        <button
          v-for="i in totalPages"
          :key="i"
          type="button"
          class="related-carousel-dot"
          :class="{ active: currentPage === i - 1 }"
          :aria-label="`Trang ${i}`"
          @click="goToPage(i - 1)"
        />
      </div>
      <button
        type="button"
        class="related-carousel-arrow"
        aria-label="Trang sau"
        @click="nextPage"
      >
        <i class="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/services/api/products'

const PAGE_SIZE = 3

const props = defineProps<{
  products: Product[]
}>()

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
  currentPage.value =
    (currentPage.value - 1 + totalPages.value) % totalPages.value
}

watch(
  () => props.products,
  () => {
    currentPage.value = 0
  },
)
</script>

<style scoped>
.related-carousel {
  padding: 2rem 0 0.5rem;
}

.related-carousel-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.related-carousel-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.related-carousel-accent {
  width: 2.5rem;
  height: 2px;
  background: var(--color-primary);
  margin: 0.5rem auto 0;
}

.related-carousel-viewport {
  overflow: hidden;
}

.related-carousel-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .related-carousel-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .related-carousel-grid {
    grid-template-columns: 1fr;
  }
}

.related-carousel-nav {
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.related-carousel-arrow {
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
  font-size: 0.75rem;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.related-carousel-arrow:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.related-carousel-dots {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.related-carousel-dot {
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

.related-carousel-dot.active {
  width: 1.25rem;
  background: var(--color-primary);
}
</style>
