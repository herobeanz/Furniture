import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryTree } from './useCategoryTree'
import type { Collection } from '@/services/api/collections'
import { useCollectionsCacheStore } from '@/stores/collectionsCache'
import { logger } from '@/utils/logger'

/**
 * Composable for Header component logic
 */
export function useHeader() {
  const router = useRouter()
  const collectionsCache = useCollectionsCacheStore()
  const { categoryTree, loading: categoryTreeLoading } = useCategoryTree()

  const navCategories = computed(() =>
    [...categoryTree.value].sort(
      (a, b) =>
        (a.orderIndex ?? 0) - (b.orderIndex ?? 0) ||
        a.name.localeCompare(b.name, 'vi'),
    ),
  )

  const searchQuery = ref('')
  const collections = ref<Collection[]>([])
  const loadingCollections = ref(false)

  async function loadCollections() {
    const cached = collectionsCache.peekList()
    if (cached) {
      collections.value = cached
        .filter((c) => c.isActive)
        .sort((a, b) => a.orderIndex - b.orderIndex)
      loadingCollections.value = false
      if (!collectionsCache.isListFresh()) {
        try {
          const fresh = await collectionsCache.fetchList({ force: true })
          collections.value = fresh
            .filter((c) => c.isActive)
            .sort((a, b) => a.orderIndex - b.orderIndex)
        } catch {
          /* giữ cache */
        }
      }
      return
    }

    loadingCollections.value = true
    try {
      const allCollections = await collectionsCache.fetchList()
      collections.value = allCollections
        .filter((c) => c.isActive)
        .sort((a, b) => a.orderIndex - b.orderIndex)
    } catch (e) {
      logger.error('Failed to load collections:', e)
      collections.value = []
    } finally {
      loadingCollections.value = false
    }
  }

  function onSearch() {
    const q = searchQuery.value?.trim()
    if (q) {
      router.push({ path: '/search', query: { q } })
    }
  }

  onMounted(() => {
    void loadCollections()
  })

  return {
    searchQuery,
    categoryTree,
    navCategories,
    categoryTreeLoading,
    collections,
    loadingCollections,
    onSearch,
  }
}
