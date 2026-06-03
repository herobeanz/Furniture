/** Trang Blog — nội dung tĩnh / nhãn danh mục */

export const BLOG_HERO_IMAGE =
  "https://res.cloudinary.com/dogohungcuong/image/upload/blog_wpmuz5.jpg";

export const BLOG_FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80";

/** Tab lọc — `id` rỗng = tất cả; khác rỗng so khớp `post.category` */
export const BLOG_FILTER_TABS = [
  { id: "", label: "Tất cả bài viết" },
  { id: "Xu hướng nội thất", label: "Xu hướng nội thất" },
  { id: "Kinh nghiệm chọn đồ gỗ", label: "Kinh nghiệm chọn đồ gỗ" },
  { id: "Không gian sống", label: "Không gian sống" },
  { id: "Phong cách thiết kế", label: "Phong cách thiết kế" },
];

export type BlogFilterTab = { id: string; label: string };

export const BLOG_PAGE_SIZE = 9;
