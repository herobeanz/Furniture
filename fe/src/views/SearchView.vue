<template>
  <div class="search-page">
    <div class="container">
      <Breadcrumb :items="breadcrumb" />
      
      <div class="search-header">
        <h1 class="search-title">Kết quả tìm kiếm</h1>
        <p v-if="searchQuery" class="search-query">
          Tìm thấy <strong>{{ totalResults }}</strong> sản phẩm cho từ khóa "<strong>{{ searchQuery }}</strong>"
        </p>
      </div>

      <LoadingState v-if="loading" skeleton />
      <EmptyState
        v-else-if="!loading && products.length === 0"
        message="Không tìm thấy sản phẩm nào. Vui lòng thử lại với từ khóa khác."
      />
      <template v-else>
        <ProductGrid
          :products="products"
          :columns="4"
          show-sale-tag
        />
        <Pagination
          v-if="totalPages > 1"
          :current-page="page"
          :total-pages="totalPages"
          @go-page="goPage"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SearchView' })

import { logger } from '@/utils/logger'
import { ref, computed, watch, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGrid from '@/components/ProductGrid.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'
import type { Product, ProductQueryParams } from '@/services/api/products'
import { useProductsCacheStore } from '@/stores/productsCache'

const route = useRoute()
const router = useRouter()
const productsCache = useProductsCacheStore()

const searchQuery = ref('')
const products = ref<Product[]>([])
const totalResults = ref(0)
const page = ref(1)
const limit = 20
const loading = ref(false)

const totalPages = computed(() => Math.max(1, Math.ceil(totalResults.value / limit)))

const breadcrumb = computed(() => [
  { name: 'Trang chủ', path: '/' },
  { name: 'Tìm kiếm', path: route.path },
])

async function performSearch() {
  const query = (route.query.q as string) || (route.query.search as string) || ''
  if (!query.trim()) {
    products.value = []
    totalResults.value = 0
    return
  }

  searchQuery.value = query.trim()
  const params: ProductQueryParams = {
    search: searchQuery.value,
    page: page.value,
    limit,
  }
  const cached = productsCache.peekList(params)

  if (cached) {
    products.value = cached.data || []
    totalResults.value = cached.total || 0
    loading.value = false
    if (!productsCache.isListFresh(params)) {
      try {
        const fresh = await productsCache.fetchList(params, { force: true })
        products.value = fresh.data || []
        totalResults.value = fresh.total || 0
      } catch (error) {
        logger.error('Search refresh error:', error)
      }
    }
    return
  }

  loading.value = true
  try {
    const result = await productsCache.fetchList(params)
    products.value = result.data || []
    totalResults.value = result.total || 0
  } catch (error) {
    logger.error('Search error:', error)
    products.value = []
    totalResults.value = 0
  } finally {
    loading.value = false
  }
}

function goPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    page.value = p
    router.push({
      path: route.path,
      query: { ...route.query, page: p },
    })
  }
}

watch(
  () => route.query,
  (newQuery) => {
    const query = (newQuery.q as string) || (newQuery.search as string) || ''
    if (query !== searchQuery.value) {
      page.value = 1
      performSearch()
    } else {
      const newPage = parseInt((newQuery.page as string) || '1', 10)
      if (newPage !== page.value) {
        page.value = newPage
        performSearch()
      }
    }
  },
  { immediate: true }
)

onActivated(() => {
  void performSearch()
})
</script>

<style scoped>
.search-page {
  padding: 1.5rem 0 3rem;
}

.search-header {
  margin-bottom: 2rem;
}

.search-title {
  font-size: var(--fs-subtitle);
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.search-query {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
}

.search-query strong {
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .search-page {
    padding: 1rem 0 2rem;
  }

  .search-header {
    margin-bottom: 1.5rem;
  }

  .search-title {
    font-size: var(--fs-section-title);
  }

  .search-query {
    font-size: var(--fs-body-sm);
    line-height: 1.5;
  }
}

@media (max-width: 480px) {
  .search-page {
    padding: 0.75rem 0 1.5rem;
  }

  .search-title {
    font-size: var(--fs-card-title);
  }

  .search-query {
    font-size: var(--fs-body-sm);
  }
}
</style>
