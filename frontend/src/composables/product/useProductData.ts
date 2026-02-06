import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productService, type Product } from '@/services/product.service'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'

/**
 * Composable for Product page data fetching and state management
 */
export function useProductData() {
  const route = useRoute()
  const productSlug = computed(() => (route.params.productSlug as string) ?? '')

  const product = ref<Product | null>(null)
  const related = ref<Product[]>([])
  const loading = ref(false)
  const error = ref('')
  const isNotFound = ref(false)
  const selectedIndex = ref(0)
  const quantity = ref(1)

  const currentImage = computed(() => {
    const p = product.value
    if (!p?.images?.length) return p?.thumbnail || ''
    const i = Math.min(selectedIndex.value, p.images.length - 1)
    return p.images[i]
  })

  const breadcrumb = computed(() => {
    if (!product.value?.breadcrumb) return []
    return product.value.breadcrumb.map((item, index) => {
      const path = product.value!.breadcrumb!.slice(0, index + 1).map(b => b.slug).join('/')
      return { name: item.name, path: `/${path}` }
    })
  })

  async function fetchProduct() {
    if (!productSlug.value) return
    loading.value = true
    error.value = ''
    isNotFound.value = false
    product.value = null
    related.value = []
    selectedIndex.value = 0
    quantity.value = 1
    try {
      const [p, rel] = await Promise.all([
        productService.getProduct(productSlug.value),
        productService.getRelatedProducts(productSlug.value, 4),
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
    currentImage,
    breadcrumb,
    productSlug,
    // Methods
    setSelectedImage,
    setQuantity,
  }
}
