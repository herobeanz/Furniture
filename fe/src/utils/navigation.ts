import type { Product } from '../services/product.service'
import type { Category } from '../services/category.service'
import type { Room } from '../services/room.service'

/**
 * Build product path from breadcrumb or fallback
 */
export function getProductPath(product: Product | { slug: string; breadcrumb?: { name: string; slug: string }[] }): string {
  // If product has breadcrumb with at least room and category (2 items), use it to build path
  if (product.breadcrumb && product.breadcrumb.length >= 2) {
    const room = product.breadcrumb[0]
    const category = product.breadcrumb[1]
    if (room && category && room.slug && category.slug && product.slug) {
      return `/${room.slug}/${category.slug}/${product.slug}`
    }
  }
  // Fallback: try to get from current route or use simple path
  return `/san-pham/${product.slug}`
}

/**
 * Build category path from breadcrumb or fallback
 */
export function getCategoryPath(category: Category, rooms?: Room[]): string {
  // If we have breadcrumb info, use it
  if (category.breadcrumb && category.breadcrumb.length >= 2) {
    const roomSlug = category.breadcrumb[0]?.slug
    if (roomSlug) {
      return `/${roomSlug}/${category.slug}`
    }
  }
  
  // Fallback: if category has roomId, find the room
  if ((category as any).roomId && rooms) {
    const room = rooms.find((r) => r.id === (category as any).roomId)
    if (room) {
      return `/${room.slug}/${category.slug}`
    }
  }
  
  // Last fallback
  return `/${category.slug}`
}
