import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi, type Product } from '@/services/api/products'
import { categoryApi } from '@/services/api/categories'
import { useCategoryTree } from '@/composables/common/useCategoryTree'
import {
  PRODUCTS_PAGE_SIZE,
  productsSortToApi,
  type ProductsPageSortKey,
} from '@/constants/products-page'
import { logger } from '@/utils/logger'
import { useRouterLoadingStore } from '@/stores/routerLoading'

export function useProductsListPage() {
  const routerLoading = useRouterLoadingStore()
  const route = useRoute()
  const router = useRouter()
  const { categoryTree } = useCategoryTree()

  /** null = tất cả sản phẩm; đồng bộ với ?category= trên /san-pham */
  const selectedCategorySlug = computed(() => {
    const q = route.query.category
    return typeof q === 'string' && q.length > 0 ? q : null
  })

  const categories = computed(() =>
    [...categoryTree.value].sort(
      (a, b) =>
        (a.orderIndex ?? 0) - (b.orderIndex ?? 0) ||
        a.name.localeCompare(b.name, 'vi')
    )
  )

  const products = ref<Product[]>([])
  const total = ref(0)
  const page = ref(1)
  const sortKey = ref<ProductsPageSortKey>('newest')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedCategoryThumbnail = ref<string | null>(null)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / PRODUCTS_PAGE_SIZE))
  )

  const resultRange = computed(() => {
    if (total.value === 0) return '0 sản phẩm'
    const start = (page.value - 1) * PRODUCTS_PAGE_SIZE + 1
    const end = Math.min(page.value * PRODUCTS_PAGE_SIZE, total.value)
    return `${start}–${end} của ${total.value} sản phẩm`
  })

  async function fetchProducts() {
    loading.value = true
    error.value = null
    routerLoading.start('Đang tải sản phẩm...')
    try {
      const { sort, order } = productsSortToApi(sortKey.value)
      const res = await productApi.getProducts({
        page: page.value,
        limit: PRODUCTS_PAGE_SIZE,
        sort,
        order,
        ...(selectedCategorySlug.value
          ? { category: selectedCategorySlug.value }
          : {}),
      })
      products.value = res.data ?? []
      total.value = res.total ?? 0
    } catch (e) {
      logger.error('Failed to load products list:', e)
      products.value = []
      total.value = 0
      error.value = 'Không thể tải danh sách sản phẩm.'
    } finally {
      loading.value = false
      routerLoading.stop()
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

  async function fetchSelectedCategoryThumbnail(slug: string | null) {
    if (!slug) {
      selectedCategoryThumbnail.value = null
      return
    }
    try {
      const category = await categoryApi.getCategory(slug)
      selectedCategoryThumbnail.value = category.thumbnail?.trim() || null
    } catch {
      selectedCategoryThumbnail.value = null
    }
  }

  watch([page, sortKey, selectedCategorySlug], () => {
    void fetchProducts()
  })

  watch(
    selectedCategorySlug,
    (slug) => {
      void fetchSelectedCategoryThumbnail(slug)
    },
    { immediate: true }
  )

  onMounted(() => {
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
    selectedCategoryThumbnail,
    setCategorySlug,
    setSort,
    goToPage,
    fetchProducts,
  }
}
