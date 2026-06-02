import { ref, computed, watch, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import type { Collection, CollectionProduct } from '@/services/api/collections'
import type { Product } from '@/services/api/products'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'
import { useCollectionsCacheStore } from '@/stores/collectionsCache'

/**
 * Composable for Collection page data fetching and state management
 */
export function useCollectionData() {
  const route = useRoute()
  const collectionsCache = useCollectionsCacheStore()
  const collectionSlug = computed(() => (route.params.slug as string) ?? '')
  const isPreview = computed(() => route.name === 'collection-preview')

  const collection = ref<Collection | null>(null)
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref('')
  const isNotFound = ref(false)

  function mapToProduct(cp: CollectionProduct): Product {
    return {
      id: cp.id,
      name: cp.name,
      slug: cp.slug,
      price: cp.price,
      salePrice: cp.salePrice,
      thumbnail: cp.thumbnail,
      images: cp.thumbnail ? [cp.thumbnail] : [],
      material: cp.material,
      categoryId: cp.categoryId,
      category: cp.category,
      breadcrumb: cp.breadcrumb,
    } as unknown as Product
  }

  function applyCollection(data: Collection) {
    collection.value = data
    products.value = data.products
      ? data.products.map(mapToProduct)
      : []
  }

  const categories = computed(() => collection.value?.categories ?? [])

  async function fetchCollection(options?: { force?: boolean }) {
    if (!collectionSlug.value) return

    if (isPreview.value) {
      const previewData = getPreviewData('collection', collectionSlug.value)
      if (previewData) {
        collection.value = previewData.collection as Collection
        products.value = previewData.products
          ? (previewData.products as CollectionProduct[]).map(mapToProduct)
          : []
        loading.value = false
        return
      }
    }

    const slug = collectionSlug.value
    const cached = collectionsCache.peekBySlug(slug)

    if (cached && !options?.force) {
      applyCollection(cached)
      error.value = ''
      isNotFound.value = false
      loading.value = false
      if (!collectionsCache.isDetailFresh(slug)) {
        void revalidate(slug)
      }
      return
    }

    loading.value = true
    error.value = ''
    isNotFound.value = false

    try {
      const data = await collectionsCache.fetchBySlug(slug, options)
      applyCollection(data)
    } catch (e: unknown) {
      if (isNotFoundError(e, ['collection not found'])) {
        isNotFound.value = true
        collection.value = null
        products.value = []
      } else {
        error.value = extractErrorMessage(e, 'Không tìm thấy bộ sưu tập.')
        if (!cached) {
          collection.value = null
          products.value = []
        }
      }
    } finally {
      loading.value = false
    }
  }

  async function revalidate(slug: string) {
    try {
      const data = await collectionsCache.fetchBySlug(slug, { force: true })
      if (collectionSlug.value === slug) {
        applyCollection(data)
      }
    } catch {
      /* giữ cache */
    }
  }

  watch(collectionSlug, () => {
    void fetchCollection()
  }, { immediate: true })

  onActivated(() => {
    void fetchCollection()
  })

  return {
    collection,
    products,
    categories,
    loading,
    error,
    isNotFound,
    collectionSlug,
  }
}
