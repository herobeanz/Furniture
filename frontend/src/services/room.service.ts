import apiClient from './api.client'

export interface Room {
  id: number
  name: string
  slug: string
  description?: string
  thumbnail?: string
  orderIndex: number
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
}

export const roomService = {
  async getRooms(): Promise<Room[]> {
    return apiClient.get('/rooms')
  },

  async getRoom(slug: string): Promise<Room> {
    return apiClient.get(`/rooms/${slug}`)
  },

  async getRoomCategories(slug: string): Promise<any[]> {
    return apiClient.get(`/rooms/${slug}/categories`)
  },
}
