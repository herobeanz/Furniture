import { ref, onMounted } from 'vue'
import { collectionApi, type Collection } from '@/services/api/collections'
import { extractErrorMessage } from '@/utils/error'
import { logger } from '@/utils/logger'
import { useRouterLoadingStore } from '@/stores/routerLoading'

export function useCollectionsListPage() {
  const routerLoading = useRouterLoadingStore()
  const collections = ref<Collection[]>([])
  const loading = ref(true)
  const error = ref('')

  async function fetchCollections() {
    loading.value = true
    error.value = ''
    routerLoading.start('Đang tải bộ sưu tập...')
    try {
      collections.value = await collectionApi.getCollections()
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Không thể tải bộ sưu tập.')
      logger.error('Failed to fetch collections:', e)
    } finally {
      loading.value = false
      routerLoading.stop()
    }
  }

  onMounted(fetchCollections)

  return { collections, loading, error, refetch: fetchCollections }
}
