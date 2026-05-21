import apiClient from './client'
import { unwrapResponseData } from './response'

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  thumbnail?: string
  category?: string
  author?: string
  seoTitle?: string
  seoDescription?: string
  isActive: boolean
  isFeatured: boolean
  publishedAt?: string
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

export const blogApi = {
  async getPosts(featured?: boolean): Promise<BlogPost[]> {
    const response = await apiClient.get('/blog', { params: featured ? { featured: true } : undefined })
    return unwrapResponseData<BlogPost[]>(response)
  },

  async getPost(slug: string): Promise<BlogPost> {
    const response = await apiClient.get(`/blog/${slug}`)
    return unwrapResponseData<BlogPost>(response)
  },

  async getAdminPosts(): Promise<BlogPost[]> {
    const response = await apiClient.get('/blog/list/all')
    return unwrapResponseData<BlogPost[]>(response)
  },

  async getAdminPost(id: number): Promise<BlogPost> {
    const response = await apiClient.get(`/blog/by-id/${id}`)
    return unwrapResponseData<BlogPost>(response)
  },

  async getPostPreview(slug: string): Promise<BlogPost> {
    const response = await apiClient.get(`/blog/preview/${slug}`)
    return unwrapResponseData<BlogPost>(response)
  },

  async createPost(data: Partial<BlogPost>): Promise<BlogPost> {
    const response = await apiClient.post('/blog', data)
    return unwrapResponseData<BlogPost>(response)
  },

  async updatePost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
    const response = await apiClient.patch(`/blog/${id}`, data)
    return unwrapResponseData<BlogPost>(response)
  },

  async reorder(posts: { id: number; sortOrder: number }[]): Promise<void> {
    await apiClient.patch('/blog/reorder', { posts })
  },

  async deletePost(id: number): Promise<{ deleted: boolean }> {
    const response = await apiClient.delete(`/blog/${id}`)
    return unwrapResponseData<{ deleted: boolean }>(response)
  },
}
