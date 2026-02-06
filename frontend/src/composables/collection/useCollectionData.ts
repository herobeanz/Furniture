import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { collectionService, type Collection, type CollectionProduct } from '@/services/collection.service'
import type { Product } from '@/services/product.service'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'

/**
 * Composable for Collection page data fetching and state management
 */
export function useCollectionData() {
  const route = useRoute()
  const collectionSlug = computed(() => (route.params.slug as string) ?? '')

  const collection = ref<Collection | null>(null)
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref('')
  const isNotFound = ref(false)

  // Convert CollectionProduct to Product format
  function mapToProduct(cp: CollectionProduct): Product {
    return {
      id: cp.id,
      name: cp.name,
      slug: cp.slug,
      price: cp.price,
      salePrice: cp.salePrice,
      thumbnail: cp.thumbnail,
      images: cp.thumbnail ? [cp.thumbnail] : [],
      breadcrumb: cp.breadcrumb,
    } as Product
  }

  async function fetchCollection() {
    if (!collectionSlug.value) return
    loading.value = true
    error.value = ''
    isNotFound.value = false
    try {
      collection.value = await collectionService.getCollectionBySlug(collectionSlug.value)
      if (collection.value?.products) {
        products.value = collection.value.products.map(mapToProduct)
      } else {
        products.value = []
      }
    } catch (e: any) {
      if (isNotFoundError(e, ['collection not found'])) {
        isNotFound.value = true
      } else {
        error.value = extractErrorMessage(e, 'Không tìm thấy bộ sưu tập.')
      }
      collection.value = null
      products.value = []
    } finally {
      loading.value = false
    }
  }

  watch(collectionSlug, fetchCollection, { immediate: true })

  return {
    // State
    collection,
    products,
    loading,
    error,
    isNotFound,
    // Computed
    collectionSlug,
  }
}
