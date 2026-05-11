import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryTree } from './useCategoryTree'
import { collectionApi, type Collection } from '@/services/api/collections'
import apiClient from '@/services/api/client'
import { unwrapResponseData } from '@/services/api/response'
import { logger } from '@/utils/logger'

export interface CmsPage {
  id: number
  slug: string
  title: string
}

/**
 * Composable for Header component logic
 */
export function useHeader() {
  const router = useRouter()
  const { categoryTree, loading: categoryTreeLoading } = useCategoryTree()

  const searchQuery = ref('')
  const collections = ref<Collection[]>([])
  const loadingCollections = ref(false)
  const cmsPages = ref<CmsPage[]>([])
  const loadingCmsPages = ref(false)

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

  async function loadCmsPages() {
    loadingCmsPages.value = true
    try {
      const response = await apiClient.get('/cms/active')
      const allPages = unwrapResponseData<CmsPage[]>(response)
      cmsPages.value = allPages.filter(p => p.slug !== 'lien-he')
    } catch (e) {
      logger.error('Failed to load CMS pages:', e)
      cmsPages.value = []
    } finally {
      loadingCmsPages.value = false
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
    loadCmsPages()
  })

  return {
    searchQuery,
    categoryTree,
    categoryTreeLoading,
    collections,
    loadingCollections,
    cmsPages,
    loadingCmsPages,
    onSearch,
  }
}
