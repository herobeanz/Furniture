<template>
  <div class="category-page">
    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/">Trang chủ</RouterLink>
        <span class="sep">/</span>
        <span v-if="category">{{ category.name }}</span>
        <span v-else class="skeleton-text">...</span>
      </nav>

      <!-- Category header -->
      <header v-if="category" class="category-header">
        <h1 class="category-title">{{ category.name }}</h1>
        <p v-if="category.description" class="category-desc">{{ category.description }}</p>
      </header>
      <div v-else-if="!error && loadingCategory" class="category-header">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-desc"></div>
      </div>

      <!-- Error -->
      <div v-if="error" class="error-msg">
        <p>{{ error }}</p>
        <RouterLink to="/" class="btn btn-primary">Về trang chủ</RouterLink>
      </div>

      <template v-else>
        <!-- Toolbar: sort + result count -->
        <div class="toolbar">
          <span class="result-count">
            {{ totalProducts }} sản phẩm
          </span>
          <div class="sort-wrap">
            <label for="sort-select">Sắp xếp:</label>
            <select id="sort-select" v-model="sortOption" class="sort-select">
              <option value="createdAt:desc">Mới nhất</option>
              <option value="price:asc">Giá tăng dần</option>
              <option value="price:desc">Giá giảm dần</option>
              <option value="name:asc">Tên A → Z</option>
              <option value="name:desc">Tên Z → A</option>
            </select>
          </div>
        </div>

        <!-- Product grid -->
        <div v-if="loadingProducts" class="loading">Đang tải sản phẩm...</div>
        <div v-else-if="products.length === 0" class="empty">
          <p>Chưa có sản phẩm trong danh mục này.</p>
        </div>
        <div v-else>
          <ProductGrid
            :products="products"
            :columns="4"
            show-sale-tag
            @add-to-cart="addToCart"
            @toggle-wishlist="toggleWishlist"
          />
          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button
              type="button"
              class="btn-page"
              :disabled="page <= 1"
              @click="goPage(page - 1)"
            >
              Trước
            </button>
            <span class="page-info">Trang {{ page }} / {{ totalPages }}</span>
            <button
              type="button"
              class="btn-page"
              :disabled="page >= totalPages"
              @click="goPage(page + 1)"
            >
              Sau
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductGrid from '@/components/ProductGrid.vue'
import { categoryService, type Category } from '@/services/category.service'
import type { Product } from '@/services/product.service'
import { useCart } from '@/composables/useCart'
import { useWishlistStore } from '@/stores/wishlist'

const route = useRoute()
const slug = computed(() => (route.params.slug as string) ?? '')

const category = ref<Category | null>(null)
const products = ref<Product[]>([])
const totalProducts = ref(0)
const page = ref(1)
const limit = 12
const sortOption = ref('createdAt:desc')
const loadingCategory = ref(false)
const loadingProducts = ref(false)
const error = ref('')

const { addItem } = useCart()
const wishlistStore = useWishlistStore()

function toggleWishlist(product: Product) {
  wishlistStore.toggleItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images?.[0],
    slug: product.slug,
  })
}

function addToCart(product: Product) {
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.images?.[0],
    slug: product.slug,
  })
}

const sortParts = computed(() => {
  const [s, o] = sortOption.value.split(':')
  return { sort: s, order: (o || 'desc') as 'asc' | 'desc' }
})

const totalPages = computed(() => Math.max(1, Math.ceil(totalProducts.value / limit)))

async function fetchCategory() {
  if (!slug.value) return
  loadingCategory.value = true
  error.value = ''
  try {
    category.value = await categoryService.getCategory(slug.value)
    await fetchProducts()
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Không tìm thấy danh mục.'
    category.value = null
  } finally {
    loadingCategory.value = false
  }
}

async function fetchProducts() {
  if (!slug.value || error.value) return
  loadingProducts.value = true
  try {
    const res = await categoryService.getCategoryProducts(slug.value, {
      page: page.value,
      limit,
      sort: sortParts.value.sort,
      order: sortParts.value.order,
    })
    products.value = res.data ?? []
    totalProducts.value = res.total ?? 0
  } catch (e: any) {
    products.value = []
    totalProducts.value = 0
  } finally {
    loadingProducts.value = false
  }
}

function goPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    page.value = p
  }
}

watch(slug, () => {
  page.value = 1
  fetchCategory()
}, { immediate: true })

watch(sortOption, () => {
  page.value = 1
})
watch([page, sortOption], () => {
  if (category.value && slug.value) {
    fetchProducts()
  }
})
</script>

<style scoped>
.category-page {
  padding: 1.5rem 0 3rem;
}
.breadcrumb {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}
.breadcrumb .sep {
  margin: 0 0.5rem;
}
.breadcrumb a:hover {
  color: var(--color-primary);
}
.category-header {
  margin-bottom: 1.5rem;
}
.category-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.category-desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
.skeleton-title {
  height: 1.75rem;
  width: 40%;
  margin-bottom: 0.5rem;
}
.skeleton-desc {
  height: 1rem;
  width: 70%;
}
.skeleton {
  background: var(--color-bg-alt);
  border-radius: 4px;
  animation: pulse 1s ease-in-out infinite;
}
.skeleton-text {
  opacity: 0.7;
}
@keyframes pulse {
  50% { opacity: 0.6; }
}
.error-msg {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.error-msg .btn {
  margin-top: 1rem;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.result-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.sort-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.sort-wrap label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.sort-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
  background: #fff;
  cursor: pointer;
}
.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn-page:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-info {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
</style>
