import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useWishlist } from '@/composables/useWishlist'
import { useCategoryTree } from './useCategoryTree'
import { collectionService, type Collection } from '@/services/collection.service'
import apiClient from '@/services/api.client'

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
  const { totalItems: cartCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { categoryTree, loading: categoryTreeLoading } = useCategoryTree()

  const searchQuery = ref('')
  const collections = ref<Collection[]>([])
  const loadingCollections = ref(false)
  const cmsPages = ref<CmsPage[]>([])
  const loadingCmsPages = ref(false)

  const wishlistCount = computed(() => wishlistItems.value.length)

  async function loadCollections() {
    loadingCollections.value = true
    try {
      const allCollections = await collectionService.getCollections()
      // Only show active collections
      collections.value = allCollections.filter(c => c.isActive).sort((a, b) => a.orderIndex - b.orderIndex)
    } catch (e) {
      console.error('Failed to load collections:', e)
      collections.value = []
    } finally {
      loadingCollections.value = false
    }
  }

  async function loadCmsPages() {
    loadingCmsPages.value = true
    try {
      const allPages = await apiClient.get('/cms/active') as CmsPage[]
      // Exclude 'lien-he' as it's shown separately in dropdown
      cmsPages.value = allPages.filter(p => p.slug !== 'lien-he')
    } catch (e) {
      console.error('Failed to load CMS pages:', e)
      cmsPages.value = []
    } finally {
      loadingCmsPages.value = false
    }
  }

  function onSearch() {
    const q = searchQuery.value?.trim()
    if (q) {
      router.push({ path: '/', query: { search: q } })
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
    cartCount,
    wishlistCount,
    onSearch,
  }
}
