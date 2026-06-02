import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import type { CategoryTreeNode } from '@/services/api/categories'
import { useCategoryTreeStore } from '@/stores/categoryTree'

/**
 * Danh mục dùng chung — một nguồn Pinia, tránh gọi /categories/tree trùng lặp.
 */
export function useCategoryTree() {
  const store = useCategoryTreeStore()
  const { categoryTree, loading, error } = storeToRefs(store)

  onMounted(() => {
    store.ensureCategoryTree()
  })

  return {
    categoryTree,
    loading,
    error,
    loadCategoryTree: store.loadCategoryTree,
  }
}

export type { CategoryTreeNode }
