import apiClient from './client'
import { unwrapResponseData } from './response'

export interface CreateInquiryPayload {
  name: string
  phone: string
  email?: string
  message: string
  productId?: number
  source: 'product' | 'contact' | 'facebook' | 'zalo'
}

export interface InquiryResponse {
  id: string
  name: string
  phone: string
  email?: string
  message: string
  status: string
  createdAt: string
}

export interface AdminInquiryProduct {
  id: number
  name: string
  slug: string
}

export interface AdminInquiry {
  id: number
  name: string
  phone: string
  email: string | null
  message: string
  productId: number | null
  product: AdminInquiryProduct | null
  status: string
  source: string
  adminNotes?: string | null
  respondedAt?: string | null
  createdAt: string
}

export interface AdminInquiryListParams {
  page?: number
  limit?: number
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface AdminInquiryListResult {
  data: AdminInquiry[]
  total: number
  page: number
  limit: number
}

export const inquiryApi = {
  async create(payload: CreateInquiryPayload): Promise<InquiryResponse> {
    const response = await apiClient.post('/inquiries', payload)
    return unwrapResponseData<InquiryResponse>(response)
  },

  async listAdmin(params: AdminInquiryListParams = {}): Promise<AdminInquiryListResult> {
    const response = await apiClient.get('/inquiries', { params })
    return unwrapResponseData<AdminInquiryListResult>(response)
  },

  async updateStatus(id: number, status: string): Promise<{ id: number; status: string }> {
    const response = await apiClient.patch(`/inquiries/${id}/status`, { status })
    return unwrapResponseData<{ id: number; status: string }>(response)
  },
}
