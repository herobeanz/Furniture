import { ref, computed } from 'vue'

export type PaginationItem = number | 'ellipsis'

export function useAdminPagination<T>(
  getItems: () => T[],
  options?: { pageSizes?: readonly number[] },
) {
  const page = ref(1)
  const limit = ref(10)

  const total = computed(() => getItems().length)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const rangeStart = computed(() =>
    total.value === 0 ? 0 : (page.value - 1) * limit.value + 1,
  )
  const rangeEnd = computed(() => Math.min(page.value * limit.value, total.value))

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * limit.value
    return getItems().slice(start, start + limit.value)
  })

  const paginationItems = computed((): PaginationItem[] => {
    const last = totalPages.value
    const current = page.value
    if (last <= 7) {
      return Array.from({ length: last }, (_, i) => i + 1)
    }
    const result: PaginationItem[] = [1]
    if (current > 3) result.push('ellipsis')
    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)
    for (let p = start; p <= end; p++) result.push(p)
    if (current < last - 2) result.push('ellipsis')
    result.push(last)
    return result
  })

  function goToPage(next: number) {
    if (next < 1 || next > totalPages.value) return
    page.value = next
  }

  function onLimitChange(value: number) {
    limit.value = value
    page.value = 1
  }

  function resetPage() {
    page.value = 1
  }

  return {
    page,
    limit,
    total,
    totalPages,
    rangeStart,
    rangeEnd,
    paginatedItems,
    paginationItems,
    goToPage,
    onLimitChange,
    resetPage,
    pageSizeOptions: options?.pageSizes ?? ([10, 20, 50] as const),
  }
}
