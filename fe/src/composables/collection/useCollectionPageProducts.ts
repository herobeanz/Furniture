import { ref, computed, watch, type Ref } from 'vue'
import type { Product } from '@/services/api/products'
import {
  COLLECTION_PAGE_SIZE,
  type CollectionProductSortKey,
} from '@/constants/collection-page'

function sortProducts(list: Product[], sortKey: CollectionProductSortKey): Product[] {
  const copy = [...list]
  switch (sortKey) {
    case 'price-asc':
      return copy.sort(
        (a, b) =>
          (a.salePrice ?? a.price ?? 0) - (b.salePrice ?? b.price ?? 0) ||
          a.name.localeCompare(b.name, 'vi')
      )
    case 'price-desc':
      return copy.sort(
        (a, b) =>
          (b.salePrice ?? b.price ?? 0) - (a.salePrice ?? a.price ?? 0) ||
          a.name.localeCompare(b.name, 'vi')
      )
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    case 'newest':
    default:
      return copy
  }
}

/** Sắp xếp / phân trang sản phẩm trong bộ sưu tập (dữ liệu M2M từ API). */
export function useCollectionPageProducts(allProducts: Ref<Product[]>) {
  const sortKey = ref<CollectionProductSortKey>('newest')
  const currentPage = ref(1)

  const sortedProducts = computed(() => sortProducts(allProducts.value, sortKey.value))

  const totalCount = computed(() => sortedProducts.value.length)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / COLLECTION_PAGE_SIZE))
  )

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * COLLECTION_PAGE_SIZE
    return sortedProducts.value.slice(start, start + COLLECTION_PAGE_SIZE)
  })

  const resultRange = computed(() => {
    const total = totalCount.value
    if (total === 0) return '0–0 của 0'
    const start = (currentPage.value - 1) * COLLECTION_PAGE_SIZE + 1
    const end = Math.min(currentPage.value * COLLECTION_PAGE_SIZE, total)
    return `${start}–${end} của ${total}`
  })

  function setSort(key: CollectionProductSortKey) {
    sortKey.value = key
    currentPage.value = 1
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  watch(allProducts, () => {
    currentPage.value = 1
  })

  watch(sortKey, () => {
    currentPage.value = 1
  })

  return {
    sortKey,
    currentPage,
    paginatedProducts,
    totalCount,
    totalPages,
    resultRange,
    setSort,
    goToPage,
  }
}
