export interface BlogCategoryStyle {
  label: string
  className: string
}

const CATEGORY_MAP: Record<string, BlogCategoryStyle> = {
  'xu-huong': { label: 'Xu hướng', className: 'cat-orange' },
  'kinh-nghiem': { label: 'Kinh nghiệm', className: 'cat-blue' },
  'chat-lieu': { label: 'Chất liệu', className: 'cat-emerald' },
  'huong-dan': { label: 'Hướng dẫn', className: 'cat-purple' },
  'gioi-thieu': { label: 'Giới thiệu', className: 'cat-pink' },
  'san-pham': { label: 'Sản phẩm', className: 'cat-teal' },
  'phong-khach': { label: 'Phòng khách', className: 'cat-orange' },
  'phong-ngu': { label: 'Phòng ngủ', className: 'cat-blue' },
  'phong-bep': { label: 'Phòng bếp', className: 'cat-emerald' },
  'phong-tho': { label: 'Phòng thờ', className: 'cat-purple' },
}

function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function getBlogCategoryStyle(category?: string | null): BlogCategoryStyle {
  if (!category?.trim()) {
    return { label: '—', className: 'cat-neutral' }
  }
  const key = category.trim().toLowerCase()
  return (
    CATEGORY_MAP[key] ?? {
      label: slugToLabel(key),
      className: 'cat-neutral',
    }
  )
}
