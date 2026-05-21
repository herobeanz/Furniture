<template>
  <section class="reviews section-shell section-shell--muted">
    <div class="container">
      <h2 class="section-heading section-heading--center">Khách hàng nói về chúng tôi</h2>

      <div v-if="reviews.length" class="reviews-grid">
        <article
          v-for="review in visibleReviews"
          :key="review.id"
          class="review-card"
        >
          <div class="review-stars" aria-label="5 sao">
            <i v-for="n in 5" :key="n" class="fa-solid fa-star" aria-hidden="true" />
          </div>
          <p class="review-text">"{{ review.content }}"</p>
          <div class="review-author">
            <div class="review-avatar" aria-hidden="true">
              <img
                v-if="review.avatar"
                :src="review.avatar"
                :alt="review.author"
                loading="lazy"
              />
              <span v-else>{{ authorInitial(review.author) }}</span>
            </div>
            <div class="review-meta">
              <h4 class="review-name">{{ review.author }}</h4>
              <p v-if="review.location" class="review-location">{{ review.location }}</p>
            </div>
          </div>
        </article>
      </div>

      <div v-if="totalPages > 1" class="reviews-dots" role="tablist" aria-label="Trang đánh giá">
        <button
          v-for="(_, index) in totalPages"
          :key="index"
          type="button"
          class="reviews-dot"
          :class="{ active: index === currentPage }"
          :aria-label="`Trang ${index + 1}`"
          :aria-selected="index === currentPage"
          @click="goToPage(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

export interface Review {
  id: string
  author: string
  location?: string
  content: string
  avatar?: string
}

const PAGE_SIZE = 3
const AUTO_MS = 6000

const props = defineProps<{
  reviews: Review[]
}>()

const currentPage = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const totalPages = computed(() =>
  props.reviews.length ? Math.ceil(props.reviews.length / PAGE_SIZE) : 0
)

const visibleReviews = computed(() => {
  const start = currentPage.value * PAGE_SIZE
  return props.reviews.slice(start, start + PAGE_SIZE)
})

function authorInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function goToPage(index: number) {
  currentPage.value = index
}

function startAuto() {
  stopAuto()
  if (totalPages.value <= 1) return
  timer = setInterval(() => {
    currentPage.value = (currentPage.value + 1) % totalPages.value
  }, AUTO_MS)
}

function stopAuto() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(
  () => props.reviews.length,
  () => {
    currentPage.value = 0
    startAuto()
  }
)

onMounted(startAuto)
onUnmounted(stopAuto)
</script>

<style scoped>
.reviews-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .reviews-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.review-card {
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
  font-size: 0.75rem;
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
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #fff;
}

.review-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
  font-family: var(--font-sans);
}

.review-location {
  font-size: 0.625rem;
  color: var(--color-text-light);
  margin: 0.125rem 0 0;
}

.reviews-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.reviews-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  padding: 0;
  border: none;
  background: #d1d5db;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.reviews-dot.active {
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .section-shell {
    padding: 3rem 0;
  }
}
</style>
