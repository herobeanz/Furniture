<template>
  <div class="category-page">
    <div class="container">
      <!-- Breadcrumb -->
      <nav v-if="breadcrumb.length > 0" class="breadcrumb">
        <RouterLink to="/">Trang chủ</RouterLink>
        <span class="sep">/</span>
        <template v-for="(item, i) in breadcrumb" :key="i">
          <RouterLink :to="item.path">{{ item.name }}</RouterLink>
          <span v-if="i < breadcrumb.length - 1" class="sep">/</span>
        </template>
      </nav>

      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-desc"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-msg">
        <p>{{ error }}</p>
        <RouterLink to="/" class="btn btn-primary">Về trang chủ</RouterLink>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Room view: show categories -->
        <template v-if="room && !category">
          <div class="category-header">
            <h1 class="category-title">{{ room.name }}</h1>
            <p v-if="room.description" class="category-desc">{{ room.description }}</p>
          </div>

          <div v-if="loadingCategories" class="loading">Đang tải danh mục...</div>
          <div v-else-if="categories.length === 0" class="empty">
            <p>Chưa có danh mục trong phòng này.</p>
          </div>
          <div v-else class="category-groups-section">
            <div class="category-groups-grid">
              <RouterLink
                v-for="cat in categories"
                :key="cat.id"
                :to="`/${roomSlug}/${cat.slug}`"
                class="category-group-card"
              >
                <div class="category-group-image" :class="{ placeholder: !cat.thumbnail }">
                  <img v-if="cat.thumbnail" :src="cat.thumbnail" :alt="cat.name" />
                  <span v-else>📦</span>
                </div>
                <div class="category-group-info">
                  <h3 class="category-group-name">{{ cat.name }}</h3>
                  <p v-if="cat.description" class="category-group-desc">{{ cat.description }}</p>
                </div>
              </RouterLink>
            </div>
          </div>
        </template>

        <!-- Category view: show products -->
        <template v-else-if="category">
          <div class="category-header">
            <h1 class="category-title">{{ category.name }}</h1>
            <p v-if="category.description" class="category-desc">{{ category.description }}</p>
          </div>

          <!-- Filters and sorting -->
          <div class="filters-bar">
            <div class="filters-left">
              <span class="product-count">{{ totalProducts }} sản phẩm</span>
            </div>
            <div class="filters-right">
              <select v-model="sortOption" class="sort-select">
                <option value="createdAt:desc">Mới nhất</option>
                <option value="createdAt:asc">Cũ nhất</option>
                <option value="price:asc">Giá tăng dần</option>
                <option value="price:desc">Giá giảm dần</option>
                <option value="name:asc">Tên A-Z</option>
                <option value="name:desc">Tên Z-A</option>
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductGrid from '@/components/ProductGrid.vue'
import { roomService, type Room } from '@/services/room.service'
import { categoryService, type Category } from '@/services/category.service'
import type { Product } from '@/services/product.service'
import { useCart } from '@/composables/useCart'
import { useWishlistStore } from '@/stores/wishlist'

const route = useRoute()
const roomSlug = computed(() => (route.params.roomSlug as string) ?? '')
const categorySlug = computed(() => (route.params.categorySlug as string) ?? '')

const room = ref<Room | null>(null)
const category = ref<Category | null>(null)
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const totalProducts = ref(0)
const page = ref(1)
const limit = 12
const sortOption = ref('createdAt:desc')
const loading = ref(false)
const loadingCategories = ref(false)
const loadingProducts = ref(false)
const error = ref('')

const { addItem } = useCart()
const wishlistStore = useWishlistStore()

const breadcrumb = computed(() => {
  const items: { name: string; path: string }[] = []
  if (room.value) {
    items.push({ name: room.value.name, path: `/${roomSlug.value}` })
  }
  if (category.value) {
    items.push({ name: category.value.name, path: `/${roomSlug.value}/${categorySlug.value}` })
  }
  return items
})

function toggleWishlist(product: Product) {
  wishlistStore.toggleItem({
    id: String(product.id),
    name: product.name,
    price: product.price,
    image: product.images?.[0] || product.thumbnail,
    slug: product.slug,
  })
}

function addToCart(product: Product) {
  addItem({
    id: String(product.id),
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.images?.[0] || product.thumbnail,
    slug: product.slug,
  })
}

const sortParts = computed(() => {
  const [s, o] = sortOption.value.split(':')
  return { sort: s, order: (o || 'desc') as 'asc' | 'desc' }
})

const totalPages = computed(() => Math.max(1, Math.ceil(totalProducts.value / limit)))

async function fetchRoom() {
  if (!roomSlug.value) return
  loading.value = true
  error.value = ''
  try {
    room.value = await roomService.getRoom(roomSlug.value)
    if (categorySlug.value) {
      await fetchCategory()
    } else {
      await fetchCategories()
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Không tìm thấy phòng.'
    room.value = null
  } finally {
    loading.value = false
  }
}

async function fetchCategory() {
  if (!categorySlug.value || !roomSlug.value) return
  loading.value = true
  error.value = ''
  try {
    // First fetch room to ensure it exists
    if (!room.value) {
      room.value = await roomService.getRoom(roomSlug.value)
    }
    // Get category by room and slug
    category.value = await categoryService.getCategoryByRoomAndSlug(roomSlug.value, categorySlug.value)
    await fetchProducts()
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Không tìm thấy danh mục.'
    category.value = null
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  if (!room.value || error.value) return
  loadingCategories.value = true
  try {
    categories.value = await roomService.getRoomCategories(roomSlug.value)
  } catch (e: any) {
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

async function fetchProducts() {
  if (!category.value || error.value) return
  loadingProducts.value = true
  try {
    const res = await categoryService.getCategoryProducts(
      category.value.slug,
      {
        page: page.value,
        limit,
        sort: sortParts.value.sort,
        order: sortParts.value.order,
      },
      roomSlug.value // Pass roomSlug to ensure correct category lookup
    )
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

watch([roomSlug, categorySlug], () => {
  page.value = 1
  room.value = null
  category.value = null
  categories.value = []
  products.value = []
  totalProducts.value = 0
  
  if (categorySlug.value && roomSlug.value) {
    // Category page: need both room and category
    fetchCategory()
  } else if (roomSlug.value) {
    // Room page: only room slug
    fetchRoom()
  }
}, { immediate: true })

watch(sortOption, () => {
  page.value = 1
})
watch([page, sortOption], () => {
  if (category.value) {
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
.category-groups-section {
  margin-bottom: 3rem;
}
.category-groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
.category-group-card {
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}
.category-group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.category-group-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--color-bg-alt);
}
.category-group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.category-group-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--color-text-muted);
}
.category-group-info {
  padding: 1rem;
}
.category-group-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.category-group-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.product-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
}
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.empty {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-page:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
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
