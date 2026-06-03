<template>
  <section class="reviews section-shell section-shell--muted">
    <div class="container">
      <h2 class="section-heading section-heading--center">Khách hàng nói về chúng tôi</h2>

      <Swiper
        v-if="reviews.length"
        class="reviews-swiper"
        :modules="modules"
        :slides-per-view="1"
        :space-between="24"
        :autoplay="autoplayOptions"
        :pagination="paginationOptions"
        :breakpoints="breakpoints"
        :loop="reviews.length > 3"
        grab-cursor
      >
        <SwiperSlide v-for="review in reviews" :key="review.id">
          <article class="review-card">
            <div class="review-stars" aria-label="5 sao">
              <i v-for="n in 5" :key="n" class="fa-solid fa-star" aria-hidden="true" />
            </div>
            <p class="review-text">"{{ review.content }}"</p>
            <div class="review-author">
              <div class="review-avatar">
                <img
                  v-if="review.avatar && !avatarFailed[review.id]"
                  :src="review.avatar"
                  :alt="`Ảnh đại diện ${review.author}`"
                  loading="lazy"
                  width="48"
                  height="48"
                  @error="onAvatarError(review.id)"
                />
                <span v-else aria-hidden="true">{{ authorInitial(review.author) }}</span>
              </div>
              <div class="review-meta">
                <h4 class="review-name">{{ review.author }}</h4>
                <p v-if="review.location" class="review-location">{{ review.location }}</p>
              </div>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/pagination'

export interface Review {
  id: string
  author: string
  location?: string
  content: string
  /** URL ảnh đại diện (Cloudinary, AI gen, link tự host). Bỏ trống → hiện chữ cái đầu. */
  avatar?: string
}

const modules = [Autoplay, Pagination]

const autoplayOptions: SwiperOptions['autoplay'] = {
  delay: 6000,
  disableOnInteraction: false,
}

const paginationOptions: SwiperOptions['pagination'] = {
  clickable: true,
}

const breakpoints: SwiperOptions['breakpoints'] = {
  640: {
    slidesPerView: 2,
    spaceBetween: 24,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
}

defineProps<{
  reviews: Review[]
}>()

const avatarFailed = reactive<Record<string, boolean>>({})

function onAvatarError(reviewId: string) {
  avatarFailed[reviewId] = true
}

function authorInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}
</script>

<style scoped>
.reviews-swiper {
  padding-bottom: 2.5rem;
}

.review-card {
  height: 100%;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.review-stars {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.75rem;
  font-size: var(--icon-size-sm);
  color: var(--color-star);
  line-height: 1;
}

.review-text {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  line-height: 1.65;
  font-style: italic;
  margin: 0 0 1rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.review-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: #fff;
}

.review-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-name {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
  font-family: var(--font-sans);
}

.review-location {
  font-size: var(--fs-caption);
  color: var(--color-text-light);
  margin: 0.125rem 0 0;
}

.reviews-swiper :deep(.swiper-pagination) {
  bottom: 0;
}

.reviews-swiper :deep(.swiper-pagination-bullet) {
  width: 0.5rem;
  height: 0.5rem;
  background: #d1d5db;
  opacity: 1;
  transition: background var(--transition-fast);
}

.reviews-swiper :deep(.swiper-pagination-bullet-active) {
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .section-shell {
    padding: 3rem 0;
  }
}
</style>
