import type { Product } from '@/services/api/products'
import type { Category } from '@/services/api/categories'

/**
 * Build product path from breadcrumb or fallback
 */
export function getProductPath(
  product:
    | Product
    | { slug: string; breadcrumb?: { name: string; slug: string }[] },
): string {
  if (product.breadcrumb && product.breadcrumb.length >= 2) {
    const category = product.breadcrumb[0];
    if (category?.slug && product.slug) {
      return `/san-pham/${category.slug}/${product.slug}`;
    }
  }
  if (product.breadcrumb && product.breadcrumb.length === 1) {
    const category = product.breadcrumb[0];
    if (category?.slug && product.slug) {
      return `/san-pham/${category.slug}/${product.slug}`;
    }
  }
  return `/san-pham/${product.slug}`;
}

/**
 * Build category path (slug unique toàn site)
 */
export function getCategoryPath(
  category: Category | { slug: string } | string,
): string {
  const slug = typeof category === "string" ? category : category.slug;
  return `/san-pham/${slug}`;
}

export function getCollectionPath(slug: string): string {
  return `/bo-suu-tap/${slug}`;
}
