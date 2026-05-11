import apiClient from './client'
import { unwrapResponseData } from './response'

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

export const roomApi = {
  async getRooms(): Promise<Room[]> {
    const response = await apiClient.get('/rooms')
    return unwrapResponseData<Room[]>(response)
  },

  async getRoom(slug: string): Promise<Room> {
    const response = await apiClient.get(`/rooms/${slug}`)
    return unwrapResponseData<Room>(response)
  },

  async getRoomCategories(slug: string): Promise<any[]> {
    const response = await apiClient.get(`/rooms/${slug}/categories`)
    return unwrapResponseData<any[]>(response)
  },
}
