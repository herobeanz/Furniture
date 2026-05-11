import { ref, type Ref } from 'vue'
import { categoryApi, type Category } from '@/services/api/categories'
import type { Product } from '@/services/api/products'

interface CategoryProducts {
  category: Category
  products: Product[]
}

/**
 * Composable to fetch and manage products for multiple categories in a room
 */
export function useRoomProducts(categories: Ref<Category[]> | Category[], roomSlug: string) {
  const categoryProducts = ref<CategoryProducts[]>([])
  const loading = ref(false)

  async function loadProducts(
    sortOption: string = 'createdAt:desc',
    minPrice: number | null = null,
    maxPrice: number | null = null
  ) {
    const cats = Array.isArray(categories) ? categories : categories.value
    if (cats.length === 0) {
      categoryProducts.value = []
      return
    }

    loading.value = true
    categoryProducts.value = []

    try {
      // Parse sort option
      const [sort, order] = sortOption.split(':')
      const sortParam = sort === 'viewCount' ? 'createdAt' : sort // Fallback if viewCount not available
      const orderParam = (order || 'desc') as 'asc' | 'desc'

      // Build query params
      const queryParams: any = {
        page: 1,
        limit: 4, // Show 4 products per category
        sort: sortParam,
        order: orderParam,
      }

      if (minPrice !== null && minPrice !== undefined) {
        queryParams.minPrice = minPrice
      }
      if (maxPrice !== null && maxPrice !== undefined) {
        queryParams.maxPrice = maxPrice
      }

      // Fetch products for each category in parallel
      const promises = cats.map(async (category) => {
        try {
          const res = await categoryApi.getCategoryProducts(
            category.slug,
            queryParams,
            roomSlug
          )
          return {
            category,
            products: (res.data ?? []).slice(0, 4), // Limit to 4 products
          }
        } catch (error) {
          console.error(`Error loading products for category ${category.slug}:`, error)
          return {
            category,
            products: [],
          }
        }
      })

      const results = await Promise.all(promises)
      categoryProducts.value = results
    } catch (error) {
      console.error('Error loading room products:', error)
      categoryProducts.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    categoryProducts,
    loading,
    loadProducts,
  }
}
