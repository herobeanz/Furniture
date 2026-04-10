import apiClient from './api.client'

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
  /**
   * Số lượng đã bán (hiển thị "Đã bán: X+")
   */
  soldCount?: number
  /**
   * Điểm đánh giá trung bình (0-5)
   */
  rating?: number
  isActive: boolean
  isFeatured: boolean
  isHot: boolean
  /**
   * Đánh dấu sản phẩm thuộc Daily Flash Sale
   */
  isDailyFlashSale?: boolean
  /**
   * Thời gian kết thúc flash sale cho từng sản phẩm (ISO string)
   */
  flashSaleEndAt?: string | null
  /**
   * Nếu true, hiển thị "Liên hệ" thay vì giá số
   */
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

export const productService = {
  async getProducts(params?: ProductQueryParams): Promise<ProductListResponse> {
    return apiClient.get('/products', { params })
  },

  async getProduct(slug: string): Promise<Product> {
    return apiClient.get(`/products/${slug}`)
  },

  async getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
    const data = await apiClient.get(`/products/${slug}/related`, { params: { limit } })
    return Array.isArray(data) ? data : []
  },
}
