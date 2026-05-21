import { ref, computed, watch } from 'vue'
import {
  inquiryApi,
  type AdminInquiry,
  type AdminInquiryListParams,
} from '@/services/api/inquiries'
import { inquiryStatusLabel } from '@/constants/inquiry-status'
import { formatPhoneDisplay } from '@/constants/site'
import { logger } from '@/utils/logger'

export type PaginationItem = number | 'ellipsis'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

export function useAdminInquiries() {
  const items = ref<AdminInquiry[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref('')

  const search = ref('')
  const searchDebounced = ref('')
  const statusFilter = ref('')
  const dateFrom = ref('')
  const dateTo = ref('')
  const page = ref(1)
  const limit = ref<number>(10)

  let searchTimer: ReturnType<typeof setTimeout> | null = null

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const rangeStart = computed(() =>
    total.value === 0 ? 0 : (page.value - 1) * limit.value + 1,
  )
  const rangeEnd = computed(() =>
    Math.min(page.value * limit.value, total.value),
  )

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

  function listParams(overrides: Partial<AdminInquiryListParams> = {}): AdminInquiryListParams {
    return {
      page: page.value,
      limit: limit.value,
      status: statusFilter.value || undefined,
      search: searchDebounced.value.trim() || undefined,
      dateFrom: dateFrom.value || undefined,
      dateTo: dateTo.value || undefined,
      ...overrides,
    }
  }

  async function fetchList() {
    loading.value = true
    error.value = ''
    try {
      const res = await inquiryApi.listAdmin(listParams())
      items.value = res.data
      total.value = res.total
      if (res.page) page.value = res.page
    } catch (e: unknown) {
      logger.error(e)
      error.value = 'Không thể tải danh sách yêu cầu.'
      items.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await inquiryApi.updateStatus(id, status)
      const item = items.value.find((x) => x.id === id)
      if (item) item.status = status
    } catch (e: unknown) {
      logger.error(e)
      throw e
    }
  }

  async function fetchAllForExport(): Promise<AdminInquiry[]> {
    const res = await inquiryApi.listAdmin(
      listParams({ page: 1, limit: Math.min(total.value || 500, 500) }),
    )
    return res.data
  }

  async function exportCsv() {
    const rows = await fetchAllForExport()
    const header = ['STT', 'Họ tên', 'SĐT', 'Email', 'Nội dung', 'Trạng thái', 'Ngày tạo']
    const lines = rows.map((row, index) => [
      String(index + 1),
      csvEscape(row.name),
      csvEscape(formatPhoneDisplay(row.phone)),
      csvEscape(row.email ?? ''),
      csvEscape(row.message),
      csvEscape(inquiryStatusLabel(row.status)),
      csvEscape(formatDateTime(row.createdAt).date),
    ])
    const content = [header, ...lines].map((line) => line.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `yeu-cau-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  function csvEscape(value: string): string {
    const escaped = value.replace(/"/g, '""')
    return `"${escaped}"`
  }

  function formatDateTime(iso: string): { date: string; time: string } {
    const d = new Date(iso)
    return {
      date: d.toLocaleDateString('vi-VN'),
      time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  function goToPage(next: number) {
    if (next < 1 || next > totalPages.value || next === page.value) return
    page.value = next
    fetchList()
  }

  function onLimitChange(value: number) {
    limit.value = value
    page.value = 1
    fetchList()
  }

  watch(search, (value) => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      searchDebounced.value = value
      page.value = 1
      fetchList()
    }, 350)
  })

  watch([statusFilter, dateFrom, dateTo], () => {
    page.value = 1
    fetchList()
  })

  fetchList()

  return {
    items,
    total,
    loading,
    error,
    search,
    statusFilter,
    dateFrom,
    dateTo,
    page,
    limit,
    totalPages,
    rangeStart,
    rangeEnd,
    paginationItems,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    fetchList,
    updateStatus,
    exportCsv,
    formatDateTime,
    goToPage,
    onLimitChange,
    inquiryStatusLabel,
  }
}
