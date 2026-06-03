import { ref } from 'vue'
import { productApi, type Product } from '../../services/api/products'
import { blogApi, type BlogPost } from '../../services/api/blog'
import { collectionApi, type Collection } from '../../services/api/collections'
import { HOME_FEATURED_PRODUCTS_LIMIT } from '../../constants/home'
import { logger } from '../../utils/logger'
/**
 * Composable for home page data fetching and management
 */
export function useHomeData() {
  const blogPosts = ref<BlogPost[]>([])
  const featuredCollections = ref<Collection[]>([])
  const collectionsLoading = ref(true)
  const loading = ref(true)
  const loadingBlogs = ref(false)
  const topProducts = ref<Product[]>([])
  const topProductsLoading = ref(false)

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

  async function loadTopProducts() {
    topProductsLoading.value = true
    try {
      const res = await productApi.getProducts({
        featured: true,
        limit: HOME_FEATURED_PRODUCTS_LIMIT,
        sort: 'sort_order',
        order: 'asc',
      })
      topProducts.value = res.data || []
    } catch (e) {
      logger.error('Failed to load featured home products:', e)
      topProducts.value = []
    } finally {
      topProductsLoading.value = false
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
        loadTopProducts(),
        loadBlogPosts(),
        loadFeaturedCollections(),
      ])
    } catch (e) {
      logger.error('Failed to load initial data:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    blogPosts,
    featuredCollections,
    collectionsLoading,
    loading,
    loadingBlogs,
    topProducts,
    topProductsLoading,
    loadInitialData,
    loadFeaturedCollections,
    loadTopProducts,
    loadBlogPosts,
  }
}
