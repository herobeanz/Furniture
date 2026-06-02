import { ref, computed, watch, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@/services/api/products'
import type { ProductQueryParams } from '@/services/api/products'
import { useCategoryTree } from '@/composables/common/useCategoryTree'
import {
  PRODUCTS_PAGE_SIZE,
  productsSortToApi,
  type ProductsPageSortKey,
} from '@/constants/products-page'
import { useProductsCacheStore } from '@/stores/productsCache'
import { logger } from '@/utils/logger'

export function useProductsListPage() {
  const route = useRoute()
  const router = useRouter()
  const productsCache = useProductsCacheStore()
  const { categoryTree } = useCategoryTree()

  const selectedCategorySlug = computed(() => {
    const q = route.query.category
    return typeof q === 'string' && q.length > 0 ? q : null
  })

  const categories = computed(() =>
    [...categoryTree.value].sort(
      (a, b) =>
        (a.orderIndex ?? 0) - (b.orderIndex ?? 0) ||
        a.name.localeCompare(b.name, 'vi'),
    ),
  )

  const products = ref<Product[]>([])
  const total = ref(0)
  const page = ref(1)
  const sortKey = ref<ProductsPageSortKey>('newest')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / PRODUCTS_PAGE_SIZE)),
  )

  const resultRange = computed(() => {
    if (total.value === 0) return '0 sản phẩm'
    const start = (page.value - 1) * PRODUCTS_PAGE_SIZE + 1
    const end = Math.min(page.value * PRODUCTS_PAGE_SIZE, total.value)
    return `${start}–${end} của ${total.value} sản phẩm`
  })

  function buildListParams(): ProductQueryParams {
    const { sort, order } = productsSortToApi(sortKey.value)
    return {
      page: page.value,
      limit: PRODUCTS_PAGE_SIZE,
      sort,
      order,
      ...(selectedCategorySlug.value
        ? { category: selectedCategorySlug.value }
        : {}),
    }
  }

  function applyListResponse(res: { data?: Product[]; total?: number }) {
    products.value = res.data ?? []
    total.value = res.total ?? 0
  }

  async function fetchProducts(options?: { force?: boolean }) {
    const params = buildListParams()
    const cached = productsCache.peekList(params)

    if (cached && !options?.force) {
      applyListResponse(cached)
      error.value = null
      loading.value = false
      if (!productsCache.isListFresh(params)) {
        void revalidateList(params)
      }
      return
    }

    loading.value = true
    error.value = null
    try {
      const res = await productsCache.fetchList(params, options)
      applyListResponse(res)
    } catch (e) {
      logger.error('Failed to load products list:', e)
      if (!cached) {
        products.value = []
        total.value = 0
      }
      error.value = 'Không thể tải danh sách sản phẩm.'
    } finally {
      loading.value = false
    }
  }

  async function revalidateList(params: ProductQueryParams) {
    try {
      const res = await productsCache.fetchList(params, { force: true })
      applyListResponse(res)
      error.value = null
    } catch (e) {
      logger.error('Failed to refresh products list:', e)
    }
  }

  function setSort(key: ProductsPageSortKey) {
    if (sortKey.value === key) return
    sortKey.value = key
    page.value = 1
  }

  function goToPage(p: number) {
    const next = Math.min(Math.max(1, p), totalPages.value)
    if (next === page.value) return
    page.value = next
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function setCategorySlug(slug: string | null) {
    if (selectedCategorySlug.value === slug) return
    const query = { ...route.query }
    if (slug) {
      query.category = slug
    } else {
      delete query.category
    }
    page.value = 1
    router.replace({ path: '/san-pham', query })
  }

  watch([page, sortKey, selectedCategorySlug], () => {
    void fetchProducts()
  })

  onMounted(() => {
    void fetchProducts()
  })

  onActivated(() => {
    void fetchProducts()
  })

  return {
    categories,
    products,
    total,
    page,
    sortKey,
    loading,
    error,
    totalPages,
    resultRange,
    selectedCategorySlug,
    setCategorySlug,
    setSort,
    goToPage,
    fetchProducts,
  }
}
