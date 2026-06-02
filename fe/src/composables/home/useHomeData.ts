import { ref, computed, watch } from 'vue'
import { categoryApi, type Category } from '../../services/api/categories'
import type { Product } from '../../services/api/products'
import type { ProductQueryParams } from '../../services/api/products'
import { blogApi, type BlogPost } from '../../services/api/blog'
import { collectionApi, type Collection } from '../../services/api/collections'
import { useProductsCacheStore } from '@/stores/productsCache'
import { logger } from '../../utils/logger'

/**
 * Composable for home page data fetching and management
 */
export function useHomeData() {
  const productsCache = useProductsCacheStore()

  const categories = ref<Category[]>([])
  const products = ref<Product[]>([])
  const blogPosts = ref<BlogPost[]>([])
  const featuredCollections = ref<Collection[]>([])
  const collectionsLoading = ref(true)
  const loading = ref(true)
  const loadingBlogs = ref(false)
  const tabProducts = ref<Product[]>([])
  const tabProductsLoading = ref(false)
  const activeTab = ref('')

  const showcaseCollections = computed(() =>
    [...featuredCollections.value]
      .filter((c) => c.isActive !== false)
      .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id)
      .slice(0, 4),
  )

  const heroTiles = computed(() => showcaseCollections.value)
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
    const params: ProductQueryParams = {
      category: activeTab.value,
      limit: 8,
    }
    const cached = productsCache.peekList(params)
    if (cached) {
      tabProducts.value = cached.data || []
      tabProductsLoading.value = false
      if (!productsCache.isListFresh(params)) {
        try {
          const fresh = await productsCache.fetchList(params, { force: true })
          tabProducts.value = fresh.data || []
        } catch {
          /* giữ cache */
        }
      }
      return
    }

    tabProductsLoading.value = true
    try {
      const res = await productsCache.fetchList(params)
      tabProducts.value = res.data || []
    } catch {
      tabProducts.value = []
    } finally {
      tabProductsLoading.value = false
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
      const heroParams: ProductQueryParams = { limit: 12 }
      const cachedHero = productsCache.peekList(heroParams)

      const heroPromise = cachedHero
        ? Promise.resolve(cachedHero)
        : productsCache.fetchList(heroParams)

      const [res] = await Promise.all([
        heroPromise,
        loadCategories(),
        loadBlogPosts(),
        loadFeaturedCollections(),
      ])
      products.value = res.data || []

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
    void loadTabProducts()
  })

  watch(
    () => categories.value.length,
    (len) => {
      if (len && !activeTab.value) {
        activeTab.value = categories.value[0]?.slug ?? ''
      }
    },
  )

  return {
    categories,
    products,
    blogPosts,
    featuredCollections,
    showcaseCollections,
    collectionsLoading,
    loading,
    loadingBlogs,
    tabProducts,
    tabProductsLoading,
    activeTab,
    heroTiles,
    rootCategories,
    loadInitialData,
    loadFeaturedCollections,
    loadTabProducts,
    loadCategories,
    loadBlogPosts,
  }
}
