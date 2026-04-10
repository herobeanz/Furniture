import apiClient from './api.client'

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

export interface CollectionProduct {
  id: number
  name: string
  slug: string
  price: number
  salePrice?: number
  thumbnail?: string
  breadcrumb: { name: string; slug: string }[]
}

export const collectionService = {
  async getCollections(): Promise<Collection[]> {
    return apiClient.get('/collections') as Promise<Collection[]>
  },

  async getCollectionBySlug(slug: string): Promise<Collection> {
    return apiClient.get(`/collections/${slug}`) as Promise<Collection>
  },
}
