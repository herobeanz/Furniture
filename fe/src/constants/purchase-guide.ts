/** Trang Hướng dẫn mua hàng — nội dung tĩnh (PurchaseGuideView) */

import { BRAND_NAME } from '@/constants/brand'

export const PURCHASE_GUIDE_SLUG = 'huong-dan-mua-hang'
export const PURCHASE_GUIDE_PATH = `/${PURCHASE_GUIDE_SLUG}`

export function isPurchaseGuideSlug(slug: string): boolean {
  return slug === PURCHASE_GUIDE_SLUG
}

export const PURCHASE_GUIDE_HERO_IMAGE =
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80'

export type PurchaseOrderChannelCta =
  | { type: 'zalo'; label: string }
  | { type: 'messenger'; label: string }
  | { type: 'phone'; label: string }

export type PurchaseOrderChannel = {
  number: string
  title: string
  intro: string
  icon: string
  iconTone: 'zalo' | 'messenger' | 'phone'
  benefits: string[]
  cta: PurchaseOrderChannelCta
}

export const PURCHASE_ORDER_CHANNELS: PurchaseOrderChannel[] = [
  {
    number: '01',
    title: 'Đặt hàng qua Zalo',
    intro: `Nhắn tin trực tiếp với ${BRAND_NAME} để được tư vấn và đặt hàng nhanh chóng.`,
    icon: 'fa-solid fa-comment-sms',
    iconTone: 'zalo',
    benefits: [
      'Tư vấn chi tiết, nhanh chóng',
      'Gửi hình ảnh, thông tin sản phẩm',
      'Xác nhận đơn hàng dễ dàng',
    ],
    cta: { type: 'zalo', label: 'Chat ngay trên Zalo' },
  },
  {
    number: '02',
    title: 'Đặt hàng qua Messenger',
    intro: `Chat với ${BRAND_NAME} trên Facebook để được hỗ trợ và đặt hàng.`,
    icon: 'fa-brands fa-facebook-messenger',
    iconTone: 'messenger',
    benefits: [
      'Tư vấn chi tiết, nhanh chóng',
      'Gửi hình ảnh, thông tin sản phẩm',
      'Xác nhận đơn hàng dễ dàng',
    ],
    cta: { type: 'messenger', label: 'Chat ngay trên Messenger' },
  },
  {
    number: '03',
    title: 'Đặt hàng qua Hotline',
    intro: `Gọi ngay cho ${BRAND_NAME} để được tư vấn và đặt hàng trực tiếp.`,
    icon: 'fa-solid fa-phone-volume',
    iconTone: 'phone',
    benefits: [
      'Tư vấn trực tiếp qua điện thoại',
      'Hỗ trợ 24/7 trong giờ làm việc',
      'Xác nhận đơn hàng nhanh chóng',
    ],
    cta: { type: 'phone', label: 'Gọi ngay' },
  },
]

export type PurchaseProcessStep = {
  icon: string
  title: string
  description: string
}

export const PURCHASE_PROCESS_STEPS: PurchaseProcessStep[] = [
  {
    icon: 'fa-solid fa-headset',
    title: '1. Liên hệ đặt hàng',
    description: 'Chọn 1 trong 3 cách trên để liên hệ và gửi yêu cầu.',
  },
  {
    icon: 'fa-regular fa-comments',
    title: '2. Tư vấn & báo giá',
    description: 'Nhân viên tư vấn chi tiết sản phẩm, báo giá và xác nhận đơn hàng.',
  },
  {
    icon: 'fa-regular fa-square-check',
    title: '3. Xác nhận & thanh toán',
    description: 'Xác nhận đơn hàng và tiến hành đặt cọc (nếu có).',
  },
  {
    icon: 'fa-solid fa-truck-ramp-box',
    title: '4. Giao hàng & hoàn tất',
    description: 'Sản phẩm được giao đến bạn và kiểm tra trước khi thanh toán.',
  },
]

export const PURCHASE_VALUE_PROPS = [
  {
    icon: 'fa-solid fa-user-check',
    title: 'Tư vấn tận tâm',
    description: 'Đội ngũ chuyên nghiệp hỗ trợ nhiệt tình',
  },
  {
    icon: 'fa-solid fa-circle-check',
    title: 'Sản phẩm chất lượng',
    description: 'Cam kết đúng chất liệu, đúng mẫu mã',
  },
  {
    icon: 'fa-solid fa-truck',
    title: 'Giao hàng toàn quốc',
    description: 'Hỗ trợ giao hàng nhanh chóng, an toàn',
  },
  {
    icon: 'fa-solid fa-credit-card',
    title: 'Thanh toán linh hoạt',
    description: 'Nhiều hình thức thanh toán an toàn, tiện lợi',
  },
] as const
