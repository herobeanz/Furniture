import { ref, onMounted, onActivated } from 'vue'
import type { Collection } from '@/services/api/collections'
import { extractErrorMessage } from '@/utils/error'
import { logger } from '@/utils/logger'
import { useCollectionsCacheStore } from '@/stores/collectionsCache'

export function useCollectionsListPage() {
  const collectionsCache = useCollectionsCacheStore()
  const collections = ref<Collection[]>([])
  const loading = ref(true)
  const error = ref('')

  async function fetchCollections(options?: { force?: boolean }) {
    const cached = collectionsCache.peekList()

    if (cached && !options?.force) {
      collections.value = cached
      error.value = ''
      loading.value = false
      if (!collectionsCache.isListFresh()) {
        void revalidate()
      }
      return
    }

    loading.value = true
    error.value = ''
    try {
      collections.value = await collectionsCache.fetchList(options)
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Không thể tải bộ sưu tập.')
      logger.error('Failed to fetch collections:', e)
      if (!cached) {
        collections.value = []
      }
    } finally {
      loading.value = false
    }
  }

  async function revalidate() {
    try {
      collections.value = await collectionsCache.fetchList({ force: true })
      error.value = ''
    } catch (e: unknown) {
      logger.error('Failed to refresh collections:', e)
    }
  }

  onMounted(() => {
    void fetchCollections()
  })

  onActivated(() => {
    void fetchCollections()
  })

  return { collections, loading, error, refetch: fetchCollections }
}
