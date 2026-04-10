<template>
  <section class="home-top-products-section">
    <div class="container">
      <h2 class="section-title">Top sản phẩm bán chạy</h2>
      <div class="tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === category.slug }"
          @click="$emit('changeTab', category.slug)"
        >
          {{ category.name }}
        </button>
      </div>
      <ProductGridSkeleton v-if="loading" :columns="4" :count="4" />
      <div v-else-if="products.length === 0" class="empty">Chưa có sản phẩm.</div>
      <div v-else class="product-grid four-cols">
        <ProductCard
          v-for="(product, idx) in products"
          :key="product.id"
          :product="product"
          :show-hot-tag="product.isHot"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ProductCard from '../ProductCard.vue'
import ProductGridSkeleton from '../skeleton/ProductGridSkeleton.vue'
import type { Product } from '../../services/product.service'
import type { Room } from '../../services/room.service'

interface Props {
  categories: Room[]
  products: Product[]
  activeTab: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

defineEmits<{
  changeTab: [slug: string]
}>()
</script>

<style scoped>
.home-top-products-section {
  padding: 2.5rem 0;
  background: var(--color-bg-alt);
}
.section-title {
  font-size: 1.35rem;
  margin-bottom: 1.25rem;
  text-align: center;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}
.tab-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  background: #fff;
  border: 1px solid var(--color-border);
  cursor: pointer;
}
.tab-btn:hover,
.tab-btn.active {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}
.product-grid {
  display: grid;
  gap: 1.25rem;
}
.four-cols {
  grid-template-columns: repeat(4, 1fr);
}
.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .four-cols {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .four-cols {
    grid-template-columns: 1fr;
  }
}
</style>
