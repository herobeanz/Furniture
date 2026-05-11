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
}
