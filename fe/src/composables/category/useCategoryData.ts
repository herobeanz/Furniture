import { ref, computed, watch } from 'vue'
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

/**
 * Composable for Category page (/san-pham/:categorySlug)
 */
export function useCategoryData() {
  const route = useRoute()
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

  async function fetchProducts() {
    if (!category.value || error.value) return
    loadingProducts.value = true
    try {
      const { sort, order } = productsSortToApi(sortKey.value)
      const res = await categoryApi.getCategoryProducts(category.value.slug, {
        page: page.value,
        limit: CATEGORY_PAGE_SIZE,
        sort,
        order,
      })
      products.value = (res.data ?? []) as Product[]
      totalProducts.value = res.total ?? 0
    } catch {
      products.value = []
      totalProducts.value = 0
    } finally {
      loadingProducts.value = false
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
        fetchCategory()
      }
    },
    { immediate: true },
  )

  watch(sortKey, () => {
    page.value = 1
  })

  watch([page, sortKey], () => {
    if (category.value) {
      fetchProducts()
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
