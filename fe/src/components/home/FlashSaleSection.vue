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
  padding: 4rem 0;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  position: relative;
  overflow: hidden;
}

.home-daily-sale-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.flash-title {
  font-size: 2rem;
  color: #92400e;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-align: center;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.flash-title::after {
  content: '🔥';
  position: absolute;
  right: -2.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  animation: fireFlicker 1.5s ease-in-out infinite;
}

@keyframes fireFlicker {
  0%, 100% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-50%) scale(1.1);
    opacity: 0.8;
  }
}

.product-grid-wrapper {
  position: relative;
  overflow: hidden;
}

.product-grid {
  display: grid;
  gap: 1.5rem;
  transition: transform var(--transition-slow);
}

.four-cols {
  grid-template-columns: repeat(4, 1fr);
}

.product-grid.carousel-mode {
  transform: translateX(0);
}

.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-slow);
  border: 2px solid transparent;
}

.product-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-8px);
  border-color: #fbbf24;
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
  transition: transform var(--transition-slow);
}

.product-card:hover .product-image-wrap img {
  transform: scale(1.08);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
  font-size: 0.875rem;
  background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%);
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
  transition: all var(--transition-base);
}

.product-card:hover .quick-view-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.quick-view-label {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: #fff;
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  transform: translateY(8px);
  transition: all var(--transition-base);
}

.product-card:hover .quick-view-label {
  transform: translateY(0);
}

.flash-countdown-pill {
  margin: 0.875rem auto 0;
  padding: 0.5rem 1.25rem;
  max-width: 280px;
  border-radius: 12px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
  letter-spacing: 0.05em;
}

.flash-countdown-icon {
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
}

.flash-countdown-text {
  letter-spacing: 0.03em;
}

.flash-carousel-nav {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.carousel-arrow {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #92400e;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  line-height: 1;
  color: #92400e;
  transition: all var(--transition-base);
  font-weight: 700;
}

.carousel-arrow:hover {
  background: #92400e;
  color: #fff;
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.carousel-dots {
  display: flex;
  gap: 0.5rem;
}

.carousel-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(146, 64, 14, 0.3);
  cursor: pointer;
  transition: all var(--transition-base);
}

.carousel-dots .dot.active {
  background: #92400e;
  width: 28px;
  border-radius: 5px;
}

.product-sale-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.product-info {
  padding: 1.25rem;
}

.product-name {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--color-text);
  line-height: 1.5;
  transition: color var(--transition-fast);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-name:hover {
  color: var(--color-primary);
}

.product-prices {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.875rem;
}

.price-current {
  font-weight: 700;
  font-size: 1.125rem;
  color: #dc2626;
  letter-spacing: -0.01em;
}

.price-contact {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
  background: var(--color-bg-alt);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.price-old {
  font-size: 0.9375rem;
  color: var(--color-text-light);
  text-decoration: line-through;
  opacity: 0.7;
}

.product-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border-light);
}

.product-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #fff;
  background: var(--color-text);
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.product-meta .meta-icon {
  font-size: 1rem;
}

.product-meta.rating .meta-icon {
  color: #fbbf24;
}

.loading,
.empty {
  padding: 3rem;
  text-align: center;
  color: #92400e;
  font-size: 1.0625rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .home-daily-sale-section {
    padding: 3.5rem 0;
  }
  
  .flash-title {
    font-size: 1.75rem;
  }
  
  .four-cols {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .home-daily-sale-section {
    padding: 3rem 0;
  }
  
  .flash-title {
    font-size: 1.5rem;
  }
  
  .flash-title::after {
    right: -2rem;
    font-size: 1.25rem;
  }
  
  .four-cols {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .product-card {
    border-radius: 12px;
  }
  
  .flash-carousel-nav {
    margin-top: 1.5rem;
  }
  
  .carousel-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .four-cols {
    gap: 1rem;
  }
  
  .product-info {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .home-daily-sale-section {
    padding: 2.5rem 0;
  }
  
  .flash-title {
    font-size: 1.25rem;
  }
  
  .flash-title::after {
    right: -1.75rem;
    font-size: 1rem;
  }
  
  .four-cols {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
  
  .product-card {
    border-radius: 10px;
  }
  
  .product-info {
    padding: 0.875rem;
  }
  
  .product-name {
    font-size: 0.9375rem;
  }
  
  .price-current {
    font-size: 1rem;
  }
  
  .flash-countdown-pill {
    padding: 0.375rem 1rem;
    font-size: 0.8125rem;
  }
  
  .carousel-arrow {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }
  
  .loading,
  .empty {
    padding: 2rem;
    font-size: 1rem;
  }
}
</style>
