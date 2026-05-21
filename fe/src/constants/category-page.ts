/** Trang danh mục /san-pham/:categorySlug */

import {
  PRODUCTS_HERO_IMAGE,
  productsSortToApi,
  type ProductsPageSortKey,
} from '@/constants/products-page'

export { PRODUCTS_HERO_IMAGE, productsSortToApi, type ProductsPageSortKey }

export const CATEGORY_PAGE_SIZE = 8

export const CATEGORY_SORT_OPTIONS: { value: ProductsPageSortKey; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
]
