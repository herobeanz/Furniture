/** Trang Chính sách bảo hành — nội dung tĩnh (WarrantyPolicyView) */

import { BRAND_NAME } from "@/constants/brand";

export const WARRANTY_POLICY_SLUG = "chinh-sach-bao-hanh";
export const WARRANTY_POLICY_PATH = `/${WARRANTY_POLICY_SLUG}`;

export function isWarrantyPolicySlug(slug: string): boolean {
  return slug === WARRANTY_POLICY_SLUG;
}

export const WARRANTY_HERO_IMAGE =
  "https://res.cloudinary.com/dogohungcuong/image/upload/baohanh_fzzltj.jpg";

export const WARRANTY_HERO_FEATURES = [
  {
    icon: "fa-solid fa-shield-halved",
    title: "Bảo hành chính hãng",
    description: `Cam kết bảo hành theo đúng chính sách của ${BRAND_NAME}.`,
  },
  {
    icon: "fa-regular fa-clock",
    title: "Hỗ trợ nhanh chóng",
    description: "Đội ngũ kỹ thuật hỗ trợ tận tình, xử lý kịp thời mọi vấn đề.",
  },
  {
    icon: "fa-regular fa-handshake",
    title: "Minh bạch rõ ràng",
    description: "Điều khoản rõ ràng, áp dụng dễ hiểu cho mọi khách hàng.",
  },
  {
    icon: "fa-solid fa-leaf",
    title: "Chất lượng bền vững",
    description:
      "Sản phẩm được kiểm định kỹ lưỡng, độ bền vượt trội theo thời gian.",
  },
] as const;

export type WarrantyListItem = string | { label: string; text: string };

export type WarrantyProcessStep = {
  icon: string;
  title: string;
  text: string;
};

export type WarrantyTermCard = {
  number: string;
  title: string;
  intro?: string;
  items?: WarrantyListItem[];
  note?: string;
  steps?: WarrantyProcessStep[];
  contactLines?: boolean;
};

export const WARRANTY_TERM_CARDS: WarrantyTermCard[] = [
  {
    number: "01",
    title: "Thời gian bảo hành",
    intro: "Tùy theo từng sản phẩm, thời gian bảo hành được áp dụng như sau:",
    items: [
      {
        label: "60 tháng:",
        text: "Đối với kết cấu khung gỗ (bàn, ghế, tủ, giường...)",
      },
      {
        label: "24 tháng:",
        text: "Đối với phụ kiện (ray trượt, bản lề, tay nắm...)",
      },
      {
        label: "12 tháng:",
        text: "Đối với bề mặt sơn PU, vải nỉ, da bọc (nếu có)",
      },
    ],
    note: "Thời gian bảo hành được tính từ ngày khách hàng nhận sản phẩm.",
  },
  {
    number: "02",
    title: "Điều kiện bảo hành",
    intro:
      "Sản phẩm được bảo hành miễn phí khi đáp ứng đầy đủ các điều kiện sau:",
    items: [
      "Sản phẩm còn trong thời hạn bảo hành.",
      `Có hóa đơn mua hàng hoặc phiếu bảo hành của ${BRAND_NAME}.`,
      "Sản phẩm bị lỗi do kỹ thuật sản xuất hoặc lỗi vật liệu.",
      "Tem bảo hành trên sản phẩm còn nguyên vẹn, không bị rách, tẩy xóa.",
    ],
  },
  {
    number: "03",
    title: "Các trường hợp không bảo hành",
    intro: "Chúng tôi không áp dụng bảo hành trong các trường hợp sau:",
    items: [
      "Sản phẩm bị hư hỏng do sử dụng sai cách, tác động ngoại lực, va đập, trầy xước.",
      "Sản phẩm tiếp xúc với nước, hóa chất, nhiệt độ cao hoặc môi trường ẩm mốc.",
      `Tự ý sửa chữa, thay đổi kết cấu sản phẩm bởi bên không thuộc ${BRAND_NAME}.`,
      "Hết thời hạn bảo hành.",
    ],
  },
  {
    number: "04",
    title: "Hình thức bảo hành",
    intro: `Tùy theo tình trạng sản phẩm, ${BRAND_NAME} sẽ áp dụng một trong các hình thức sau:`,
    items: [
      "Sửa chữa miễn phí tại nhà hoặc tại xưởng.",
      "Thay thế linh kiện miễn phí (nếu có).",
      "Đổi sản phẩm mới tương đương (trong trường hợp lỗi nặng không thể sửa chữa).",
    ],
  },
  {
    number: "05",
    title: "Quy trình bảo hành",
    steps: [
      {
        icon: "fa-regular fa-user",
        title: "1. Tiếp nhận yêu cầu:",
        text: "Khách hàng liên hệ qua hotline hoặc form hỗ trợ.",
      },
      {
        icon: "fa-regular fa-clipboard",
        title: "2. Kiểm tra & xác nhận:",
        text: "Đội ngũ kỹ thuật kiểm tra và xác nhận tình trạng.",
      },
      {
        icon: "fa-solid fa-screwdriver-wrench",
        title: "3. Xử lý bảo hành:",
        text: "Tiến hành sửa chữa hoặc thay thế theo chính sách.",
      },
      {
        icon: "fa-solid fa-box-open",
        title: "4. Hoàn tất & bàn giao:",
        text: "Bàn giao sản phẩm và hướng dẫn sử dụng.",
      },
    ],
  },
  {
    number: "06",
    title: "Thông tin liên hệ bảo hành",
    intro: "Mọi yêu cầu bảo hành, vui lòng liên hệ:",
    contactLines: true,
    note: "Lưu ý: Chính sách bảo hành có thể được cập nhật theo thời điểm. Vui lòng liên hệ để được hỗ trợ thông tin mới nhất.",
  },
];
