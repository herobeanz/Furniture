<template>
  <section class="home-top-products section-shell section-shell--white">
    <div class="container">
      <div class="section-header-row">
        <h2 class="section-heading">Sản phẩm bán chạy</h2>
        <RouterLink v-if="viewAllHref" :to="viewAllHref" class="section-link">
          Xem tất cả sản phẩm
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </RouterLink>
      </div>

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
      <div v-else-if="products.length === 0" class="empty">
        Chưa có sản phẩm.
      </div>
      <div v-else class="product-grid four-cols">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :show-hot-tag="product.isHot"
          variant="compact"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import ProductCard from "../ProductCard.vue";
import ProductGridSkeleton from "../skeleton/ProductGridSkeleton.vue";
import type { Product } from '@/services/api/products'
import type { Category } from "@/services/api/categories";

interface Props {
  categories: Category[];
  products: Product[];
  activeTab: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

defineEmits<{
  changeTab: [slug: string];
}>();

const viewAllHref = computed(() =>
  props.activeTab ? `/san-pham/${props.activeTab}` : undefined,
);
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.8125rem;
  background: var(--color-page-bg);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-muted);
}

.tab-btn:hover {
  border-color: var(--color-primary-light);
  color: var(--color-primary);
}

.tab-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.product-grid {
  display: grid;
  gap: 1.5rem;
}

.four-cols {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  .four-cols {
    grid-template-columns: repeat(4, 1fr);
  }
}

.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .section-header-row {
    margin-bottom: 1.25rem;
  }
}
</style>
