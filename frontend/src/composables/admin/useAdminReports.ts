import { ref, onMounted } from 'vue'
import { reportService, type OverviewStats, type InquiriesStats, type ProductsStats } from '@/services/report.service'
import { extractErrorMessage } from '@/utils/error'

/**
 * Composable for Admin Reports data
 */
export function useAdminReports() {
  const loading = ref(true)
  const error = ref('')
  const overview = ref<OverviewStats | null>(null)
  const inquiriesStats = ref<InquiriesStats | null>(null)
  const productsStats = ref<ProductsStats | null>(null)

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      new: 'Mới',
      contacted: 'Đã liên hệ',
      responded: 'Đã phản hồi',
      closed: 'Đã đóng',
    }
    return labels[status] || status
  }

  function getSourceLabel(source: string): string {
    const labels: Record<string, string> = {
      product: 'Sản phẩm',
      contact: 'Liên hệ',
      facebook: 'Facebook',
      zalo: 'Zalo',
    }
    return labels[source] || source
  }

  async function fetchReports() {
    loading.value = true
    error.value = ''
    try {
      const [overviewData, inquiriesData, productsData] = await Promise.all([
        reportService.getOverview(),
        reportService.getInquiriesStats(),
        reportService.getProductsStats(),
      ])
      overview.value = overviewData
      inquiriesStats.value = inquiriesData
      productsStats.value = productsData
    } catch (e: any) {
      error.value = extractErrorMessage(e, 'Không thể tải dữ liệu báo cáo.')
      console.error('Failed to fetch reports:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchReports()
  })

  return {
    loading,
    error,
    overview,
    inquiriesStats,
    productsStats,
    getStatusLabel,
    getSourceLabel,
    fetchReports,
  }
}
