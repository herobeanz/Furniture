/**
 * Design tokens — khớp mockup HTML Đồ Gỗ Hùng Cường
 * @see fe/docs/DESIGN_SYSTEM.md
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: '#92400e',
    primaryHover: '#78350f',
    primaryDark: '#78350f',
    star: '#f59e0b',
    heroBg: '#f7f4f0',
    pageBg: '#f9fafb',
    bgAlt: '#fcfbfa',
    footerBg: '#1c1917',
    heading: '#111827',
    text: '#374151',
    textMuted: '#6b7280',
    textLight: '#9ca3af',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
  },
  fonts: {
    sans: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  },
  fontSize: {
    sectionTitle: '1.5rem',
    heroTitle: 'clamp(2rem, 5vw, 3rem)',
    eyebrow: '0.75rem',
    cardTitle: '0.75rem',
    bodySm: '0.875rem',
    caption: '0.6875rem',
  },
  iconSize: {
    xs: '0.75rem',
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '1.75rem',
  },
} as const

export const VALUE_PROPS = [
  { icon: 'tree', title: 'Gỗ tự nhiên 100%', description: 'An toàn, bền vững' },
  { icon: 'shield', title: 'Bảo hành 5 năm', description: 'Cam kết chất lượng' },
  { icon: 'truck', title: 'Giao hàng toàn quốc', description: 'Nhanh chóng, tận tâm' },
  { icon: 'ruler', title: 'Thiết kế theo yêu cầu', description: 'Đáp ứng mọi không gian' },
] as const
