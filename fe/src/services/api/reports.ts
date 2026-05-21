import apiClient from './client'
import { unwrapResponseData } from './response'

export interface DashboardStatCard {
  value: number
  changePercent: number
  compareLabel: string
}

export interface DashboardData {
  cards: {
    newInquiries: DashboardStatCard
    products: DashboardStatCard
    weeklyInquiries: DashboardStatCard
    customers: DashboardStatCard
  }
  activityChart: {
    labels: string[]
    data: number[]
    days: number
  }
  recentInquiries: Array<{
    id: number
    name: string
    phone: string
    message: string
    status: string
    productName: string | null
    createdAt: string
  }>
  latestProducts: Array<{
    id: number
    name: string
    categoryName: string
    price: number
    isContactPrice: boolean
    thumbnail: string | null
    isActive: boolean
    createdAt: string
  }>
  productsByCategory: Array<{
    name: string
    count: number
    percent: number
  }>
}

export const reportApi = {
  async getDashboard(chartDays: 7 | 30 = 7): Promise<DashboardData> {
    const response = await apiClient.get('/reports/dashboard', {
      params: { chartDays },
    })
    return unwrapResponseData<DashboardData>(response)
  },
}
