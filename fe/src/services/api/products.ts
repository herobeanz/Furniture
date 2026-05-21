import apiClient from './client'
import { unwrapResponseData } from './response'

export interface Product {
  id: number
  name: string
  slug: string
  sku: string
  description: string
  shortDescription?: string
  price: number
  salePrice?: number
  thumbnail?: string
  images: string[]
  categoryId: number
  status: string
  material?: string
  dimensions?: string
  color?: string
  warranty?: string
  soldCount?: number
  rating?: number
  isActive: boolean
  isFeatured: boolean
  isHot: boolean
  isDailyFlashSale?: boolean
  flashSaleEndAt?: string | null
  isContactPrice?: boolean
  seoTitle?: string
  seoDescription?: string
  breadcrumb?: { name: string; slug: string }[]
  sortOrder?: number
  createdAt?: string
}

export interface ProductListResponse {
  data: Product[]
  total: number
  page: number
  limit: number
}

export interface ProductQueryParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export const productApi = {
  async getProducts(params?: ProductQueryParams): Promise<ProductListResponse> {
    const response = await apiClient.get('/products', { params })
    return unwrapResponseData<ProductListResponse>(response)
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await apiClient.get(`/products/${slug}`)
    return unwrapResponseData<Product>(response)
  },

  async getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
    const response = await apiClient.get(`/products/${slug}/related`, { params: { limit } })
    const data = unwrapResponseData<Product[]>(response)
    return Array.isArray(data) ? data : []
  },

  async listAdmin(): Promise<Product[]> {
    const response = await apiClient.get('/products/list/all')
    const data = unwrapResponseData<Product[]>(response)
    return Array.isArray(data) ? data : []
  },

  async getById(id: number): Promise<Product> {
    const response = await apiClient.get(`/products/by-id/${id}`)
    return unwrapResponseData<Product>(response)
  },

  async create(payload: Record<string, unknown>): Promise<Product> {
    const response = await apiClient.post('/products', payload)
    return unwrapResponseData<Product>(response)
  },

  async update(id: number, payload: Record<string, unknown>): Promise<Product> {
    const response = await apiClient.patch(`/products/${id}`, payload)
    return unwrapResponseData<Product>(response)
  },

  async reorder(products: { id: number; sortOrder: number }[]): Promise<void> {
    await apiClient.patch('/products/reorder', { products })
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`)
  },
}
