import { ref, onMounted } from 'vue'
import { categoryApi, type CategoryTreeNode } from '@/services/api/categories'

/**
 * Composable for fetching and managing category tree
 * Used by Header and Footer components
 */
export function useCategoryTree() {
  const categoryTree = ref<CategoryTreeNode[]>([])
  const loading = ref(false)
  const error = ref('')

  async function loadCategoryTree() {
    loading.value = true
    error.value = ''
    try {
      categoryTree.value = await categoryApi.getCategoryTree()
    } catch (e: any) {
      error.value = e?.message || 'Không thể tải danh mục.'
      categoryTree.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadCategoryTree()
  })

  return {
    categoryTree,
    loading,
    error,
    loadCategoryTree,
  }
}
