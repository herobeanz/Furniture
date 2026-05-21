/** Trang 404 — hình ảnh và liên kết gợi ý */

export const NOT_FOUND_HERO_IMAGE =
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'

export const NOT_FOUND_SUGGESTIONS = [
  { label: 'Sản phẩm', to: '/san-pham', icon: 'fa-solid fa-couch' },
  { label: 'Bộ sưu tập', to: '/bo-suu-tap', icon: 'fa-solid fa-border-all' },
  { label: 'Blog', to: '/blog', icon: 'fa-regular fa-newspaper' },
  { label: 'Liên hệ', to: '/lien-he', icon: 'fa-solid fa-phone' },
] as const
