<template>
  <div class="products-manage">
    <div class="page-intro">
      <h1>Quản lý sản phẩm</h1>
    </div>

    <nav class="tabs">
      <RouterLink
        to="/admin/products"
        class="tab-link"
        :class="{ active: isCategoriesTab }"
      >
        Loại sản phẩm
      </RouterLink>
      <RouterLink
        to="/admin/products/list"
        class="tab-link"
        :class="{ active: isProductsTab }"
      >
        Sản phẩm
      </RouterLink>
    </nav>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isCategoriesTab = computed(() => {
  const path = route.path
  return path === '/admin/products' || path.startsWith('/admin/categories')
})

const isProductsTab = computed(() => route.path.startsWith('/admin/products/list'))
</script>

<style scoped>
.products-manage {
  padding: 1.5rem 2rem 2rem;
}

.page-intro h1 {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #030712;
}

.tabs {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 600;
}

.tab-link {
  padding: 0 0.25rem 0.5rem;
  margin-bottom: -1px;
  text-decoration: none;
  color: #9ca3af;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tab-link:hover {
  color: #4b5563;
}

.tab-link.active {
  color: #78350f;
  border-bottom-color: #78350f;
}
</style>
