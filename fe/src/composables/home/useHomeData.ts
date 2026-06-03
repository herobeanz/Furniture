import { ref, computed, watch } from 'vue'
import { categoryApi, type Category } from '../../services/api/categories'
import { productApi, type Product } from '../../services/api/products'
import { blogApi, type BlogPost } from '../../services/api/blog'
import { collectionApi, type Collection } from '../../services/api/collections'
import { logger } from '../../utils/logger'
import { useRouterLoadingStore } from '@/stores/routerLoading'

/**
 * Composable for home page data fetching and management
 */
export function useHomeData() {
  const routerLoading = useRouterLoadingStore()
  const categories = ref<Category[]>([])
  const blogPosts = ref<BlogPost[]>([])
  const featuredCollections = ref<Collection[]>([])
  const collectionsLoading = ref(true)
  const loading = ref(true)
  const loadingBlogs = ref(false)
  const tabProducts = ref<Product[]>([])
  const tabProductsLoading = ref(false)
  const activeTab = ref('')

  const rootCategories = computed(() => categories.value)

  async function loadFeaturedCollections() {
    collectionsLoading.value = true
    try {
      featuredCollections.value = await collectionApi.getCollections()
    } catch (e) {
      logger.error('Failed to load collections:', e)
      featuredCollections.value = []
    } finally {
      collectionsLoading.value = false
    }
  }

  async function loadTabProducts() {
    if (!activeTab.value) return
    tabProductsLoading.value = true
    routerLoading.start('Đang tải sản phẩm...')
    try {
      const res = await productApi.getProducts({
        category: activeTab.value,
        limit: 8,
      })
      tabProducts.value = res.data || []
    } catch {
      tabProducts.value = []
    } finally {
      tabProductsLoading.value = false
      routerLoading.stop()
    }
  }

  async function loadCategories() {
    try {
      categories.value = await categoryApi.getCategories()
    } catch (e) {
      logger.error('Failed to load categories:', e)
      categories.value = []
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
      await Promise.all([
        loadCategories(),
        loadBlogPosts(),
        loadFeaturedCollections(),
      ])

      if (categories.value.length && !activeTab.value) {
        activeTab.value = categories.value[0]?.slug ?? ''
      }
    } catch (e) {
      logger.error('Failed to load initial data:', e)
    } finally {
      loading.value = false
    }
  }

  watch(activeTab, () => {
    loadTabProducts()
  })

  watch(
    () => categories.value.length,
    (len) => {
      if (len && !activeTab.value) {
        activeTab.value = categories.value[0]?.slug ?? ''
      }
    }
  )

  return {
    categories,
    blogPosts,
    featuredCollections,
    collectionsLoading,
    loading,
    loadingBlogs,
    tabProducts,
    tabProductsLoading,
    activeTab,
    rootCategories,
    loadInitialData,
    loadFeaturedCollections,
    loadTabProducts,
    loadCategories,
    loadBlogPosts,
  }
}
