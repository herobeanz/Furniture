/** Nội dung tĩnh trang Liên hệ — địa chỉ/giờ lấy từ @/constants/site */

export {
  CONTACT_ADDRESS,
  CONTACT_HOURS_LINES,
  CONTACT_HOURS_SHORT,
  CONTACT_MAP_QUERY,
} from "@/constants/site";

export const CONTACT_IMAGES = {
  hero: "https://res.cloudinary.com/dogohungcuong/image/upload/lienhe_edwoot.jpg",
  showroom:
    "https://res.cloudinary.com/dogohungcuong/image/upload/showroom_u26xmk.jpg",
} as const;

export const CONTACT_TOPICS = [
  { value: "", label: "Chọn chủ đề" },
  { value: "design", label: "Tư vấn thiết kế nội thất" },
  { value: "quote", label: "Báo giá sản phẩm" },
  { value: "feedback", label: "Hợp tác / Phản hồi" },
] as const;
