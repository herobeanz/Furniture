import apiClient from './client'
import { unwrapResponseData } from './response'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  thumbnail?: string
  orderIndex: number
  isActive: boolean
  productCount?: number
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

  async getCategory(slug: string): Promise<Category> {
    const response = await apiClient.get(`/categories/${slug}`)
    return unwrapResponseData<Category>(response)
  },

  async getCategoryProducts(
    slug: string,
    params?: Record<string, unknown>
  ): Promise<{ data: unknown[]; total: number }> {
    const response = await apiClient.get(`/categories/${slug}/products`, { params })
    return unwrapResponseData<{ data: unknown[]; total: number }>(response)
  },

  async listAdmin(): Promise<Category[]> {
    const response = await apiClient.get('/categories/list/all')
    return unwrapResponseData<Category[]>(response)
  },

  async getById(id: number): Promise<Category> {
    const response = await apiClient.get(`/categories/by-id/${id}`)
    return unwrapResponseData<Category>(response)
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/categories/${id}`)
  },

  async reorder(categories: { id: number; orderIndex: number }[]): Promise<void> {
    await apiClient.patch('/categories/reorder', { categories })
  },

  async create(
    payload: Omit<Category, 'id' | 'productCount' | 'breadcrumb'>,
  ): Promise<Category> {
    const response = await apiClient.post('/categories', payload)
    return unwrapResponseData<Category>(response)
  },

  async update(
    id: number,
    payload: Partial<Omit<Category, 'id' | 'productCount' | 'breadcrumb'>>,
  ): Promise<Category> {
    const response = await apiClient.patch(`/categories/${id}`, payload)
    return unwrapResponseData<Category>(response)
  },
}
