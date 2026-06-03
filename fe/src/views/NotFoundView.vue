<template>
  <section
    class="not-found"
    :class="{ 'not-found--embedded': embedded }"
    aria-labelledby="not-found-heading"
  >
    <div class="not-found-intro">
      <p class="not-found-code" aria-hidden="true">404</p>
      <h1 id="not-found-heading" class="not-found-title">Trang không tồn tại</h1>
      <p class="not-found-desc">
        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <RouterLink to="/" class="not-found-cta">Quay lại trang chủ</RouterLink>
    </div>

    <template v-if="!embedded">
      <div class="not-found-visual">
        <img
          :src="NOT_FOUND_HERO_IMAGE"
          alt="Không gian nội thất đẹp"
          class="not-found-image"
          loading="lazy"
          width="1000"
          height="667"
        />
      </div>

      <div class="not-found-suggestions">
        <h2 class="not-found-suggestions-title">Bạn có thể quan tâm</h2>
        <div class="not-found-suggestions-grid">
          <RouterLink
            v-for="(item, index) in NOT_FOUND_SUGGESTIONS"
            :key="item.to"
            :to="item.to"
            class="not-found-suggestion"
            :class="{ 'not-found-suggestion--bordered': index > 0 }"
          >
            <i :class="item.icon" class="not-found-suggestion-icon" aria-hidden="true" />
            <span class="not-found-suggestion-label">{{ item.label }}</span>
            <i
              class="fa-solid fa-arrow-right not-found-suggestion-arrow"
              aria-hidden="true"
            />
          </RouterLink>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  NOT_FOUND_HERO_IMAGE,
  NOT_FOUND_SUGGESTIONS,
} from '@/constants/not-found'

const route = useRoute()
/** Nhúng trong ProductView, CollectionView, … — không hiện ảnh / gợi ý */
const embedded = computed(() => route.name !== 'not-found')
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 1.5rem 5rem;
  background: var(--color-bg-alt);
}

.not-found--embedded {
  padding: 3rem 0 4rem;
  background: transparent;
}

.not-found-intro {
  max-width: 28rem;
  margin: 0 auto 2.5rem;
}

.not-found-code {
  margin: 0 0 0.5rem;
  font-family: var(--font-serif, Georgia, 'Times New Roman', serif);
  font-size: clamp(4.5rem, 14vw, 5.5rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.08em;
  color: var(--color-primary-dark);
}

.not-found-title {
  margin: 0 0 0.75rem;
  font-family: var(--font-serif, Georgia, 'Times New Roman', serif);
  font-size: var(--fs-subtitle);
  font-weight: 500;
  color: var(--color-heading);
}

.not-found-desc {
  margin: 0;
  font-size: var(--fs-body-sm);
  line-height: 1.65;
  color: var(--color-text-muted);
  padding: 0 1rem;
}

.not-found-cta {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.625rem 1.5rem;
  font-size: var(--fs-body-sm);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: #fff;
  background: var(--color-primary-dark);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
  transition: background 0.2s ease;
}

.not-found-cta:hover {
  background: var(--color-primary-hover);
  color: #fff;
}

.not-found-visual {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto 3rem;
}

.not-found-image {
  display: block;
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
}

@media (min-width: 640px) {
  .not-found-image {
    height: 320px;
  }
}

.not-found-suggestions {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 2rem;
  background: rgb(245 242 235 / 0.7);
  border: 1px solid rgb(229 231 235 / 0.4);
  border-radius: 2px;
}

@media (min-width: 640px) {
  .not-found-suggestions {
    padding: 2rem;
  }
}

.not-found-suggestions-title {
  margin: 0 0 1.5rem;
  font-size: var(--fs-body-sm);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-heading);
}

.not-found-suggestions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .not-found-suggestions-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
}

.not-found-suggestion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
}

.not-found-suggestion:hover {
  color: var(--color-primary-dark);
}

@media (min-width: 768px) {
  .not-found-suggestion--bordered {
    border-left: 1px solid rgb(229 231 235 / 0.6);
  }
}

.not-found-suggestion-icon {
  font-size: var(--fs-body-lg);
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}

.not-found-suggestion:hover .not-found-suggestion-icon,
.not-found-suggestion:hover .not-found-suggestion-arrow {
  color: var(--color-primary-dark);
}

.not-found-suggestion-label {
  font-size: var(--fs-body-sm);
  font-weight: 600;
  color: var(--color-text);
  transition: color 0.2s ease;
}

.not-found-suggestion:hover .not-found-suggestion-label {
  color: var(--color-primary-dark);
}

.not-found-suggestion-arrow {
  margin-top: 0.125rem;
  font-size: var(--fs-caption);
  color: var(--color-text-light);
  transition: color 0.2s ease;
}
</style>
