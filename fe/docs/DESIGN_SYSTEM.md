# Design System — Đồ Gỗ Hùng Cường

Nguồn sự thật: mockup HTML Tailwind (`font-serif` + palette amber/stone). Vue map qua CSS variables trong `fe/src/style.css`.

## Màu sắc

| Token | Giá trị | Tailwind tương đương |
|-------|---------|----------------------|
| `--color-primary` | `#92400e` | `amber-900` — CTA, giá, link, logo |
| `--color-primary-hover` | `#78350f` | `amber-950` — hover nút chính |
| `--color-primary-dark` | `#78350f` | `amber-900` — eyebrow, logo dòng 1 |
| `--color-star` | `#f59e0b` | `amber-500` — sao đánh giá |
| `--color-hero-bg` | `#f7f4f0` | `bg-[#f7f4f0]` |
| `--color-page-bg` | `#f9fafb` | `bg-gray-50` |
| `--color-bg-alt` | `#fcfbfa` | section đánh giá |
| `--color-footer-bg` | `#1c1917` | `stone-900` |
| `--color-heading` | `#111827` | `text-gray-900` |
| `--color-text` | `#374151` | `text-gray-700` nav |
| `--color-text-muted` | `#6b7280` | `text-gray-600` |
| `--color-text-light` | `#9ca3af` | `text-gray-400` / `text-gray-500` |

## Icon (Font Awesome)

| Token | Size | Dùng cho |
|-------|------|----------|
| `--icon-size-xs` | 12px | Mũi tên “Xem tất cả”, nút tròn sản phẩm |
| `--icon-size-sm` | 16px | Chevron menu, sao đánh giá, pillar Giới thiệu, liên hệ footer |
| `--icon-size-md` | 20px | Value bar hero, icon header, social footer (= `text-xl`) |
| `--icon-size-lg` | 24px | Card giá trị cốt lõi (= `text-2xl` nhỏ hơn một bậc) |
| `--icon-size-xl` | 28px | Stats Giới thiệu (= `text-2xl` mockup) |

## Typography

| Vai trò | Font | Size | Weight | Ghi chú |
|---------|------|------|--------|---------|
| Body | Segoe UI | 16px base | 400 | `body`, form, nav |
| Tiêu đề section | Playfair Display | **1.5rem** (`text-2xl`) | 600 | class `.section-heading` |
| Hero H1 | Playfair Display | clamp 2rem–3rem | 600 | lớn hơn section |
| Eyebrow | Segoe UI | 0.75rem | 600 | uppercase, `tracking-widest`, primary |
| Card title / giá | Segoe UI | 0.75rem–0.875rem | 700 / 600 | **không** dùng serif |
| Link phụ | Segoe UI | 0.75rem | 600 | primary, mũi tên 10px |

## Layout

- Container: `max-width: 1280px`, padding `1.5rem` (mobile `1rem`)
- Section dọc: `py-16` (4rem) desktop, `py-12` mobile
- Bo góc card: `0.5rem` (`rounded`)
- Shadow card nhẹ: `shadow-sm` + `border border-gray-100`

## Patterns section (class dùng chung)

| Class | Mô tả |
|-------|--------|
| `.section-shell` | `padding: 4rem 0` |
| `.section-shell--muted` | Nền `#fcfbfa` + viền trên/dưới |
| `.section-shell--white` | Nền trắng |
| `.section-heading` | Tiêu đề serif 1.5rem, `#111827` |
| `.section-heading--center` | Căn giữa + `margin-bottom: 2.5rem` |
| `.section-header-row` | Flex: title trái, link phải |
| `.section-link` | "Xem tất cả …" + icon mũi tên |
| `.section-desc` | Mô tả phụ 0.75rem, gray, căn giữa |

## Component theo mockup

### Khách hàng nói về chúng tôi
- Tiêu đề **căn giữa**
- Grid **3 cột** (1 cột mobile), không carousel trượt ngang
- Card: sao amber → quote italic → avatar **trái** + tên/địa điểm
- Dots: `8px`, active `#92400e`, inactive `#d1d5db`
- Phân trang 3 review/trang nếu > 3 mục

### Bài viết nổi bật
- Header row: tiêu đề serif trái, link phải
- Grid 3 cột, gap `1.5rem`
- Ảnh `h-48`, bo góc `0.5rem`
- Ngày: `11px`, gray-400
- Tiêu đề bài: **sans-serif** `14px` bold, hover primary

### Sản phẩm bán chạy
- Giống blog: header row + grid 4 cột card viền nhạt

### Bộ sưu tập nổi bật
- Tiêu đề + mô tả **căn giữa**
- Bento 7/5

## Trang Liên hệ (`/page/lien-he`)

| Token | Giá trị |
|-------|---------|
| Nền trang | `#faf9f6` |
| Hero | `#f5f2eb` |
| Info bar | card trắng 4 cột, icon `text-md` |

Layout: hero 5/7 + bar thông tin, form + map 6/6, banner showroom 5/7.

## Trang Giới thiệu (`/page/gioi-thieu`)

| Token | Giá trị |
|-------|---------|
| Nền trang | `#faf9f6` |
| Hero | `#f5f2eb` |
| Section story / process | nền trắng |
| Stats | `#fcfbfa` + viền (giống reviews) |

Layout: hero 5/7, story ảnh trái 5/7 chữ phải, values 4 card, process 5 cột, stats 4 cột icon + số.

## Không dùng

- Carousel trượt full-width cho đánh giá (chỉ đổi trang bằng dots)
- Daily Flash Sale / countdown
- Tiêu đề bài viết bằng serif
