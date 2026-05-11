import { ref, computed, watch } from 'vue'
import { roomApi, type Room } from '../../services/api/rooms'
import { productApi, type Product } from '../../services/api/products'
import { blogApi, type BlogPost } from '../../services/api/blog'
import type { Category } from '../../services/api/categories'
import { logger } from '../../utils/logger'

/**
 * Composable for home page data fetching and management
 */
export function useHomeData() {
  const rooms = ref<Room[]>([])
  const products = ref<Product[]>([])
  const allCategories = ref<Category[]>([])
  const blogPosts = ref<BlogPost[]>([])
  const loading = ref(true)
  const loadingBlogs = ref(false)
  const tabProducts = ref<Product[]>([])
  const tabProductsLoading = ref(false)
  const activeTab = ref('')

  // Computed
  const rootCategories = computed(() => rooms.value)
  const heroTiles = computed(() => rooms.value.slice(0, 4))
  const allDeptCategories = computed(() => allCategories.value)
  // Chỉ lấy các sản phẩm tham gia Daily Flash Sale, để nguyên toàn bộ danh sách cho carousel
  const flashProducts = computed(() => products.value.filter((p) => p.isDailyFlashSale))

  async function loadTabProducts() {
    if (!activeTab.value) return
    tabProductsLoading.value = true
    try {
      const categories = await roomApi.getRoomCategories(activeTab.value)
      if (categories.length > 0) {
        const res = await productApi.getProducts({
          category: categories[0].slug,
          limit: 8,
        })
        tabProducts.value = res.data || []
      } else {
        tabProducts.value = []
      }
    } catch {
      tabProducts.value = []
    } finally {
      tabProductsLoading.value = false
    }
  }

  async function loadAllCategories() {
    try {
      const categoriesPromises = rooms.value.map((room) =>
        roomApi.getRoomCategories(room.slug).catch(() => [])
      )
      const categoriesArrays = await Promise.all(categoriesPromises)
      const allCats: Category[] = []
      categoriesArrays.forEach((cats, index) => {
        const room = rooms.value[index]
        if (!room) return
        cats.forEach((cat: Category) => {
          allCats.push({
            ...cat,
            breadcrumb: [
              { name: room.name, slug: room.slug },
              { name: cat.name, slug: cat.slug },
            ],
          })
        })
      })
      allCategories.value = allCats
    } catch (e) {
      logger.error('Failed to load categories:', e)
      allCategories.value = []
    }
  }

  async function loadBlogPosts() {
    loadingBlogs.value = true
    try {
      blogPosts.value = await blogApi.getPosts(true)
    } catch (e) {
      logger.error('Failed to load blog posts:', e)
      blogPosts.value = []
    } finally {
      loadingBlogs.value = false
    }
  }

  async function loadInitialData() {
    try {
      const [roomsData, res] = await Promise.all([
        roomApi.getRooms(),
        productApi.getProducts({ limit: 12 }),
      ])
      rooms.value = roomsData
      products.value = res.data || []

      await loadAllCategories()
      await loadBlogPosts()

      if (rootCategories.value.length && !activeTab.value) {
        activeTab.value = rootCategories.value[0]?.slug ?? ''
      }
    } catch (e) {
      logger.error('Failed to load initial data:', e)
    } finally {
      loading.value = false
    }
  }

  // Watch activeTab to load products
  watch(activeTab, () => {
    loadTabProducts()
  })

  // Watch rootCategories to set initial tab
  watch(
    () => rootCategories.value.length,
    (len) => {
      if (len && !activeTab.value) {
        activeTab.value = rootCategories.value[0]?.slug ?? ''
      }
    }
  )

  return {
    // State
    rooms,
    products,
    allCategories,
    blogPosts,
    loading,
    loadingBlogs,
    tabProducts,
    tabProductsLoading,
    activeTab,
    // Computed
    rootCategories,
    heroTiles,
    allDeptCategories,
    flashProducts,
    // Methods
    loadInitialData,
    loadTabProducts,
    loadAllCategories,
    loadBlogPosts,
  }
}
