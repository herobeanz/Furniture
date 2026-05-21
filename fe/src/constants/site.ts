/**
 * Cấu hình thông tin cửa hàng — nguồn duy nhất cho toàn bộ frontend.
 * Override qua biến môi trường Vite (xem fe/.env.example).
 */

function env(key: string, fallback: string): string {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

const DEFAULTS = {
  brand: {
    name: "Đồ gỗ Hùng Cường",
    logoMark: "H",
    logoLineSm: "ĐỒ GỖ",
    logoLineLg: "HÙNG CƯỜNG",
    footerTitle: "ĐỒ GỖ HÙNG CƯỜNG",
    tagline:
      "Mang đến những sản phẩm nội thất gỗ tự nhiên cao cấp, bền đẹp cùng thời gian, nâng tầm không gian sống của bạn.",
  },
  contact: {
    phone: "0357803837",
    email: "xuongdogohungcuong@gmail.com",
    addressLine1: "Làng Nghề Châu Phong, Liên Hà,",
    addressLine2: "Đông Anh, Hà Nội",
    mapUrl: "https://maps.app.goo.gl/FTVZq3HGJzbsoC9V8",
    hoursShort: "08:00 - 17:30 (T2 - CN)",
    hoursLine1: "08:00 - 17:30",
    hoursLine2: "Thứ 2 - Thứ 7",
  },
  social: {
    facebook: "https://www.facebook.com/dogohungcuong",
    zalo: "https://zalo.me/0357803837",
    instagram: "",
    youtube: "",
  },
} as const;

export const SITE = {
  brand: {
    name: env("VITE_BRAND_NAME", DEFAULTS.brand.name),
    logoMark: env("VITE_BRAND_LOGO_MARK", DEFAULTS.brand.logoMark),
    logoLineSm: env("VITE_BRAND_LOGO_LINE_SM", DEFAULTS.brand.logoLineSm),
    logoLineLg: env("VITE_BRAND_LOGO_LINE_LG", DEFAULTS.brand.logoLineLg),
    footerTitle: env("VITE_BRAND_FOOTER_TITLE", DEFAULTS.brand.footerTitle),
    tagline: env("VITE_BRAND_TAGLINE", DEFAULTS.brand.tagline),
  },
  contact: {
    phone: env("VITE_CONTACT_PHONE", DEFAULTS.contact.phone),
    email: env("VITE_CONTACT_EMAIL", DEFAULTS.contact.email),
    addressLine1: env(
      "VITE_CONTACT_ADDRESS_LINE1",
      DEFAULTS.contact.addressLine1,
    ),
    addressLine2: env(
      "VITE_CONTACT_ADDRESS_LINE2",
      DEFAULTS.contact.addressLine2,
    ),
    mapUrl: env("VITE_CONTACT_MAP_URL", DEFAULTS.contact.mapUrl),
    hoursShort: env("VITE_CONTACT_HOURS_SHORT", DEFAULTS.contact.hoursShort),
    hoursLine1: env("VITE_CONTACT_HOURS_LINE1", DEFAULTS.contact.hoursLine1),
    hoursLine2: env("VITE_CONTACT_HOURS_LINE2", DEFAULTS.contact.hoursLine2),
  },
  social: {
    facebook: env("VITE_FACEBOOK_URL", DEFAULTS.social.facebook),
    zalo: env("VITE_ZALO_URL", DEFAULTS.social.zalo),
    instagram: env("VITE_INSTAGRAM_URL", DEFAULTS.social.instagram),
    youtube: env("VITE_YOUTUBE_URL", DEFAULTS.social.youtube),
  },
} as const;

/** Tên thương hiệu hiển thị (tương thích code cũ dùng BRAND_NAME). */
export const BRAND_NAME = SITE.brand.name;

export const CONTACT_ADDRESS = {
  line1: SITE.contact.addressLine1,
  line2: SITE.contact.addressLine2,
} as const;

export const CONTACT_ADDRESS_FULL =
  `${SITE.contact.addressLine1} ${SITE.contact.addressLine2}`.trim();

export const CONTACT_MAP_QUERY = CONTACT_ADDRESS_FULL;

export const CONTACT_HOURS_SHORT = SITE.contact.hoursShort;

export const CONTACT_HOURS_LINES = [
  SITE.contact.hoursLine1,
  SITE.contact.hoursLine2,
] as const;

/** Số điện thoại dạng hiển thị: 0981 575 888 */
export function formatPhoneDisplay(phone: string): string {
  const raw = phone.replace(/\D/g, "");
  if (raw.length === 10) {
    return `${raw.slice(0, 4)} ${raw.slice(4, 7)} ${raw.slice(7)}`;
  }
  if (raw.length === 11 && raw.startsWith("84")) {
    const local = raw.slice(2);
    return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
  }
  return phone;
}

/** href cho thẻ tel: (+84…) */
export function phoneTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "tel:";
  if (digits.startsWith("84")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+84${digits.slice(1)}`;
  return `tel:+${digits}`;
}
