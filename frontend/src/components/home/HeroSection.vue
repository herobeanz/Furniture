<template>
  <section class="home-hero-section">
    <div class="home-hero-container">
      <div class="hero-grid" v-if="tiles.length > 0">
        <RouterLink
          v-for="(item, i) in tiles"
          :key="item.id"
          :to="'/' + item.slug"
          class="hero-tile"
          :class="'hero-tile-' + (i + 1)"
        >
          <div class="hero-tile-bg" :style="getTileBg(item, i)"></div>
          <span class="hero-tile-btn">{{ item.name }}</span>
        </RouterLink>
      </div>
      <div class="hero-placeholder" v-else>
        <p>Chưa có phòng nào. Truy cập <RouterLink to="/admin/rooms">tài khoản Admin</RouterLink> để thêm phòng.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Room } from '../../services/room.service'
import type { Product } from '../../services/product.service'

interface Props {
  rooms: Room[]
  products?: Product[]
}

const props = defineProps<Props>()

const tiles = computed(() => props.rooms.slice(0, 4))

function getTileBg(room: Room, _i: number) {
  const img = room.thumbnail
  if (img) return { backgroundImage: `url(${img})` }
  // Fallback: use first product image if available
  const firstProduct = props.products?.[0]
  const productImg = firstProduct?.images?.[0] || firstProduct?.thumbnail
  if (productImg) return { backgroundImage: `url(${productImg})` }
  return { background: 'linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%)' }
}
</script>

<style scoped>
.home-hero-section {
  margin-bottom: 0;
}
.home-hero-container {
  padding: 1rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  min-height: 60vh;
  max-height: 70vh;
  padding: 1rem;
}
.hero-tile {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  text-decoration: none;
  color: #1a1a1a;
  padding-bottom: 2rem;
  border-radius: 8px;
}
.hero-tile-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(1);
  transition: transform 0.3s ease;
}
.hero-tile:hover .hero-tile-bg {
  transform: scale(1.05);
  filter: brightness(0.95);
}
.hero-tile-btn {
  position: relative;
  z-index: 1;
  padding: 0.6rem 1.5rem;
  background: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}
.hero-tile:hover .hero-tile-btn {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.hero-placeholder {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
  padding: 2rem;
  text-align: center;
}
.hero-placeholder a {
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    min-height: 70vh;
  }
}
@media (max-width: 768px) {
  .hero-grid {
    min-height: 60vh;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
}
</style>
