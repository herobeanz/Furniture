import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryTree } from './useCategoryTree'
import { collectionApi, type Collection } from '@/services/api/collections'
import { logger } from '@/utils/logger'

/**
 * Composable for Header component logic
 */
export function useHeader() {
  const router = useRouter()
  const { categoryTree, loading: categoryTreeLoading } = useCategoryTree()

  /** Danh mục phẳng cho menu Sản phẩm (slug unique toàn site). */
  const navCategories = computed(() =>
    [...categoryTree.value].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0) || a.name.localeCompare(b.name, 'vi')
    )
  )

  const searchQuery = ref('')
  const collections = ref<Collection[]>([])
  const loadingCollections = ref(false)

  async function loadCollections() {
    loadingCollections.value = true
    try {
      const allCollections = await collectionApi.getCollections()
      collections.value = allCollections.filter(c => c.isActive).sort((a, b) => a.orderIndex - b.orderIndex)
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
    loadCollections()
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
