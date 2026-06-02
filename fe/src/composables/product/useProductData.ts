import { ref, computed, watch, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/services/api/products'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'
import { getCategoryPath, getProductPath } from '@/utils/navigation'
import { resolveMediaUrl } from '@/utils/mediaUrl'
import { buildProductGalleryList } from '@/utils/productGallery'
import {
  useProductsCacheStore,
  RELATED_PRODUCTS_LIMIT,
} from '@/stores/productsCache'

/**
 * Composable for Product page data fetching and state management
 */
export function useProductData() {
  const route = useRoute()
  const productsCache = useProductsCacheStore()
  const productSlug = computed(() => (route.params.productSlug as string) ?? '')
  const isPreview = computed(() => route.path.endsWith('/preview'))

  const product = ref<Product | null>(null)
  const related = ref<Product[]>([])
  const loading = ref(false)
  const error = ref('')
  const isNotFound = ref(false)
  const selectedIndex = ref(0)
  const quantity = ref(1)

  const galleryImageUrls = computed(() => {
    const p = product.value
    if (!p) return [] as string[]
    return buildProductGalleryList(p.thumbnail, p.images)
  })

  const galleryImages = computed(() =>
    galleryImageUrls.value.map((url) => resolveMediaUrl(url)).filter(Boolean),
  )

  const currentImage = computed(() => {
    const list = galleryImageUrls.value
    if (!list.length) return ''
    const i = Math.min(selectedIndex.value, list.length - 1)
    return resolveMediaUrl(list[i])
  })

  const breadcrumb = computed(() => {
    if (!product.value?.breadcrumb?.length) return []
    const items = product.value.breadcrumb
    return items.map((item, index) => {
      if (index === 0) {
        return { name: item.name, path: getCategoryPath({ slug: item.slug }) }
      }
      if (index === items.length - 1 && product.value) {
        return { name: item.name, path: getProductPath(product.value) }
      }
      return { name: item.name, path: getCategoryPath({ slug: item.slug }) }
    })
  })

  function applyCached(slug: string) {
    const cachedProduct = productsCache.peekProduct(slug)
    const cachedRelated = productsCache.peekRelated(slug, RELATED_PRODUCTS_LIMIT)
    if (cachedProduct) {
      product.value = cachedProduct
    }
    if (cachedRelated) {
      related.value = cachedRelated
    }
    return !!cachedProduct
  }

  async function loadRelated(slug: string, options?: { force?: boolean }) {
    const cached = productsCache.peekRelated(slug, RELATED_PRODUCTS_LIMIT)
    if (cached && !options?.force) {
      related.value = cached
      if (!productsCache.isRelatedFresh(slug, RELATED_PRODUCTS_LIMIT)) {
        try {
          const fresh = await productsCache.fetchRelated(slug, RELATED_PRODUCTS_LIMIT, {
            force: true,
          })
          related.value = fresh
        } catch {
          /* giữ bản cache */
        }
      }
      return
    }
    try {
      related.value = await productsCache.fetchRelated(
        slug,
        RELATED_PRODUCTS_LIMIT,
        options,
      )
    } catch {
      if (!cached) related.value = []
    }
  }

  async function fetchProduct() {
    if (!productSlug.value) return

    const slug = productSlug.value

    if (isPreview.value) {
      const previewData = getPreviewData('product', slug)
      if (previewData) {
        product.value = previewData as Product
        related.value = []
        selectedIndex.value = 0
        loading.value = false
        return
      }
    }

    error.value = ''
    isNotFound.value = false
    const hasCache = applyCached(slug)

    if (hasCache) {
      loading.value = false
      selectedIndex.value = 0
      quantity.value = 1
      if (!productsCache.isProductFresh(slug)) {
        void revalidateProduct(slug)
      } else {
        void loadRelated(slug)
      }
      return
    }

    if (!product.value || product.value.slug !== slug) {
      loading.value = true
    }

    try {
      const p = await productsCache.fetchProduct(slug)
      product.value = p
      selectedIndex.value = 0
      quantity.value = 1
      await loadRelated(slug)
    } catch (e: unknown) {
      if (isNotFoundError(e, ['product not found'])) {
        isNotFound.value = true
        product.value = null
      } else {
        error.value = extractErrorMessage(e, 'Không tìm thấy sản phẩm.')
      }
    } finally {
      loading.value = false
    }
  }

  async function revalidateProduct(slug: string) {
    try {
      const p = await productsCache.fetchProduct(slug, { force: true })
      if (productSlug.value === slug) {
        product.value = p
      }
      await loadRelated(slug, { force: true })
    } catch {
      /* giữ cache hiện tại */
    }
  }

  function setSelectedImage(index: number) {
    selectedIndex.value = index
  }

  function setQuantity(qty: number) {
    quantity.value = Math.max(1, Math.min(99, qty))
  }

  watch(
    () => galleryImageUrls.value.length,
    (len) => {
      if (selectedIndex.value >= len) {
        selectedIndex.value = Math.max(0, len - 1)
      }
    },
  )

  watch(productSlug, fetchProduct, { immediate: true })

  onActivated(() => {
    void fetchProduct()
  })

  return {
    product,
    related,
    loading,
    error,
    isNotFound,
    selectedIndex,
    quantity,
    galleryImages,
    currentImage,
    breadcrumb,
    productSlug,
    setSelectedImage,
    setQuantity,
  }
}
