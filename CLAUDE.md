# Furniture

## Project Overview

Website trưng bày nội thất (public) + admin panel. Khách xem sản phẩm, bộ sưu tập, blog và liên hệ mua hàng qua form / Facebook / Zalo. **Không có wishlist, giỏ hàng, hay đăng ký khách.**

Monorepo: `fe/` (Vue 3) + `be/` (NestJS + Prisma + PostgreSQL).

## Tech Stack

- **Frontend:** Vue 3, TypeScript, Vite, Vue Router, Pinia, Axios — thư mục `fe/`
- **Backend:** NestJS, Prisma, PostgreSQL, JWT (admin only) — thư mục `be/`
- **Deploy:** Vercel (FE), Render (BE), Supabase (DB), Cloudinary (upload)

## Important Notes

- Thư mục frontend là `fe/`, backend là `be/` (không phải `frontend/` / `backend/`).
- Brand name: import `BRAND_NAME` từ `fe/src/constants/brand.ts`, không hard-code.
- API client: `fe/src/services/api/`; mọi gọi API qua layer service.
- Admin routes: `/admin/*`, guard JWT; public không cần auth.
- Prisma schema: `be/prisma/schema.prisma` — chạy migration khi đổi schema.
- Dev: `cd be && npm run start:dev` · `cd fe && yarn dev`

## Documentation

- [README.md](./README.md) — tổng quan dự án
- [fe/README.md](./fe/README.md) — frontend
- [be/README.md](./be/README.md) — backend
- [docs/deployment-guide.md](./docs/deployment-guide.md) — deploy
- [fe/docs/DESIGN_SYSTEM.md](./fe/docs/DESIGN_SYSTEM.md) — UI tokens
