/** Trang danh sách tất cả sản phẩm /san-pham */

export const PRODUCTS_PAGE_SIZE = 12;

export const PRODUCTS_HERO_IMAGE =
  "https://res.cloudinary.com/dogohungcuong/image/upload/product_vmml5i.jpg";

export type ProductsPageSortKey = "newest" | "price-asc" | "price-desc";

export const PRODUCTS_PAGE_SORT_OPTIONS: {
  value: ProductsPageSortKey;
  label: string;
}[] = [
  { value: "newest", label: "Sắp xếp: Mới nhất" },
  { value: "price-asc", label: "Sắp xếp: Giá từ thấp đến cao" },
  { value: "price-desc", label: "Sắp xếp: Giá từ cao đến thấp" },
];

/** Icon strip / category hero — slug khớp category trong admin (slugify tên). */
const CATEGORY_STRIP_ICONS: Record<string, string> = {
  sofa: "fa-couch",
  giuong: "fa-bed",
  "tu-quan-ao": "fa-door-open",
  "ke-tivi": "fa-tv",
  "tu-bep": "fa-kitchen-set",
  "ban-phan": "fa-palette",
};

export function categoryStripIcon(slug: string): string {
  return CATEGORY_STRIP_ICONS[slug] ?? "fa-box";
}

export function productsSortToApi(sortKey: ProductsPageSortKey): {
  sort: string;
  order: "asc" | "desc";
} {
  switch (sortKey) {
    case "price-asc":
      return { sort: "price", order: "asc" };
    case "price-desc":
      return { sort: "price", order: "desc" };
    default:
      return { sort: "createdAt", order: "desc" };
  }
}
