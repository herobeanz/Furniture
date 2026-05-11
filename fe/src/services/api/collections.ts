import apiClient from './client'
import { unwrapResponseData } from './response'

export interface CollectionProduct {
  id: number
  name: string
  slug: string
  price: number
  salePrice?: number
  thumbnail?: string
  breadcrumb: { name: string; slug: string }[]
}

export interface Collection {
  id: number
  name: string
  slug: string
  description?: string
  thumbnail?: string
  orderIndex: number
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
  products?: CollectionProduct[]
}

export const collectionApi = {
  async getCollections(): Promise<Collection[]> {
    const response = await apiClient.get('/collections')
    return unwrapResponseData<Collection[]>(response)
  },

  async getCollectionBySlug(slug: string): Promise<Collection> {
    const response = await apiClient.get(`/collections/${slug}`)
    return unwrapResponseData<Collection>(response)
  },
}
