/** Trang danh sách tất cả sản phẩm /san-pham */

export const PRODUCTS_PAGE_SIZE = 12

export const PRODUCTS_HERO_IMAGE =
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80'

export type ProductsPageSortKey = 'newest' | 'price-asc' | 'price-desc'

export const PRODUCTS_PAGE_SORT_OPTIONS: {
  value: ProductsPageSortKey
  label: string
}[] = [
  { value: 'newest', label: 'Sắp xếp: Mới nhất' },
  { value: 'price-asc', label: 'Sắp xếp: Giá từ thấp đến cao' },
  { value: 'price-desc', label: 'Sắp xếp: Giá từ cao đến thấp' },
]

const CATEGORY_STRIP_ICONS: Record<string, string> = {
  'sofa-couches': 'fa-couch',
  sofa: 'fa-couch',
  'ke-tivi': 'fa-tv',
  'ban-tra': 'fa-table',
  'coffee-tables': 'fa-mug-hot',
  'tu-trang-tri': 'fa-box',
  'ke-sach': 'fa-book-open',
  'dining-tables': 'fa-utensils',
  'dining-chairs': 'fa-chair',
  'ghe-thu-gian': 'fa-chair',
  giuong: 'fa-bed',
  'tu-quan-ao': 'fa-door-open',
  'ban-tho': 'fa-place-of-worship',
  'ke-tho': 'fa-layer-group',
}

export function categoryStripIcon(slug: string): string {
  return CATEGORY_STRIP_ICONS[slug] ?? 'fa-box'
}

export function productsSortToApi(sortKey: ProductsPageSortKey): {
  sort: string
  order: 'asc' | 'desc'
} {
  switch (sortKey) {
    case 'price-asc':
      return { sort: 'price', order: 'asc' }
    case 'price-desc':
      return { sort: 'price', order: 'desc' }
    default:
      return { sort: 'createdAt', order: 'desc' }
  }
}
