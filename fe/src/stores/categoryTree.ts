import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryApi, type CategoryTreeNode } from '@/services/api/categories'
import { CATEGORY_TREE_STALE_MS, isCacheFresh } from '@/utils/cacheEntry'

let loadPromise: Promise<CategoryTreeNode[]> | null = null

export const useCategoryTreeStore = defineStore('categoryTree', () => {
  const categoryTree = ref<CategoryTreeNode[]>([])
  const loading = ref(false)
  const error = ref('')
  let fetchedAt = 0

  async function loadCategoryTree(force = false): Promise<CategoryTreeNode[]> {
    if (
      !force &&
      categoryTree.value.length > 0 &&
      isCacheFresh(fetchedAt, CATEGORY_TREE_STALE_MS)
    ) {
      return categoryTree.value
    }

    if (loadPromise && !force) {
      return loadPromise
    }

    loading.value = true
    error.value = ''

    loadPromise = (async () => {
      try {
        const tree = await categoryApi.getCategoryTree()
        categoryTree.value = tree
        fetchedAt = Date.now()
        return tree
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : 'Không thể tải danh mục.'
        error.value = message
        categoryTree.value = []
        throw e
      } finally {
        loading.value = false
        loadPromise = null
      }
    })()

    return loadPromise
  }

  function ensureCategoryTree(): void {
    if (
      categoryTree.value.length === 0 ||
      !isCacheFresh(fetchedAt, CATEGORY_TREE_STALE_MS)
    ) {
      void loadCategoryTree()
    }
  }

  return {
    categoryTree,
    loading,
    error,
    loadCategoryTree,
    ensureCategoryTree,
  }
})
