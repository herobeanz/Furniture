import apiClient from './api.client'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  categoryId?: string
  status: string
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

export const productService = {
  async getProducts(params?: ProductQueryParams): Promise<ProductListResponse> {
    return apiClient.get('/products', { params })
  },

  async getProduct(slug: string): Promise<Product> {
    return apiClient.get(`/products/${slug}`)
  },
}
