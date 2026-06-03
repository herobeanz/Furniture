import type { Review } from '@/components/ReviewsCarousel.vue'

/**
 * Đánh giá khách hàng trên trang chủ.
 *
 * `avatar` = URL ảnh đại diện (bắt buộc nếu muốn hiển thị ảnh thật):
 * - Link Cloudinary sau khi upload (giống HOME_HERO_IMAGE trong home.ts)
 * - Link ảnh AI gen (Gemini, Midjourney, …) host trên CDN/Cloudinary
 * - Bất kỳ URL HTTPS công khai nào (jpg/png/webp)
 *
 * Chỉ cần thay chuỗi `avatar` — không dùng chữ cái từ tên.
 * Ảnh mẫu bên dưới là placeholder; thay bằng link của bạn khi có.
 */
export const HOME_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Nguyễn Minh Tuấn',
    location: 'Hà Nội',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces',
    content:
      'Chất lượng sản phẩm vượt mong đợi. Gỗ đẹp, chắc chắn và tinh tế trong từng chi tiết.',
  },
  {
    id: '2',
    author: 'Trần Thị Mai',
    location: 'Đà Nẵng',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces',
    content:
      'Dịch vụ rất chuyên nghiệp, giao hàng nhanh và hỗ trợ lắp đặt tận nơi nhiệt tình.',
  },
  {
    id: '3',
    author: 'Lê Hoàng Nam',
    location: 'TP. Hồ Chí Minh',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces',
    content:
      'Không gian nhà tôi đẹp hơn hẳn từ khi dùng nội thất gỗ của Hùng Cường.',
  },
  {
    id: '4',
    author: 'Mạnh Hùng',
    location: 'Ninh Bình',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces',
    content: 'Phục vụ rất nhiệt tình, sản phẩm đúng mô tả. Tôi rất hài lòng.',
  },
  {
    id: '5',
    author: 'Lan Nguyễn',
    location: 'Hà Nội',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=faces',
    content: 'Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ lâu dài.',
  },
]
