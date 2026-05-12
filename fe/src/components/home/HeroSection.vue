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
  overflow: hidden;
}

.hero-slider {
  position: relative;
  width: 100%;
  height: min(75vh, 700px);
  overflow: hidden;
  border-radius: 20px;
}

.hero-slide {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.1);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-slide.active {
  opacity: 1;
  transform: scale(1);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 35%,
    rgba(0, 0, 0, 0.1) 65%,
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
  padding: 0 3rem;
  max-width: 720px;
  color: #fff;
}

.hero-subtitle {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
  color: var(--color-accent);
  font-weight: 600;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.hero-text {
  font-size: 1.125rem;
  max-width: 560px;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: #fff;
  font-weight: 600;
  font-size: 1.0625rem;
  text-decoration: none;
  letter-spacing: 0.02em;
  box-shadow: 0 10px 30px rgba(139, 115, 85, 0.3);
  transition: all var(--transition-base);
  animation: fadeInUp 0.6s ease-out 0.8s both;
}

.hero-cta:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(139, 115, 85, 0.4);
}

.hero-dots {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 10;
}

.hero-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.hero-dot::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border-color var(--transition-base);
}

.hero-dot:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.hero-dot.active {
  width: 32px;
  border-radius: 6px;
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.hero-dot.active::before {
  border-color: rgba(212, 175, 55, 0.3);
}

.hero-placeholder {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%);
  padding: 3rem;
  text-align: center;
  border-radius: 20px;
}

.hero-placeholder p {
  color: var(--color-text-muted);
  font-size: 1.0625rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1280px) {
  .hero-slider {
    height: min(70vh, 600px);
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-text {
    font-size: 1.0625rem;
  }
}

@media (max-width: 1024px) {
  .hero-slider {
    height: min(65vh, 520px);
    border-radius: 16px;
  }
  
  .hero-slide {
    border-radius: 16px;
  }
  
  .hero-content {
    padding: 0 2.5rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-text {
    font-size: 1rem;
  }
  
  .hero-cta {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .hero-slider {
    height: min(60vh, 450px);
    border-radius: 12px;
  }
  
  .hero-slide {
    border-radius: 12px;
  }
  
  .hero-content {
    padding: 0 2rem;
    max-width: 100%;
  }
  
  .hero-subtitle {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }
  
  .hero-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .hero-text {
    font-size: 0.9375rem;
    margin-bottom: 1.5rem;
  }
  
  .hero-cta {
    padding: 0.75rem 1.75rem;
    font-size: 0.9375rem;
  }
  
  .hero-dots {
    bottom: 2rem;
    gap: 0.625rem;
  }
  
  .hero-dot {
    width: 10px;
    height: 10px;
  }
  
  .hero-dot.active {
    width: 28px;
  }
}

@media (max-width: 640px) {
  .hero-slider {
    height: min(55vh, 400px);
  }
  
  .hero-content {
    padding: 0 1.5rem;
  }
  
  .hero-title {
    font-size: 1.75rem;
  }
  
  .hero-text {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .hero-slider {
    height: min(50vh, 360px);
    border-radius: 10px;
  }
  
  .hero-slide {
    border-radius: 10px;
  }
  
  .hero-content {
    padding: 0 1.25rem;
  }
  
  .hero-subtitle {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
  }
  
  .hero-title {
    font-size: 1.5rem;
    margin-bottom: 0.875rem;
  }
  
  .hero-text {
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
  }
  
  .hero-cta {
    padding: 0.625rem 1.5rem;
    font-size: 0.875rem;
    border-radius: 10px;
  }
  
  .hero-dots {
    bottom: 1.5rem;
    gap: 0.5rem;
  }
  
  .hero-dot {
    width: 8px;
    height: 8px;
  }
  
  .hero-dot.active {
    width: 24px;
  }
  
  .hero-placeholder {
    min-height: 300px;
    padding: 2rem 1.5rem;
    border-radius: 10px;
  }
  
  .hero-placeholder p {
    font-size: 0.9375rem;
  }
}

@media (max-width: 360px) {
  .hero-slider {
    height: min(45vh, 320px);
  }
  
  .hero-title {
    font-size: 1.375rem;
  }
}
</style>
