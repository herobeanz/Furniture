/** Trang Về chúng tôi — nội dung tĩnh (giao diện AboutView) */

export const ABOUT_PAGE_SLUG = "ve-chung-toi";
export const ABOUT_PAGE_PATH = `/${ABOUT_PAGE_SLUG}`;

const ABOUT_PAGE_LEGACY_SLUGS = ["gioi-thieu", "about"] as const;

export function isAboutPageSlug(slug: string): boolean {
  return (
    slug === ABOUT_PAGE_SLUG ||
    (ABOUT_PAGE_LEGACY_SLUGS as readonly string[]).includes(slug)
  );
}

export const ABOUT_STORY_PILLARS = [
  {
    icon: "fa-solid fa-leaf",
    title: "Gỗ tự nhiên 100%",
    description: "Chọn lọc kỹ càng, thân thiện với môi trường",
  },
  {
    icon: "fa-solid fa-compass-drafting",
    title: "Thiết kế tinh tế",
    description: "Kết hợp giữa thẩm mỹ và công năng sử dụng",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Bền vững theo thời gian",
    description: "Chất lượng vượt thời gian, đồng hành cùng ngôi nhà Việt",
  },
] as const;

export const ABOUT_CORE_VALUES = [
  {
    icon: "fa-regular fa-heart",
    title: "Tận tâm",
    description: "Đặt khách hàng làm trung tâm, luôn lắng nghe và thấu hiểu.",
  },
  {
    icon: "fa-regular fa-star",
    title: "Chất lượng",
    description: "Cam kết chất lượng trong từng nguyên liệu và sản phẩm.",
  },
  {
    icon: "fa-solid fa-seedling",
    title: "Bền vững",
    description: "Hướng đến sản xuất xanh, thân thiện với môi trường.",
  },
  {
    icon: "fa-regular fa-lightbulb",
    title: "Sáng tạo",
    description: "Không ngừng đổi mới để mang đến những thiết kế độc đáo.",
  },
] as const;

export const ABOUT_PROCESS_STEPS = [
  {
    step: "01",
    title: "Chọn lọc gỗ",
    description: "Lựa chọn gỗ tự nhiên chất lượng cao, đạt tiêu chuẩn.",
    image:
      "https://res.cloudinary.com/dogohungcuong/image/upload/chonlocgo_j6x8ja.jpg",
  },
  {
    step: "02",
    title: "Gia công",
    description: "Cắt, xẻ và tạo hình bằng máy móc hiện đại, chính xác.",
    image:
      "https://res.cloudinary.com/dogohungcuong/image/upload/giacong_ngjdue.jpg",
  },
  {
    step: "03",
    title: "Hoàn thiện",
    description:
      "Mài, sơn và xử lý bề mặt kỹ lưỡng, tỉ mỉ trong từng chi tiết.",
    image:
      "https://res.cloudinary.com/dogohungcuong/image/upload/hoanthien_nj1kwl.jpg",
  },
  {
    step: "04",
    title: "Kiểm tra chất lượng",
    description:
      "Kiểm tra kỹ lưỡng đảm bảo sản phẩm đạt chuẩn trước khi xuất xưởng.",
    image:
      "https://res.cloudinary.com/dogohungcuong/image/upload/kiemtra_yt4zkj.jpg",
  },
  {
    step: "05",
    title: "Giao đến khách hàng",
    description: "Đóng gói cẩn thận và giao hàng an toàn, đúng tiến độ.",
    image:
      "https://res.cloudinary.com/dogohungcuong/image/upload/vanchuyen_dkp69g.jpg",
  },
] as const;

export const ABOUT_STATS = [
  {
    icon: "fa-regular fa-calendar-check",
    value: "10+",
    label: "Năm kinh nghiệm trong ngành nội thất gỗ",
  },
  {
    icon: "fa-solid fa-users",
    value: "5.000+",
    label: "Khách hàng đã tin tưởng lựa chọn",
  },
  {
    icon: "fa-solid fa-couch",
    value: "500+",
    label: "Sản phẩm đa dạng và chất lượng",
  },
  {
    icon: "fa-solid fa-map-location-dot",
    value: "63",
    label: "Tỉnh thành đã giao hàng toàn quốc",
  },
] as const;

export const ABOUT_IMAGES = {
  hero: "https://res.cloudinary.com/dogohungcuong/image/upload/sofa_wwowln.jpg",
  workshop:
    "https://res.cloudinary.com/dogohungcuong/image/upload/ThoLanhNghe_jqetwb.jpg",
} as const;
