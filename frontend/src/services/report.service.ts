import apiClient from './api.client'

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

export const reportService = {
  async getOverview(): Promise<OverviewStats> {
    return apiClient.get('/reports/overview') as Promise<OverviewStats>
  },

  async getInquiriesStats(): Promise<InquiriesStats> {
    return apiClient.get('/reports/inquiries') as Promise<InquiriesStats>
  },

  async getProductsStats(): Promise<ProductsStats> {
    return apiClient.get('/reports/products') as Promise<ProductsStats>
  },
}
