/** Trang chi tiết bộ sưu tập /bo-suu-tap/:slug */

export const COLLECTION_PAGE_SIZE = 12

export type CollectionProductSortKey =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'

export const COLLECTION_PRODUCT_SORT_OPTIONS: {
  value: CollectionProductSortKey
  label: string
}[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp trước' },
  { value: 'price-desc', label: 'Giá cao trước' },
  { value: 'name-asc', label: 'Tên A–Z' },
]

