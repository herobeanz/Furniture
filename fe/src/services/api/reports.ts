import apiClient from './client'
import { unwrapResponseData } from './response'

export interface OverviewStats {
  totals: {
    rooms: number
    categories: number
    products: number
    inquiries: number
    collections: number
    cmsPages: number
  }
  inquiries: {
    total: number
    new: number
    recent: number
    byStatus: Record<string, number>
    bySource: Record<string, number>
  }
  products: {
    total: number
    active: number
  }
}

export interface InquiriesStats {
  total: number
  last30Days: number
  last7Days: number
  byStatus: Record<string, number>
  bySource: Record<string, number>
}

export interface ProductsStats {
  total: number
  active: number
  inactive: number
  byRoom: Record<string, number>
}

export const reportApi = {
  async getOverview(): Promise<OverviewStats> {
    const response = await apiClient.get('/reports/overview')
    return unwrapResponseData<OverviewStats>(response)
  },

  async getInquiriesStats(): Promise<InquiriesStats> {
    const response = await apiClient.get('/reports/inquiries')
    return unwrapResponseData<InquiriesStats>(response)
  },

  async getProductsStats(): Promise<ProductsStats> {
    const response = await apiClient.get('/reports/products')
    return unwrapResponseData<ProductsStats>(response)
  },
}
