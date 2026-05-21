import { ref } from 'vue'
import { reportApi, type DashboardData } from '@/services/api/reports'

import {
  inquiryStatusLabel as inquiryStatusLabelFn,
  inquiryStatusClass as inquiryStatusClassFn,
} from '@/constants/inquiry-status'

export function useAdminDashboard() {
  const data = ref<DashboardData | null>(null)
  const loading = ref(true)
  const error = ref('')
  const chartDays = ref<7 | 30>(7)

  function formatTrend(percent: number): string {
    const sign = percent > 0 ? '+' : ''
    return `${sign}${percent}%`
  }

  function trendClass(percent: number): string {
    if (percent > 0) return 'trend-up'
    if (percent < 0) return 'trend-down'
    return 'trend-neutral'
  }

  async function loadDashboardData(days: 7 | 30 = chartDays.value) {
    loading.value = true
    error.value = ''
    chartDays.value = days
    try {
      data.value = await reportApi.getDashboard(days)
    } catch (e: unknown) {
      const message =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: string }).message)
          : 'Không thể tải dữ liệu dashboard.'
      error.value = message
      data.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    chartDays,
    loadDashboardData,
    inquiryStatusLabel: inquiryStatusLabelFn,
    inquiryStatusClass: inquiryStatusClassFn,
    formatTrend,
    trendClass,
  }
}
