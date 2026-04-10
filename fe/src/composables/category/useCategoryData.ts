import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { roomService, type Room } from '@/services/room.service'
import { categoryService, type Category } from '@/services/category.service'
import type { Product } from '@/services/product.service'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'

/**
 * Composable for Category page data fetching and state management
 */
export function useCategoryData() {
  const route = useRoute()
  const roomSlug = computed(() => (route.params.roomSlug as string) ?? '')
  const categorySlug = computed(() => (route.params.categorySlug as string) ?? '')
  const isPreviewMode = computed(() => route.path.endsWith('/preview'))

  const room = ref<Room | null>(null)
  const category = ref<Category | null>(null)
  const products = ref<Product[]>([])
  const totalProducts = ref(0)
  const page = ref(1)
  const limit = 12
  const sortOption = ref('createdAt:desc')
  const loading = ref(false)
  const loadingProducts = ref(false)
  const error = ref('')
  const isNotFound = ref(false)

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

  const sortParts = computed(() => {
    const [s, o] = sortOption.value.split(':')
    return { sort: s, order: (o || 'desc') as 'asc' | 'desc' }
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(totalProducts.value / limit)))

  async function fetchCategory() {
    if (!categorySlug.value || !roomSlug.value) return
    loading.value = true
    error.value = ''
    isNotFound.value = false
    
    // Check for preview data first
    if (isPreviewMode.value) {
      const preview = getPreviewData('category', categorySlug.value)
      if (preview) {
        category.value = preview as Category
        // Also need room data for breadcrumb
        if (!room.value) {
          const roomPreview = getPreviewData('room', roomSlug.value)
          if (roomPreview) {
            room.value = roomPreview as Room
          } else {
            try {
              room.value = await roomService.getRoom(roomSlug.value)
            } catch {
              // Room might not exist yet, use preview data only
            }
          }
        }
        loading.value = false
        await fetchProducts()
        return
      }
    }
    
    try {
      if (!room.value) {
        room.value = await roomService.getRoom(roomSlug.value)
      }
      category.value = await categoryService.getCategoryByRoomAndSlug(roomSlug.value, categorySlug.value)
      await fetchProducts()
    } catch (e: any) {
      if (isNotFoundError(e, ['room not found', 'category not found'])) {
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
      const res = await categoryService.getCategoryProducts(
        category.value.slug,
        {
          page: page.value,
          limit,
          sort: sortParts.value.sort,
          order: sortParts.value.order,
        },
        roomSlug.value
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

  function reset() {
    page.value = 1
    room.value = null
    category.value = null
    products.value = []
    totalProducts.value = 0
    isNotFound.value = false
    error.value = ''
  }

  watch([roomSlug, categorySlug], () => {
    reset()
    if (categorySlug.value && roomSlug.value) {
      fetchCategory()
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

  return {
    // State
    room,
    category,
    products,
    totalProducts,
    page,
    limit,
    sortOption,
    loading,
    loadingProducts,
    error,
    isNotFound,
    // Computed
    breadcrumb,
    totalPages,
    roomSlug,
    categorySlug,
    // Methods
    goPage,
    reset,
  }
}
