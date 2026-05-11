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

export const inquiryApi = {
  async create(payload: CreateInquiryPayload): Promise<InquiryResponse> {
    const response = await apiClient.post('/inquiries', payload)
    return unwrapResponseData<InquiryResponse>(response)
  },
}
