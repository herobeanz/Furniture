/** Nội dung tĩnh cho các trang chính sách / pháp lý (trước đây quản lý qua CMS DB). */

export interface StaticContentPage {
  slug: string
  title: string
  paragraphs: string[]
}

export const PRIVACY_POLICY_PAGE: StaticContentPage = {
  slug: 'privacy-policy',
  title: 'Chính sách bảo mật',
  paragraphs: [
    'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu chỉ dùng để xử lý đơn hàng và liên hệ.',
  ],
}

export const TERMS_PAGE: StaticContentPage = {
  slug: 'terms',
  title: 'Điều khoản sử dụng',
  paragraphs: [
    'Khi sử dụng website, bạn đồng ý với các điều khoản của chúng tôi. Vui lòng đọc kỹ trước khi gửi yêu cầu.',
  ],
}

export const SHIPPING_POLICY_PAGE: StaticContentPage = {
  slug: 'chinh-sach-van-chuyen',
  title: 'Chính sách vận chuyển',
  paragraphs: [
    'Đồ gỗ Hùng Cường hỗ trợ giao hàng tận nơi toàn quốc. Nội thành Hà Nội được hỗ trợ phí vận chuyển theo từng đơn hàng.',
  ],
}

export const WOOD_CARE_GUIDE_PAGE: StaticContentPage = {
  slug: 'huong-dan-bao-quan-go',
  title: 'Hướng dẫn bảo quản đồ gỗ',
  paragraphs: [
    'Tránh để sản phẩm gỗ tiếp xúc trực tiếp với nắng, mưa và nguồn nhiệt cao. Vệ sinh định kỳ bằng khăn mềm, tránh hóa chất mạnh.',
  ],
}

export const STATIC_CONTENT_PAGES = [
  PRIVACY_POLICY_PAGE,
  TERMS_PAGE,
  SHIPPING_POLICY_PAGE,
  WOOD_CARE_GUIDE_PAGE,
] as const
