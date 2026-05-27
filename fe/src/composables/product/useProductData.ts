import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productApi, type Product } from '@/services/api/products'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'
import { getCategoryPath, getProductPath } from '@/utils/navigation'
import { resolveMediaUrl } from '@/utils/mediaUrl'
import { buildProductGalleryList } from '@/utils/productGallery'

/**
 * Composable for Product page data fetching and state management
 */
export function useProductData() {
  const route = useRoute()
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

  async function fetchProduct() {
    if (!productSlug.value) return
    
    // Check for preview data first
    if (isPreview.value) {
      const previewData = getPreviewData('product', productSlug.value)
      if (previewData) {
        product.value = previewData as Product
        related.value = []
        selectedIndex.value = 0
        loading.value = false
        return
      }
    }
    
    loading.value = true
    error.value = ''
    isNotFound.value = false
    product.value = null
    related.value = []
    selectedIndex.value = 0
    quantity.value = 1
    try {
      const [p, rel] = await Promise.all([
        productApi.getProduct(productSlug.value),
        productApi.getRelatedProducts(productSlug.value, 12),
      ])
      product.value = p
      related.value = Array.isArray(rel) ? rel : []
    } catch (e: any) {
      if (isNotFoundError(e, ['product not found'])) {
        isNotFound.value = true
      } else {
        error.value = extractErrorMessage(e, 'Không tìm thấy sản phẩm.')
      }
    } finally {
      loading.value = false
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

  return {
    // State
    product,
    related,
    loading,
    error,
    isNotFound,
    selectedIndex,
    quantity,
    // Computed
    galleryImages,
    currentImage,
    breadcrumb,
    productSlug,
    // Methods
    setSelectedImage,
    setQuantity,
  }
}
