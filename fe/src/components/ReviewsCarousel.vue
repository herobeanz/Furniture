<template>
  <section class="reviews-carousel-section">
    <div class="container">
      <h2 class="section-title">Đánh giá gần đây</h2>
      <div class="carousel-wrapper">
        <div class="carousel-container">
          <div class="carousel-track" :style="transformStyle">
            <div
              v-for="(review, index) in reviews"
              :key="index"
              class="carousel-slide"
            >
              <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">"{{ review.text }}"</p>
                <div class="review-footer">
                  <div class="review-author-block">
                    <p class="review-author-name">{{ review.name }}</p>
                    <p v-if="review.location" class="review-author-location">
                      {{ review.location }}
                    </p>
                  </div>
                  <div class="review-avatar">
                    <img
                      v-if="review.avatarUrl"
                      :src="review.avatarUrl"
                      :alt="review.name"
                    />
                    <div v-else class="review-avatar-fallback">
                      {{ review.name.charAt(0) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import { useCarousel } from '@/composables/common/useCarousel'

export interface Review {
  text: string
  name: string
  /**
   * Tỉnh/thành hoặc mô tả ngắn dưới tên (vd: 'Ninh Bình', 'Hà Nội')
   */
  location?: string
  /**
   * Ảnh đại diện (dạng tròn bên phải)
   */
  avatarUrl?: string
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

// Use carousel composable for logic
const {
  visibleDots,
  currentDotIndex,
  transformStyle,
  goToSlide,
} = useCarousel(props.reviews.length, {
  itemsPerView: props.itemsPerView,
  autoPlay: props.autoPlay,
  autoPlayInterval: props.autoPlayInterval,
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
  text-align: left;
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
  text-align: center;
}

.review-text {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #333;
  font-style: italic;
  line-height: 1.6;
  flex: 1;
}

.review-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
}

.review-author-block {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.review-author-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #111827;
}

.review-author-location {
  font-size: 0.8rem;
  color: #6b7280;
}

.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 20%, #fef3c7, #e5e7eb);
}

.review-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-avatar-fallback {
  font-weight: 600;
  color: #111827;
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
