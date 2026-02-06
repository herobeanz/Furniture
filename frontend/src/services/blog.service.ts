import apiClient from './api.client'

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
  createdAt: string
  updatedAt: string
}

export const blogService = {
  async getPosts(featured?: boolean): Promise<BlogPost[]> {
    const params = featured ? '?featured=true' : ''
    return apiClient.get(`/blog${params}`) as Promise<BlogPost[]>
  },

  async getPost(slug: string): Promise<BlogPost> {
    return apiClient.get(`/blog/${slug}`) as Promise<BlogPost>
  },

  async getAdminPosts(): Promise<BlogPost[]> {
    return apiClient.get('/blog/list/all') as Promise<BlogPost[]>
  },

  async getAdminPost(id: number): Promise<BlogPost> {
    return apiClient.get(`/blog/by-id/${id}`) as Promise<BlogPost>
  },

  async getPostPreview(slug: string): Promise<BlogPost> {
    return apiClient.get(`/blog/preview/${slug}`) as Promise<BlogPost>
  },

  async createPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return apiClient.post('/blog', data) as Promise<BlogPost>
  },

  async updatePost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
    return apiClient.patch(`/blog/${id}`, data) as Promise<BlogPost>
  },

  async deletePost(id: number): Promise<{ deleted: boolean }> {
    return apiClient.delete(`/blog/${id}`) as Promise<{ deleted: boolean }>
  },
}
