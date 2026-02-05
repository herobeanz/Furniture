import apiClient from './api.client'

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

/** Menu phân cấp: Room (Phòng) → Category (Sofa, Giường...) → Product */
export interface CategoryTreeNode {
  id: number
  name: string
  slug: string
  orderIndex: number
  children: CategoryTreeNode[] // Categories
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return apiClient.get('/categories')
  },

  /** Cây danh mục lồng nhau cho menu (Room → Category). Product sẽ được load khi vào trang category. */
  async getCategoryTree(): Promise<CategoryTreeNode[]> {
    return apiClient.get('/categories/tree')
  },

  async getCategory(slug: string): Promise<Category> {
    return apiClient.get(`/categories/${slug}`)
  },

  async getCategoryByRoomAndSlug(roomSlug: string, categorySlug: string): Promise<Category> {
    // Get categories for the room
    const categories = (await apiClient.get(`/rooms/${roomSlug}/categories`)) as Category[]
    const category = categories.find((c: Category) => c.slug === categorySlug)
    if (!category) {
      throw new Error('Category not found')
    }
    return category
  },

  async getCategoryProducts(slug: string, params?: any, roomSlug?: string): Promise<any> {
    const queryParams = { ...params }
    if (roomSlug) {
      queryParams.roomSlug = roomSlug
    }
    return apiClient.get(`/categories/${slug}/products`, { params: queryParams })
  },
}
