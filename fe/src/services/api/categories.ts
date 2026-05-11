import apiClient from './client'
import { unwrapResponseData } from './response'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  thumbnail?: string
  roomId: number
  orderIndex: number
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
  breadcrumb?: { name: string; slug: string }[]
}

export interface CategoryTreeNode {
  id: number
  name: string
  slug: string
  orderIndex: number
  children: CategoryTreeNode[]
}

export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories')
    return unwrapResponseData<Category[]>(response)
  },

  async getCategoryTree(): Promise<CategoryTreeNode[]> {
    const response = await apiClient.get('/categories/tree')
    return unwrapResponseData<CategoryTreeNode[]>(response)
  },

  async getCategory(slug: string, roomSlug?: string): Promise<Category> {
    const params = roomSlug ? { roomSlug } : undefined
    const response = await apiClient.get(`/categories/${slug}`, { params })
    return unwrapResponseData<Category>(response)
  },

  async getCategoryByRoomAndSlug(roomSlug: string, categorySlug: string): Promise<Category> {
    const response = await apiClient.get(`/rooms/${roomSlug}/categories`)
    const categories = unwrapResponseData<Category[]>(response)
    const category = categories.find((c: Category) => c.slug === categorySlug)
    if (!category) throw new Error('Category not found')
    return category
  },

  async getCategoryProducts(slug: string, params?: Record<string, unknown>, roomSlug?: string): Promise<any> {
    const queryParams = { ...params, ...(roomSlug ? { roomSlug } : {}) }
    const response = await apiClient.get(`/categories/${slug}/products`, { params: queryParams })
    return unwrapResponseData<any>(response)
  },
}
