import { ref, onMounted } from 'vue'
import { collectionApi, type Collection } from '@/services/api/collections'
import { extractErrorMessage } from '@/utils/error'
import { logger } from '@/utils/logger'

export function useCollectionsListPage() {
  const collections = ref<Collection[]>([])
  const loading = ref(true)
  const error = ref('')

  async function fetchCollections() {
    loading.value = true
    error.value = ''
    try {
      collections.value = await collectionApi.getCollections()
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Không thể tải bộ sưu tập.')
      logger.error('Failed to fetch collections:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCollections)

  return { collections, loading, error, refetch: fetchCollections }
}
