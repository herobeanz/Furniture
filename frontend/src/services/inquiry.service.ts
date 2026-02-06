import apiClient from './api.client'

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

export const inquiryService = {
  async create(payload: CreateInquiryPayload): Promise<InquiryResponse> {
    return apiClient.post('/inquiries', payload)
  },
}
