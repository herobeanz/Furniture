import apiClient from './api.client'

export interface HeroItem {
  id: string
  title: string
  link: string
  imageUrl?: string
  orderIndex: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export const heroService = {
  /** Public: active hero items for homepage */
  async getActiveList(): Promise<HeroItem[]> {
    return apiClient.get('/hero')
  },

  /** Admin: all hero items */
  async getAll(): Promise<HeroItem[]> {
    return apiClient.get('/hero/list/all')
  },

  async getById(id: string): Promise<HeroItem> {
    return apiClient.get(`/hero/by-id/${id}`)
  },

  async create(data: { title: string; link: string; imageUrl?: string; orderIndex?: number; isActive?: boolean }): Promise<HeroItem> {
    return apiClient.post('/hero', data)
  },

  async update(id: string, data: Partial<{ title: string; link: string; imageUrl: string; orderIndex: number; isActive: boolean }>): Promise<HeroItem> {
    return apiClient.patch(`/hero/${id}`, data)
  },

  async remove(id: string): Promise<{ deleted: boolean }> {
    return apiClient.delete(`/hero/${id}`)
  },
}
