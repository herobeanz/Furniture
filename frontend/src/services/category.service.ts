import apiClient from './api.client'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: string
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return apiClient.get('/categories')
  },

  async getCategory(slug: string): Promise<Category> {
    return apiClient.get(`/categories/${slug}`)
  },

  async getCategoryProducts(slug: string, params?: any): Promise<any> {
    return apiClient.get(`/categories/${slug}/products`, { params })
  },
}
