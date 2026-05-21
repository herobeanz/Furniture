/** Trang Chính sách đổi trả — nội dung tĩnh (ReturnExchangePolicyView) */

import { BRAND_NAME } from '@/constants/brand'

export const RETURN_EXCHANGE_POLICY_SLUG = 'chinh-sach-doi-tra'
export const RETURN_EXCHANGE_POLICY_PATH = `/${RETURN_EXCHANGE_POLICY_SLUG}`

export function isReturnExchangePolicySlug(slug: string): boolean {
  return slug === RETURN_EXCHANGE_POLICY_SLUG
}

export const RETURN_EXCHANGE_HERO_IMAGE =
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80'

export const RETURN_EXCHANGE_HERO_FEATURES = [
  {
    icon: 'fa-solid fa-box-open',
    title: 'Đổi trả dễ dàng',
    description: 'Quy trình đơn giản, hỗ trợ nhanh chóng.',
  },
  {
    icon: 'fa-regular fa-calendar',
    title: 'Thời gian linh hoạt',
    description: 'Đổi trả trong vòng 7 - 30 ngày.',
  },
  {
    icon: 'fa-regular fa-circle-check',
    title: 'Sản phẩm nguyên vẹn',
    description: 'Đảm bảo sản phẩm còn nguyên tình trạng ban đầu.',
  },
  {
    icon: 'fa-solid fa-headset',
    title: 'Hỗ trợ tận tâm',
    description: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn.',
  },
] as const

export type ReturnExchangeListItem =
  | string
  | { label: string; text: string }

export type ReturnExchangeProcessStep = {
  icon: string
  title: string
  text: string
}

export type ReturnExchangeTermCard = {
  number: string
  title: string
  intro?: string
  items?: ReturnExchangeListItem[]
  note?: string
  steps?: ReturnExchangeProcessStep[]
}

export const RETURN_EXCHANGE_TERM_CARDS: ReturnExchangeTermCard[] = [
  {
    number: '01',
    title: 'Điều kiện đổi trả',
    intro: 'Khách hàng được đổi trả sản phẩm khi đáp ứng đầy đủ các điều kiện sau:',
    items: [
      'Sản phẩm còn nguyên vẹn, chưa qua sử dụng, không bị trầy xước, nứt vỡ.',
      'Còn đầy đủ phụ kiện, tem mác, phiếu bảo hành và hóa đơn mua hàng.',
      'Sản phẩm bị lỗi do nhà sản xuất hoặc do vận chuyển.',
      'Yêu cầu đổi trả được gửi trong thời hạn quy định.',
    ],
  },
  {
    number: '02',
    title: 'Thời gian đổi trả',
    intro: `${BRAND_NAME} hỗ trợ đổi trả sản phẩm trong các khoảng thời gian sau:`,
    items: [
      {
        label: 'Đổi trả do lỗi sản phẩm:',
        text: 'Trong vòng 30 ngày kể từ ngày nhận hàng.',
      },
      {
        label: 'Đổi trả do nhu cầu cá nhân:',
        text: 'Trong vòng 7 ngày kể từ ngày nhận hàng.',
      },
    ],
    note: 'Quá thời hạn trên, chúng tôi rất tiếc không thể hỗ trợ đổi trả.',
  },
  {
    number: '03',
    title: 'Trường hợp được đổi trả',
    intro: 'Khách hàng được đổi trả trong các trường hợp:',
    items: [
      'Sản phẩm giao không đúng mẫu mã, kích thước, màu sắc.',
      'Sản phẩm bị lỗi kỹ thuật, lỗi do nhà sản xuất.',
      'Sản phẩm bị hư hỏng trong quá trình vận chuyển.',
      'Sản phẩm không đúng như mô tả trên website.',
    ],
  },
  {
    number: '04',
    title: 'Trường hợp không được đổi trả',
    intro: 'Chúng tôi không hỗ trợ đổi trả trong các trường hợp:',
    items: [
      'Sản phẩm đã qua sử dụng, lắp đặt hoặc bị hư hại do lỗi của khách hàng.',
      'Sản phẩm được đặt theo yêu cầu riêng, thiết kế riêng.',
      'Hết thời gian đổi trả theo quy định.',
      'Không có hóa đơn mua hàng hoặc thiếu phụ kiện, tem mác đi kèm.',
    ],
  },
  {
    number: '05',
    title: 'Quy trình đổi trả',
    steps: [
      {
        icon: 'fa-regular fa-user',
        title: '1. Liên hệ yêu cầu:',
        text: 'Khách hàng liên hệ qua hotline, email hoặc form hỗ trợ.',
      },
      {
        icon: 'fa-regular fa-clipboard',
        title: '2. Xác nhận thông tin:',
        text: 'Chúng tôi xác nhận điều kiện đổi trả và hướng dẫn chi tiết.',
      },
      {
        icon: 'fa-regular fa-paper-plane',
        title: '3. Gửi trả sản phẩm:',
        text: 'Khách hàng đóng gói và gửi trả sản phẩm theo địa chỉ được hướng dẫn.',
      },
      {
        icon: 'fa-solid fa-arrows-rotate',
        title: '4. Kiểm tra & xử lý:',
        text: 'Sau khi nhận hàng, chúng tôi kiểm tra và tiến hành đổi mới hoặc hoàn tiền theo chính sách.',
      },
    ],
  },
  {
    number: '06',
    title: 'Chi phí đổi trả',
    items: [
      {
        label: `Lỗi do ${BRAND_NAME}:`,
        text: 'Chúng tôi chịu toàn bộ chi phí vận chuyển đổi trả.',
      },
      {
        label: 'Đổi trả do nhu cầu cá nhân:',
        text: 'Khách hàng chịu chi phí vận chuyển hai chiều.',
      },
    ],
    note: 'Chi phí cụ thể sẽ được thông báo trước khi khách hàng gửi trả sản phẩm.',
  },
]
