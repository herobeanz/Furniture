# Backend (`be/`)

NestJS REST API cho storefront public và admin panel.

## Tech stack

- NestJS 11, TypeScript
- Prisma ORM + PostgreSQL
- JWT (Passport) — chỉ admin
- Cloudinary — upload ảnh
- Swagger (nếu bật trong dev)

## Modules

| Module | Mô tả |
|--------|--------|
| `auth` | Login admin, profile, đổi mật khẩu |
| `products` | CRUD sản phẩm, list public, related |
| `categories` | CRUD danh mục, cây danh mục, sản phẩm theo slug |
| `collections` | Bộ sưu tập (M2M products) |
| `blog` | Bài viết cẩm nang |
| `inquiries` | Lead khách (form / sản phẩm) |
| `reports` | Thống kê dashboard |
| `uploads` | Upload Cloudinary |
| `health` | `GET /health` |

**Không có** module wishlist, cart, hay CMS pages động (trang chính sách static ở frontend).

## Database

Schema: `prisma/schema.prisma`

Entities chính: `Admin`, `Category`, `Product`, `ProductImage`, `Collection`, `CollectionProduct`, `Inquiry`, `BlogPost`.

## Chạy dev

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run start:dev
```

## Scripts hữu ích

| Lệnh | Mô tả |
|------|--------|
| `npm run start:dev` | Dev server (watch) |
| `npm run prisma:migrate` | Migration dev |
| `npm run prisma:migrate:deploy` | Migration production |
| `npm run prisma:seed` | Seed dữ liệu mẫu |
| `npm run build` | Build → `dist/` |

## Environment variables

| File | Mục đích |
|------|----------|
| `.env` | DB local, JWT, Cloudinary (gitignore) |
| `.env.development` | PORT, CORS, `NODE_ENV` dev |
| `.env.production.example` | Mẫu biến Supabase cho Render |

```bash
cp .env.example .env
```

Production: copy từ `.env.production.example` lên Render Dashboard (không commit secrets).

Deploy chi tiết: [docs/deployment-guide.md](../docs/deployment-guide.md)
