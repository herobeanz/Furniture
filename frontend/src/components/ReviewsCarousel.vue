<template>
  <section class="reviews-carousel-section">
    <div class="container">
      <h2 class="section-title">Đánh giá gần đây</h2>
      <div class="carousel-wrapper">
        <button
          type="button"
          class="carousel-btn carousel-btn-prev"
          @click="prevSlide"
          :disabled="currentIndex === 0"
          aria-label="Đánh giá trước"
        >
          ‹
        </button>
        <div class="carousel-container">
          <div
            class="carousel-track"
            :style="{ 
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              '--items-per-view': itemsPerView 
            }"
          >
            <div
              v-for="(review, index) in reviews"
              :key="index"
              class="carousel-slide"
            >
              <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">"{{ review.text }}"</p>
                <p class="review-author">{{ review.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="carousel-btn carousel-btn-next"
          @click="nextSlide"
          :disabled="currentIndex >= reviews.length - itemsPerView"
          aria-label="Đánh giá tiếp"
        >
          ›
        </button>
      </div>
      <div class="carousel-dots" v-if="reviews.length > itemsPerView">
        <button
          v-for="(_, index) in visibleDots"
          :key="index"
          type="button"
          class="carousel-dot"
          :class="{ active: index === currentDotIndex }"
          @click="goToSlide(index)"
          :aria-label="`Đi tới slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface Review {
  text: string
  name: string
}

interface Props {
  reviews?: Review[]
  autoPlay?: boolean
  autoPlayInterval?: number
  itemsPerView?: number
}

const props = withDefaults(defineProps<Props>(), {
  reviews: () => [
    { text: 'Phục vụ rất nhiệt tình, sản phẩm đúng mô tả. Tôi rất hài lòng.', name: 'Khách hàng A' },
    { text: 'Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ lâu dài.', name: 'Khách hàng B' },
    { text: 'Chất lượng tốt, giá hợp lý. Recommend cho mọi người.', name: 'Khách hàng C' },
    { text: 'Sản phẩm đẹp, chất lượng cao. Đúng như hình ảnh.', name: 'Khách hàng D' },
    { text: 'Dịch vụ chăm sóc khách hàng tuyệt vời. Cảm ơn shop!', name: 'Khách hàng E' },
  ],
  autoPlay: true,
  autoPlayInterval: 5000,
  itemsPerView: 3,
})

const currentIndex = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

const maxIndex = computed(() => Math.max(0, props.reviews.length - props.itemsPerView))
const visibleDots = computed(() => Math.ceil(props.reviews.length / props.itemsPerView))
const currentDotIndex = computed(() => Math.floor(currentIndex.value / props.itemsPerView))

function nextSlide() {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value = Math.min(currentIndex.value + props.itemsPerView, maxIndex.value)
  } else {
    currentIndex.value = 0 // Loop back to start
  }
}

function prevSlide() {
  if (currentIndex.value > 0) {
    currentIndex.value = Math.max(currentIndex.value - props.itemsPerView, 0)
  } else {
    currentIndex.value = maxIndex.value // Loop to end
  }
}

function goToSlide(index: number) {
  currentIndex.value = index * props.itemsPerView
}

function startAutoPlay() {
  if (!props.autoPlay) return
  stopAutoPlay()
  autoPlayTimer = setInterval(() => {
    nextSlide()
  }, props.autoPlayInterval)
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.reviews-carousel-section {
  padding: 2.5rem 0;
  background: #fff;
}

.section-title {
  font-size: 1.35rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.carousel-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 calc(100% / var(--items-per-view, 3));
  padding: 0 0.75rem;
  box-sizing: border-box;
}

.review-card {
  padding: 2rem 1.5rem;
  background: var(--color-bg-alt, #f8f8f8);
  border-radius: 12px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.review-stars {
  color: #f90;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.review-text {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #333;
  font-style: italic;
  line-height: 1.6;
  flex: 1;
}

.review-author {
  font-weight: 600;
  font-size: 0.9rem;
  color: #666;
  margin-top: auto;
}

.carousel-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--color-border, #ddd);
  background: #fff;
  color: #333;
  font-size: 1.5rem;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.carousel-btn:hover:not(:disabled) {
  background: var(--color-primary, #1976d2);
  color: #fff;
  border-color: var(--color-primary, #1976d2);
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.carousel-dot:hover {
  background: #999;
  transform: scale(1.2);
}

.carousel-dot.active {
  background: var(--color-primary, #1976d2);
  width: 24px;
  border-radius: 5px;
}

/* Responsive */
@media (max-width: 1024px) {
  .carousel-slide {
    flex: 0 0 calc(100% / 2);
  }
  
  .carousel-wrapper {
    --items-per-view: 2;
  }
}

@media (max-width: 768px) {
  .carousel-slide {
    flex: 0 0 100%;
  }
  
  .carousel-wrapper {
    --items-per-view: 1;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .review-card {
    padding: 1.5rem 1rem;
  }
  
  .review-text {
    font-size: 0.9rem;
  }
}
</style>
