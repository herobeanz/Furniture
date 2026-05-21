/** Bỏ dấu tiếng Việt (đ/Đ → d). */
function removeVietnameseDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Tạo slug URL-friendly từ chuỗi (thường là tên sản phẩm).
 * - Bỏ dấu tiếng Việt
 * - lowercase
 * - Khoảng trắng → "-"
 * - Loại ký tự đặc biệt (chỉ a-z, 0-9, -)
 * - Không có "--"
 */
export function slugify(text: string): string {
  if (!text?.trim()) return '';

  return removeVietnameseDiacritics(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
