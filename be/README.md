# Backend (NestJS + Prisma)

API cho Furniture Admin và storefront.

- Chạy dev: `npm run start:dev`
- Migrate: `npm run prisma:migrate`
- Deploy: xem [docs/deployment-guide.md](../docs/deployment-guide.md)

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
