# Furniture — Website trưng bày & tiếp nhận khách hàng tiềm năng

Website bán nội thất **public** kết hợp **admin panel** để quản lý nội dung. Khách không cần đăng ký; mua hàng qua **liên hệ trực tiếp** (form, Facebook, Zalo).

> Không có wishlist · Không có giỏ hàng · Không có thanh toán online cho khách

---

## Tổng quan

| Thành phần | Mô tả |
|------------|--------|
| **Public site** | Trưng bày sản phẩm, bộ sưu tập, blog; tìm kiếm & lọc; gửi yêu cầu tư vấn |
| **Admin** | Đăng nhập JWT; quản lý sản phẩm, danh mục, bộ sưu tập, blog, lead |
| **Mô hình kinh doanh** | Lead-based ordering — giá tham khảo, chốt đơn qua kênh liên hệ |

**Định hướng:** public-first, SEO-first, module-based backend, frontend tách biệt (`fe/` + `be/`).

---

## Tech stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | Vue 3, TypeScript, Vite, Vue Router 4, Pinia, Axios |
| Backend | NestJS, Prisma, PostgreSQL |
| Upload | Cloudinary (admin) |
| Deploy | Vercel (FE) · Render (BE) · Supabase (DB) |

Chi tiết deploy: [docs/deployment-guide.md](./docs/deployment-guide.md)

---

## Tính năng hiện có

### Trang public

| Trang | Route |
|-------|-------|
| Trang chủ | `/` |
| Sản phẩm (tất cả) | `/san-pham` |
| Danh mục sản phẩm | `/san-pham/:categorySlug` |
| Chi tiết sản phẩm | `/san-pham/:categorySlug/:productSlug` |
| Bộ sưu tập | `/bo-suu-tap`, `/bo-suu-tap/:slug` |
| Cẩm nang / Blog | `/blog`, `/blog/:slug` |
| Tìm kiếm | `/search` |
| Về chúng tôi | `/ve-chung-toi` |
| Liên hệ | `/lien-he` |
| Hướng dẫn mua hàng | `/huong-dan-mua-hang` |
| Chính sách (bảo hành, đổi trả, vận chuyển, …) | `/chinh-sach-*`, `/privacy-policy`, `/terms`, … |

**Luồng mua hàng:** khách xem sản phẩm → gửi inquiry (form sản phẩm / trang liên hệ) hoặc chat **Facebook / Zalo** (link cấu hình qua env).

**Preview:** admin xem trước nội dung chưa publish qua route `*/preview`.

### Admin (`/admin`)

- Dashboard & báo cáo
- Sản phẩm & danh mục (CRUD, sắp xếp, upload ảnh)
- Bộ sưu tập (gán sản phẩm, thứ tự)
- Blog (TinyMCE)
- Quản lý inquiry / lead
- Tài khoản admin (đổi mật khẩu, thông tin)

Đăng nhập admin: `/admin/login` (JWT, không dùng cho khách).

---

## Cấu trúc monorepo

```text
Furniture/
├── fe/                 # Vue 3 frontend
│   ├── src/
│   │   ├── components/   # UI & section components
│   │   ├── composables/  # useProductData, useHomeData, …
│   │   ├── constants/    # brand, nav, static pages
│   │   ├── layouts/      # MainLayout, AdminLayout, PreviewLayout
│   │   ├── router/
│   │   ├── services/api/ # gọi REST backend
│   │   ├── stores/       # Pinia (cache, auth, toast)
│   │   ├── views/        # public + admin pages
│   │   └── style.css     # design tokens
│   └── docs/             # DESIGN_SYSTEM, TYPOGRAPHY
├── be/                 # NestJS API
│   ├── prisma/           # schema, migrations, seed
│   └── src/
│       ├── auth/
│       ├── products/
│       ├── categories/
│       ├── collections/
│       ├── blog/
│       ├── inquiries/
│       ├── reports/
│       ├── uploads/
│       ├── health/
│       └── shared/
└── docs/               # deployment, performance, changelog
```

---

## Backend modules & API

REST API, prefix `/api/v1`, JSON.

| Module | Vai trò |
|--------|---------|
| `products` | Danh sách, chi tiết, related, CRUD admin |
| `categories` | Cây danh mục, sản phẩm theo danh mục |
| `collections` | Bộ sưu tập curated (M2M với sản phẩm) |
| `blog` | Bài viết cẩm nang |
| `inquiries` | Lead từ form / sản phẩm (public create, admin quản lý) |
| `auth` | Đăng nhập admin JWT |
| `reports` | Thống kê dashboard |
| `uploads` | Upload ảnh Cloudinary |
| `health` | Health check (`/health`) |

### Database (PostgreSQL / Prisma)

- `admins`
- `categories` → `products` → `product_images`
- `collections` ↔ `collection_products`
- `inquiries`
- `blog_posts`

---

## Frontend state (Pinia)

| Store | Mục đích |
|-------|----------|
| `categoryTree` | Cache cây danh mục |
| `productsCache` | Cache list / detail / related |
| `collectionsCache` | Cache bộ sưu tập |
| `blogCache` | Cache blog |
| `adminAuth` | Token & session admin |
| `routerLoading` | Spinner chuyển trang |
| `toast` | Thông báo UI |

Performance: stale-while-revalidate, `KeepAlive` trên view public — xem [docs/performance-optimization.md](./docs/performance-optimization.md).

---

## Chạy local

### Backend

```bash
cd be
cp .env.example .env
# Chỉnh DATABASE_URL trỏ Postgres local
npm install
npm run prisma:migrate
npm run start:dev
```

API mặc định: `http://localhost:3000`

### Frontend

```bash
cd fe
cp .env.example .env
yarn install
yarn dev
```

App mặc định: `http://localhost:5173` (`VITE_API_BASE_URL` trong `.env.development`).

---

## Tài liệu liên quan

| File | Nội dung |
|------|----------|
| [fe/README.md](./fe/README.md) | Hướng dẫn frontend |
| [be/README.md](./be/README.md) | Hướng dẫn backend |
| [fe/docs/DESIGN_SYSTEM.md](./fe/docs/DESIGN_SYSTEM.md) | Design tokens & pattern UI |
| [docs/deployment-guide.md](./docs/deployment-guide.md) | Deploy Vercel + Render + Supabase |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md) | Lịch sử thay đổi đáng chú ý |

---

## Roadmap (chưa triển khai)

- Tài khoản khách hàng
- Thanh toán online
- Giỏ hàng / wishlist (nếu chuyển sang e-commerce đầy đủ)
- CRM automation, gợi ý sản phẩm
