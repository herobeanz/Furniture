import { ref, onMounted } from 'vue'
import apiClient from '@/services/api.client'

export interface DashboardStats {
  products: number
  categories: number
  inquiries: number
  cms: number
}

export interface RecentInquiry {
  id: number
  name: string
  phone: string
  createdAt: string
  status: string
}

/**
 * Composable for Admin Dashboard data
 */
export function useAdminDashboard() {
  const stats = ref<DashboardStats>({ products: 0, categories: 0, inquiries: 0, cms: 0 })
  const recent = ref<RecentInquiry[]>([])
  const loading = ref(true)
  const error = ref('')

  function formatDate(s: string): string {
    return new Date(s).toLocaleDateString('vi-VN')
  }

  async function loadDashboardData() {
    loading.value = true
    error.value = ''
    try {
      const [productsRes, categoriesRes, inquiriesRes, cmsRes] = await Promise.all([
        apiClient.get('/products/list/all').catch(() => []),
        apiClient.get('/categories/list/all').catch(() => []),
        apiClient.get('/inquiries', { params: { limit: 5 } }).catch(() => ({ data: [], total: 0 })),
        apiClient.get('/cms').catch(() => []),
      ])
      stats.value = {
        products: Array.isArray(productsRes) ? (productsRes as any[]).length : 0,
        categories: Array.isArray(categoriesRes) ? (categoriesRes as any[]).length : 0,
        inquiries: (inquiriesRes as any).total ?? 0,
        cms: Array.isArray(cmsRes) ? (cmsRes as any[]).length : 0,
      }
      recent.value = (inquiriesRes as any).data ?? []
    } catch (e: any) {
      error.value = e?.message || 'Không thể tải dữ liệu.'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadDashboardData()
  })

  return {
    stats,
    recent,
    loading,
    error,
    formatDate,
    loadDashboardData,
  }
}
