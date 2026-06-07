# Frontend (`fe/`)

Vue 3 + TypeScript + Vite — storefront public và admin panel.

## Tech stack

- **Vue 3** — Composition API (`<script setup>`)
- **TypeScript**
- **Vite** — dev server & build
- **Vue Router 4** — routing (public + `/admin`)
- **Pinia** — state (cache, auth, UI)
- **Axios** — HTTP client (`services/api/`)
- **TinyMCE** — rich text (admin blog/sản phẩm)
- **Chart.js** — biểu đồ dashboard admin
- **Swiper** — carousel trang chủ

UI: component tùy chỉnh trong `src/components/ui/` + design tokens (`src/style.css`). Xem [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md).

## Cấu trúc thư mục

```text
fe/
├── src/
│   ├── assets/
│   ├── components/       # Header, Footer, ProductCard, admin widgets, …
│   ├── composables/      # Logic tái sử dụng theo domain
│   ├── constants/        # BRAND_NAME, nav, static pages, contact
│   ├── layouts/          # MainLayout, AdminLayout, PreviewLayout
│   ├── router/           # Định nghĩa toàn bộ route
│   ├── services/api/     # products, categories, collections, blog, inquiries, …
│   ├── stores/           # Pinia stores
│   ├── utils/
│   ├── views/            # Trang public + admin
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── docs/                 # DESIGN_SYSTEM, TYPOGRAPHY
├── public/
└── vite.config.ts
```

## Setup

```bash
yarn install
cp .env.example .env
```

## Development

```bash
yarn dev
```

Mở `http://localhost:5173`. API dev: `fe/.env.development` → `VITE_API_BASE_URL=http://localhost:3000/api/v1`.

## Build & preview

```bash
yarn build
yarn preview
```

## Environment variables

| File | Mục đích |
|------|----------|
| `.env` | Brand, liên hệ, MXH (Facebook, Zalo, …) |
| `.env.development` | API/App URL local — tự load khi `yarn dev` |
| `.env.production.example` | Mẫu biến cho Vercel production |

Production (Vercel): set `VITE_API_BASE_URL`, `VITE_APP_URL` và các biến brand/liên hệ theo `.env.production.example`.

## Tính năng đã có

### Public

- Trang chủ (hero, sản phẩm nổi bật, bộ sưu tập, blog)
- Danh sách & lọc sản phẩm (`/san-pham`)
- Danh mục & chi tiết sản phẩm
- Bộ sưu tập (`/bo-suu-tap`)
- Blog / cẩm nang (`/blog`)
- Tìm kiếm (`/search`)
- Liên hệ & form inquiry (`/lien-he`)
- Trang chính sách, hướng dẫn mua hàng, về chúng tôi
- Preview nội dung cho admin (`*/preview`)

**Không có** wishlist hay giỏ hàng. Mua hàng qua form inquiry, Facebook, Zalo.

### Admin (`/admin`)

- Dashboard, sản phẩm, danh mục, bộ sưu tập, blog, inquiries
- Upload ảnh, rich text editor
- Đăng nhập JWT (`stores/adminAuth.ts`)

## Performance

Cache Pinia + `KeepAlive` cho navigation nhanh — chi tiết tại [../docs/performance-optimization.md](../docs/performance-optimization.md).

## Docs thiết kế

- [docs/README.md](./docs/README.md) — mục lục
- [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)
- [docs/TYPOGRAPHY.md](./docs/TYPOGRAPHY.md)
