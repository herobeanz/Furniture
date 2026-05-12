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
  padding: 4rem 0;
  background: linear-gradient(180deg, var(--color-bg-alt) 0%, #fff 100%);
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--color-text);
  font-weight: 700;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border-radius: 2px;
}

.tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tab-btn {
  padding: 0.75rem 1.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  background: #fff;
  border: 2px solid var(--color-border-light);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--color-text-muted);
  position: relative;
  overflow: hidden;
}

.tab-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
  z-index: -1;
}

.tab-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.tab-btn.active::before {
  transform: scaleX(1);
}

.product-grid {
  display: grid;
  gap: 1.5rem;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.four-cols {
  grid-template-columns: repeat(4, 1fr);
}

.loading,
.empty {
  padding: 3rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 1.0625rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .home-top-products-section {
    padding: 3.5rem 0;
  }
  
  .section-title {
    font-size: 1.75rem;
    margin-bottom: 1.75rem;
  }
  
  .tabs {
    margin-bottom: 1.75rem;
  }
  
  .four-cols {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .home-top-products-section {
    padding: 3rem 0;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .tabs {
    gap: 0.625rem;
    margin-bottom: 1.5rem;
  }
  
  .tab-btn {
    padding: 0.625rem 1.5rem;
    font-size: 0.875rem;
    border-radius: 10px;
  }
  
  .four-cols {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.125rem;
  }
}

@media (max-width: 640px) {
  .tabs {
    gap: 0.5rem;
  }
  
  .tab-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.8125rem;
  }
  
  .four-cols {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .home-top-products-section {
    padding: 2.5rem 0;
  }
  
  .section-title {
    font-size: 1.375rem;
    margin-bottom: 1.25rem;
  }
  
  .section-title::after {
    width: 50px;
    height: 3px;
  }
  
  .tabs {
    margin-bottom: 1.25rem;
  }
  
  .tab-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    border-radius: 8px;
  }
  
  .four-cols {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
  
  .loading,
  .empty {
    padding: 2rem;
    font-size: 1rem;
  }
}
</style>
