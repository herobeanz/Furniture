/** Nội dung tĩnh trang Liên hệ — địa chỉ/giờ lấy từ @/constants/site */

export {
  CONTACT_ADDRESS,
  CONTACT_HOURS_LINES,
  CONTACT_HOURS_SHORT,
  CONTACT_MAP_QUERY,
} from '@/constants/site'

export const CONTACT_IMAGES = {
  hero:
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
  showroom:
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
} as const

export const CONTACT_TOPICS = [
  { value: '', label: 'Chọn chủ đề' },
  { value: 'design', label: 'Tư vấn thiết kế nội thất' },
  { value: 'quote', label: 'Báo giá sản phẩm' },
  { value: 'feedback', label: 'Hợp tác / Phản hồi' },
] as const
