import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import type { WishlistItem } from '@/stores/wishlist'
import { productService } from '@/services/product.service'

/**
 * Composable for Wishlist page data and navigation
 */
export function useWishlistData() {
  const router = useRouter()
  const wishlistStore = useWishlistStore()
  const items = computed(() => wishlistStore.items)
  
  function removeItem(id: string) {
    wishlistStore.removeItem(id)
  }

  // Cache product breadcrumbs by slug
  const productBreadcrumbs = ref<Map<string, { name: string; slug: string }[]>>(new Map())

  // Fetch product breadcrumb if not cached
  async function getProductBreadcrumb(slug: string): Promise<{ name: string; slug: string }[] | null> {
    if (productBreadcrumbs.value.has(slug)) {
      return productBreadcrumbs.value.get(slug) || null
    }
    
    try {
      const product = await productService.getProduct(slug)
      if (product.breadcrumb && product.breadcrumb.length >= 3) {
        productBreadcrumbs.value.set(slug, product.breadcrumb)
        return product.breadcrumb
      }
    } catch (error) {
      console.error('Failed to fetch product breadcrumb:', error)
    }
    
    return null
  }

  function productLink(item: WishlistItem): string {
    // If we have breadcrumb cached, use it
    if (item.slug && productBreadcrumbs.value.has(item.slug)) {
      const breadcrumb = productBreadcrumbs.value.get(item.slug)
      if (breadcrumb && breadcrumb.length >= 3) {
        const room = breadcrumb[0]
        const category = breadcrumb[1]
        if (room && category) {
          return `/${room.slug}/${category.slug}/${item.slug}`
        }
      }
    }
    
    // Fallback: use simple path
    if (item.slug) {
      return `/san-pham/${item.slug}`
    }
    return `/san-pham/${item.id}`
  }

  async function goToProduct(item: WishlistItem) {
    // Fetch breadcrumb if not cached
    if (item.slug && !productBreadcrumbs.value.has(item.slug)) {
      const breadcrumb = await getProductBreadcrumb(item.slug)
      if (breadcrumb && breadcrumb.length >= 3) {
        const room = breadcrumb[0]
        const category = breadcrumb[1]
        if (room && category) {
          router.push(`/${room.slug}/${category.slug}/${item.slug}`)
          return
        }
      }
    }
    
    // Use cached breadcrumb or fallback
    router.push(productLink(item))
  }

  // Pre-fetch breadcrumbs for all wishlist items on mount
  async function prefetchBreadcrumbs() {
    const slugs = items.value
      .map(item => item.slug)
      .filter((slug): slug is string => !!slug && !productBreadcrumbs.value.has(slug))
    
    if (slugs.length > 0) {
      // Fetch all products in parallel
      const promises = slugs.map(slug => 
        productService.getProduct(slug)
          .then(product => {
            if (product.breadcrumb && product.breadcrumb.length >= 3) {
              productBreadcrumbs.value.set(slug, product.breadcrumb)
            }
          })
          .catch(() => {
            // Ignore errors for individual products
          })
      )
      
      await Promise.all(promises)
    }
  }

  onMounted(() => {
    prefetchBreadcrumbs()
  })

  return {
    items,
    removeItem,
    productLink,
    goToProduct,
  }
}
