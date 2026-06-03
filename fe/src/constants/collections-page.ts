/** Trang /bo-suu-tap — nội dung tĩnh */

export const COLLECTIONS_HERO_IMAGE =
  "https://res.cloudinary.com/dogohungcuong/image/upload/collection_x2bimg.jpg";

export const COLLECTIONS_FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80";

export const COLLECTIONS_PAGE_SIZE = 9;

export type CollectionSortKey = "newest" | "popular" | "products-asc";

export const COLLECTION_SORT_OPTIONS: {
  value: CollectionSortKey;
  label: string;
}[] = [
  { value: "newest", label: "Sắp xếp: Mới nhất" },
  { value: "popular", label: "Sắp xếp: Xem nhiều nhất" },
  { value: "products-asc", label: "Sắp xếp: Sản phẩm tăng dần" },
];
