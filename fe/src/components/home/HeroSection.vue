<template>
  <section class="home-hero-section">
    <div v-if="slides.length" class="container">
      <div class="hero-slider">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="hero-slide"
          :class="{ active: index === currentIndex }"
          :style="getSlideBg(slide)"
        >
          <div class="hero-overlay"></div>

          <div class="hero-content">
            <!-- Nội dung hero (title, mô tả, CTA) có thể bổ sung sau nếu cần -->
          </div>
        </div>
        <div class="hero-dots">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            type="button"
            class="hero-dot"
            :class="{ active: index === currentIndex }"
            @click="goToSlide(index)"
          />
        </div>
      </div>
    </div>
    <div v-else class="hero-placeholder">
      <p>Chưa có phòng nào. Hãy thêm dữ liệu phòng trong admin để hiển thị banner.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Room } from '../../services/room.service'
import type { Product } from '../../services/product.service'

interface Props {
  rooms: Room[]
  products?: Product[]
}

const props = defineProps<Props>()

// Ưu tiên 4 phòng chính nếu tồn tại trong dữ liệu
const ROOM_SLUG_PRIORITY = ['phong-khach', 'phong-bep', 'phong-ngu', 'phong-tho']

const slides = computed(() => {
  if (!props.rooms?.length) return []

  const slugMap = new Map<string, Room>()
  props.rooms.forEach((r) => slugMap.set(r.slug, r))

  const prioritized: Room[] = []
  for (const slug of ROOM_SLUG_PRIORITY) {
    const room = slugMap.get(slug)
    if (room) prioritized.push(room)
  }

  const rest = props.rooms.filter((r) => !ROOM_SLUG_PRIORITY.includes(r.slug))
  const result = [...prioritized, ...rest].slice(0, 4)

  return result.map((room) => ({
    id: room.id,
    name: room.name,
    slug: room.slug,
    thumbnail: room.thumbnail,
    headline: room.name,
  }))
})

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startAutoPlay() {
  stopAutoPlay()
  if (slides.value.length <= 1) return
  timer = setInterval(() => {
    nextSlide()
  }, 5000)
}

function stopAutoPlay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function nextSlide() {
  if (!slides.value.length) return
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

function goToSlide(index: number) {
  if (index < 0 || index >= slides.value.length) return
  currentIndex.value = index
}

function getSlideBg(room: { thumbnail?: string }) {
  const img = room.thumbnail
  if (img) {
    return {
      backgroundImage: `url(${img})`,
    }
  }
  const firstProduct = props.products?.[0]
  const productImg = firstProduct?.images?.[0] || firstProduct?.thumbnail
  if (productImg) {
    return {
      backgroundImage: `url(${productImg})`,
    }
  }
  return {
    background:
      'linear-gradient(135deg, #f5f5f5 0%, #e5e7eb 50%, #f3f4f6 100%)',
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
.home-hero-section {
  position: relative;
  margin-bottom: 0;
}

.hero-slider {
  position: relative;
  width: 100%;
  height: min(70vh, 600px);
  overflow: visible;
}

.hero-slide {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.hero-slide.active {
  opacity: 1;
  transform: translateX(0);
  animation: hero-slide-in 0.6s ease-out;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.25) 35%,
    rgba(0, 0, 0, 0.05) 65%,
    rgba(0, 0, 0, 0) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 640px;
  color: #fff;
}

.hero-subtitle {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 0.75rem;
  color: #f97373;
}

.hero-title {
  font-size: 2.8rem;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-text {
  font-size: 1rem;
  max-width: 520px;
  margin-bottom: 1.5rem;
  color: rgba(249, 250, 251, 0.85);
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.8rem;
  border-radius: 999px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  letter-spacing: 0.08em;
}

.hero-cta:hover {
  background: #991b1b;
}

.hero-dots {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.hero-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-dot.active {
  width: 22px;
  background: #b91c1c;
}

.hero-placeholder {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
  padding: 2rem;
  text-align: center;
}

.hero-placeholder p {
  color: #4b5563;
}

@keyframes hero-slide-in {
  0% {
    opacity: 0;
    transform: translateX(40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1024px) {
  .hero-slider {
    height: 420px;
  }

  .hero-title {
    font-size: 2.1rem;
  }

  .hero-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .hero-slider {
    height: 360px;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-title {
    font-size: 1.7rem;
  }
}
</style>
