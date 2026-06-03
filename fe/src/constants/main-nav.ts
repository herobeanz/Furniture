import { ABOUT_PAGE_PATH } from "@/constants/about";

export interface MainNavItem {
  label: string;
  to: string;
}

/** Menu chính header — dùng lại ở footer cột Danh mục */
export const MAIN_NAV_ITEMS: MainNavItem[] = [
  { label: "Trang chủ", to: "/" },
  { label: "Về chúng tôi", to: ABOUT_PAGE_PATH },
  { label: "Sản phẩm", to: "/san-pham" },
  { label: "Bộ sưu tập", to: "/bo-suu-tap" },
  { label: "Cẩm nang", to: "/blog" },
  { label: "Liên hệ", to: "/lien-he" },
];
