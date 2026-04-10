<template>
  <section class="home-daily-sale-section">
    <div class="container">
      <h2 class="flash-title">Daily Flash Sale!</h2>
      <ProductGridSkeleton v-if="loading" :columns="4" :count="4" />
      <div v-else-if="products.length === 0" class="empty">Chưa có sản phẩm.</div>
      <div v-else class="product-grid-wrapper">
        <div class="product-grid four-cols" :class="{ 'carousel-mode': showCarousel }">
          <article v-for="product in visibleProducts" :key="`${product.id}-${currentPage}`" class="product-card flash-card">
          <RouterLink :to="getProductPath(product)" class="product-image-wrap">
            <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name" />
            <div v-else class="no-image">Ảnh</div>
            <!-- <span v-if="product.salePrice" class="product-sale-tag">Sale</span> -->
            <div class="quick-view-overlay">
              <span class="quick-view-label">Xem chi tiết</span>
            </div>
          </RouterLink>
          <div v-if="productCountdowns[product.id]" class="flash-countdown-pill">
            <span class="flash-countdown-icon">⏱</span>
            <span class="flash-countdown-text">{{ productCountdowns[product.id] }}</span>
          </div>
          <div class="product-info">
            <RouterLink :to="getProductPath(product)" class="product-name">{{ product.name }}</RouterLink>
            <div class="product-prices">
            <span v-if="product.isContactPrice" class="price-contact">Liên hệ báo giá</span>
            <template v-else>
              <span v-if="product.salePrice" class="price-old">{{ formatPrice(product.salePrice) }}</span>
              <span class="price-current">{{ formatPrice(product.price) }}</span>
            </template>
            </div>
            <div class="product-meta-row">
              <div class="product-meta sold">
                <span class="meta-icon bag">🛍️</span>
                <span class="meta-text">
                  Đã bán: {{ (product.soldCount ?? 0).toLocaleString('vi-VN') }}+
                </span>
              </div>
              <div class="product-meta rating" v-if="product.rating != null">
                <span class="meta-icon star">⭐</span>
                <span class="meta-text">
                  {{ product.rating.toFixed(1) }}/5
                </span>
              </div>
            </div>
          </div>
        </article>
        </div>
      </div>
      <div v-if="showCarousel" class="flash-carousel-nav">
        <button type="button" class="carousel-arrow prev" @click="prevPage">
          ‹
        </button>
        <div class="carousel-dots">
          <button
            v-for="page in totalPages"
            :key="page - 1"
            type="button"
            class="dot"
            :class="{ active: currentPage === page - 1 }"
            @click="goToPage(page - 1)"
          />
        </div>
        <button type="button" class="carousel-arrow next" @click="nextPage">
          ›
        </button>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import ProductGridSkeleton from '../skeleton/ProductGridSkeleton.vue'
import type { Product } from '../../services/product.service'
import { formatPrice } from '../../utils/format'
import { getProductPath } from '../../utils/navigation'

interface Props {
  products: Product[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const loading = computed(() => props.loading)
const products = computed(() => props.products)

// --- Carousel logic ---
const PAGE_SIZE = 4
const currentPage = ref(0)

const showCarousel = computed(() => products.value.length > PAGE_SIZE)
const totalPages = computed(() => (showCarousel.value ? Math.ceil(products.value.length / PAGE_SIZE) : 1))

const visibleProducts = computed(() => {
  if (!showCarousel.value) return products.value
  const start = currentPage.value * PAGE_SIZE
  return products.value.slice(start, start + PAGE_SIZE)
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

// Reset về trang đầu khi danh sách sản phẩm thay đổi
watch(
  () => products.value,
  () => {
    currentPage.value = 0
  },
  { deep: true }
)

// --- Per-product countdown for Daily Flash Sale ---
const productCountdowns = ref<Record<number, string>>({})
let countdownTimer: ReturnType<typeof setInterval> | null = null

function getEndTime(product: Product): number | null {
  if (!product.isDailyFlashSale) return null

  if (product.flashSaleEndAt) {
    const t = new Date(product.flashSaleEndAt).getTime()
    if (!Number.isNaN(t)) return t
  }

  // Fallback: hết ngày hôm nay
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return end.getTime()
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  return `${days}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`
}

function updateCountdowns() {
  const now = Date.now()
  const next: Record<number, string> = {}

  for (const product of products.value) {
    const endTime = getEndTime(product)
    if (!endTime) continue

    const diff = endTime - now
    if (diff <= 0) continue

    next[product.id] = formatRemaining(diff)
  }

  productCountdowns.value = next
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

watch(
  () => products.value,
  (list) => {
    const hasAnyDaily = list.some((p) => p.isDailyFlashSale)

    if (!hasAnyDaily) {
      productCountdowns.value = {}
      stopCountdown()
      return
    }

    updateCountdowns()

    if (!countdownTimer) {
      countdownTimer = setInterval(updateCountdowns, 1000)
    }
  },
  { immediate: true, deep: true }
)

onUnmounted(() => {
  stopCountdown()
})
</script>

<style scoped>
.home-daily-sale-section {
  padding: 2.5rem 0;
  background: var(--color-bg-alt);
}
.flash-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.product-grid-wrapper {
  position: relative;
  overflow: hidden;
}
.product-grid {
  display: grid;
  gap: 1.25rem;
  transition: transform 0.3s ease;
}
.four-cols {
  grid-template-columns: repeat(4, 1fr);
}
.product-grid.carousel-mode {
  transform: translateX(0);
}
.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
.product-image-wrap {
  position: relative;
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  overflow: hidden;
  display: block;
}
.product-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.875rem;
}
.quick-view-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
  transition: opacity 0.2s ease, background 0.2s ease;
}
.product-card:hover .quick-view-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.18);
  pointer-events: auto;
}
.quick-view-label {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: #fff;
  color: #333;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}
.flash-countdown-pill {
  margin: 0.75rem auto 0;
  padding: 0.4rem 1rem;
  max-width: 240px;
  border-radius: 999px;
  background: #b30000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
}
.flash-countdown-icon {
  display: inline-flex;
  align-items: center;
}
.flash-countdown-text {
  letter-spacing: 0.03em;
}
.flash-carousel-nav {
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.carousel-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  line-height: 1;
}
.carousel-arrow:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.carousel-dots {
  display: flex;
  gap: 0.4rem;
}
.carousel-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #ddd;
  cursor: pointer;
}
.carousel-dots .dot.active {
  background: var(--color-primary);
}
.flash-countdown-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  background: rgba(204, 0, 0, 0.9);
  color: #fff;
  font-size: 0.7rem;
  padding: 0.25rem;
  text-align: center;
  border-radius: 4px;
}
.product-sale-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
.product-info {
  padding: 1rem;
}
.product-name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}
.product-name:hover {
  color: var(--color-primary);
}
.product-prices {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}
.price-current {
  font-weight: 700;
  color: var(--color-primary);
}
.price-contact {
  font-weight: 700;
  color: #111827;
}
.price-old {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
}
.product-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.35rem;
  font-size: 0.8rem;
}
.product-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #f9fafb;
  background: #020617;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}
.product-meta .meta-icon {
  font-size: 0.9rem;
}
.product-meta.rating .meta-icon {
  color: #facc15;
}
.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .four-cols {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .four-cols {
    grid-template-columns: 1fr;
  }
}
</style>
