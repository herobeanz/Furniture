import { ref, computed, watch, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { categoryApi, type Category } from '@/services/api/categories'
import type { Product } from '@/services/api/products'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'
import { getCategoryPath } from '@/utils/navigation'
import {
  CATEGORY_PAGE_SIZE,
  productsSortToApi,
  type ProductsPageSortKey,
} from '@/constants/category-page'
import { useProductsCacheStore } from '@/stores/productsCache'
import { logger } from '@/utils/logger'

/**
 * Composable for Category page (/san-pham/:categorySlug)
 */
export function useCategoryData() {
  const route = useRoute()
  const productsCache = useProductsCacheStore()
  const categorySlug = computed(
    () => (route.params.categorySlug as string) ?? '',
  )
  const isPreviewMode = computed(() => route.path.endsWith('/preview'))

  const category = ref<Category | null>(null)
  const products = ref<Product[]>([])
  const totalProducts = ref(0)
  const page = ref(1)
  const sortKey = ref<ProductsPageSortKey>('newest')
  const loading = ref(false)
  const loadingProducts = ref(false)
  const error = ref('')
  const isNotFound = ref(false)

  const breadcrumb = computed(() => {
    const items: { name: string; path: string }[] = [
      { name: 'Sản phẩm', path: '/san-pham' },
    ]
    if (category.value) {
      items.push({
        name: category.value.name,
        path: getCategoryPath(category.value),
      })
    }
    return items
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalProducts.value / CATEGORY_PAGE_SIZE)),
  )

  function buildProductParams(): Record<string, unknown> {
    const { sort, order } = productsSortToApi(sortKey.value)
    return {
      page: page.value,
      limit: CATEGORY_PAGE_SIZE,
      sort,
      order,
    }
  }

  async function fetchProducts(options?: { force?: boolean }) {
    if (!category.value || error.value) return
    const slug = category.value.slug
    const params = buildProductParams()
    const cached = productsCache.peekCategoryList(slug, params)

    if (cached && !options?.force) {
      products.value = cached.data
      totalProducts.value = cached.total
      loadingProducts.value = false
      if (!productsCache.isCategoryListFresh(slug, params)) {
        void revalidateProducts(slug, params)
      }
      return
    }

    loadingProducts.value = true
    try {
      const res = await productsCache.fetchCategoryList(slug, params, options)
      products.value = res.data
      totalProducts.value = res.total
    } catch {
      if (!cached) {
        products.value = []
        totalProducts.value = 0
      }
    } finally {
      loadingProducts.value = false
    }
  }

  async function revalidateProducts(
    slug: string,
    params: Record<string, unknown>,
  ) {
    try {
      const res = await productsCache.fetchCategoryList(slug, params, {
        force: true,
      })
      products.value = res.data
      totalProducts.value = res.total
    } catch (e) {
      logger.error('Failed to refresh category products:', e)
    }
  }

  async function fetchCategory() {
    if (!categorySlug.value) return
    loading.value = true
    error.value = ''
    isNotFound.value = false

    if (isPreviewMode.value) {
      const preview = getPreviewData('category', categorySlug.value)
      if (preview) {
        category.value = preview as Category
        loading.value = false
        await fetchProducts()
        return
      }
    }

    try {
      category.value = await categoryApi.getCategory(categorySlug.value)
      await fetchProducts()
    } catch (e: unknown) {
      if (isNotFoundError(e, ['category not found'])) {
        isNotFound.value = true
      } else {
        error.value = extractErrorMessage(e, 'Không tìm thấy danh mục.')
      }
      category.value = null
    } finally {
      loading.value = false
    }
  }

  function goPage(p: number) {
    const next = Math.min(Math.max(1, p), totalPages.value)
    if (next === page.value) return
    page.value = next
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reset() {
    page.value = 1
    category.value = null
    products.value = []
    totalProducts.value = 0
    isNotFound.value = false
    error.value = ''
  }

  watch(
    categorySlug,
    () => {
      reset()
      if (categorySlug.value) {
        void fetchCategory()
      }
    },
    { immediate: true },
  )

  watch(sortKey, () => {
    page.value = 1
  })

  watch([page, sortKey], () => {
    if (category.value) {
      void fetchProducts()
    }
  })

  onActivated(() => {
    if (category.value) {
      void fetchProducts()
    }
  })

  return {
    category,
    products,
    totalProducts,
    page,
    sortKey,
    loading,
    loadingProducts,
    error,
    isNotFound,
    breadcrumb,
    totalPages,
    categorySlug,
    goPage,
    reset,
    fetchProducts,
  }
}
