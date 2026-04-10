<template>
  <section class="home-categories-section">
    <div class="container">
      <h2 class="section-title">Mua theo danh mục</h2>
      <div class="dept-tiles">
        <RouterLink
          v-for="category in categories"
          :key="category.id"
          :to="getCategoryPath(category)"
          class="dept-tile"
        >
          <div class="dept-tile-img" :style="getCategoryBg(category)"></div>
          <span>{{ category.name }}</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Category } from '../../services/category.service'
import type { Product } from '../../services/product.service'
import { getCategoryPath } from '../../utils/navigation'

interface Props {
  categories: Category[]
  products?: Product[]
}

const props = defineProps<Props>()

function getCategoryBg(category: Category) {
  const img = category.thumbnail
  if (img) return { backgroundImage: `url(${img})` }
  // Fallback: use first product image if available
  const firstProduct = props.products?.[0]
  const productImg = firstProduct?.images?.[0] || firstProduct?.thumbnail
  if (productImg) return { backgroundImage: `url(${productImg})` }
  return { background: 'linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%)' }
}
</script>

<style scoped>
.home-categories-section {
  padding: 2rem 0;
  background: #fff;
}
.section-title {
  font-size: 1.35rem;
  margin-bottom: 1.25rem;
  text-align: center;
}
.dept-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}
.dept-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: #1a1a1a;
  font-size: 0.85rem;
  font-weight: 500;
}
.dept-tile-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-bg-alt);
  margin-bottom: 0.5rem;
  background-size: cover;
  background-position: center;
}
</style>
