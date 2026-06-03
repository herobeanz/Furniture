# Typography — Đồ Gỗ Hùng Cường

Nguồn sự thật trong code: `fe/src/style.css` (`:root` + media queries). Tài liệu này mô tả scale responsive dùng cho toàn site, ưu tiên trang nội dung dài (chính sách, hướng dẫn, blog).

## Breakpoints

| Tên | Viewport | Ghi chú |
|-----|----------|---------|
| Mobile | `0 – 767px` | `@media (max-width: 767px)` |
| Tablet | `768 – 1023px` | `@media (max-width: 1023px)` |
| Desktop | `1024px+` | Giá trị mặc định trên `:root` |

## Scale (Desktop → Tablet → Mobile)

| Vai trò | Desktop | Tablet | Mobile | CSS variable | Line height |
|---------|---------|--------|--------|--------------|-------------|
| Hero banner (Home) | 56px | 48px | 36px | `--fs-hero-title` | `--lh-hero` (1.2) |
| Tiêu đề trang (policy, about hero) | 48px | 40px | 32px | `--fs-page-title` | `--lh-h1` (1.2) |
| Tiêu đề section | 36px | 32px | 28px | `--fs-section-title` | `--lh-h2` (1.3) |
| Subtitle / block lớn | 28px | 24px | 22px | `--fs-subtitle` | `--lh-h3` (1.4) |
| Tiêu đề card | 22px | 20px | 18px | `--fs-card-title` | `--lh-h3` |
| Lead / intro | 18px | 17px | 16px | `--fs-body-lg` | `--lh-body` (1.6) |
| Body | 16px | 16px | 15px | `--fs-body` | `--lh-body` |
| Body phụ / UI nhỏ | 14px | 14px | 13px | `--fs-body-sm` | `--lh-body` |
| Caption / eyebrow | 12px | 12px | 12px | `--fs-caption` | `--lh-caption` (1.5) |
| Nút (`.btn`) | 16px | 15px | 14px | `--fs-button` | — |

Đơn vị trong CSS là `rem` (16px = 1rem) để tôn trọng zoom trình duyệt.

## Font family

| Vai trò | Token | Dùng cho |
|---------|-------|----------|
| Display | `--font-serif` (Playfair Display) | Hero, tiêu đề trang, tiêu đề section |
| UI / body | `--font-sans` (Segoe UI stack) | Body, card title, nav, form, eyebrow |

**Không** dùng serif cho tiêu đề bài viết / card sản phẩm (theo mockup).

## Utility classes

Áp dụng trực tiếp trong template (không cần scoped duplicate):

| Class | Mô tả |
|-------|--------|
| `.text-hero-title` | H1 banner trang chủ |
| `.text-page-title` | H1 trang nội dung |
| `.text-section-title` | H2 section |
| `.text-subtitle` | H3 / nhóm nội dung |
| `.text-card-title` | Tiêu đề card |
| `.text-body-lg` | Đoạn mở đầu, hero phụ |
| `.text-body` | Nội dung chính |
| `.text-body-sm` | List, meta, CTA phụ |
| `.text-caption` | Ghi chú, ngày đăng |
| `.eyebrow` | Label uppercase, primary |

Class legacy vẫn hoạt động: `.section-heading` (= `--fs-section-title`), `.section-desc` (= `--fs-body-sm`).

## Áp dụng theo loại trang

### Trang chủ
- Hero: `--fs-hero-title`
- Hero lead (`.hero-text`, `*-hero-text`): **cùng độ rộng cột** với title — không `max-width: 20rem` hẹp hơn; wrapper `*-hero-copy`
- Section: `.section-heading` / `--fs-section-title`
- Card sản phẩm / blog: `--fs-body-sm` – `--fs-card-title` tùy hierarchy

### Trang chính sách (`/chinh-sach-doi-tra`, `/chinh-sach-bao-hanh`)
- Hero H1: `--fs-page-title` (không dùng hero 56px)
- Lead hero: `--fs-body-lg`
- H2 điều khoản: `--fs-section-title`
- Nội dung card / list / bước: `--fs-body` (16px desktop)
- Ghi chú card: `--fs-body-sm` (tối thiểu 14px, **không** dùng 10–11px)
- Grid card: 2 cột từ `768px`, giữ 2 cột ở desktop (không 3 cột hẹp)

### Form / nav
- Body mặc định từ `body { font-size: var(--fs-body) }`
- Nút: `.btn` dùng `--fs-button`

## Khuyến nghị nội dung dài

- Đoạn chính sách, điều khoản: **≥ `--fs-body`** (16px desktop).
- `--fs-caption` (12px): chỉ eyebrow, ngày tháng, label ngắn — không cho đoạn văn dài.
- Khoảng cách section: `padding-top` ≥ `2rem` giữa khối điều khoản và CTA cuối.

## Migration

Toàn bộ `fe/src/**/*.vue` dùng `var(--fs-*)` thay cho cỡ chữ `rem`/`px` cố định (trừ số 404 decorative trên `NotFoundView`). Class dùng chung:

- `.page-hero-title` / `.page-hero-lead` — hero trang nội dung
- `.rich-html-content` — HTML từ editor (blog, CMS)
- `.eyebrow` — label uppercase (không duplicate trong scoped)

Khi thêm component mới, ưu tiên token hoặc utility `.text-*`, không hard-code `0.75rem`.

Xem thêm: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) (màu, layout, component).
