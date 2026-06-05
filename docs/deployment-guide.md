# Deployment Guide

## Tổng quan

Dự án deploy theo mô hình tách riêng:

- Frontend: Vercel
- Backend: Render (Web Service, cấu hình thủ công trên Dashboard)
- Database: Supabase PostgreSQL
- Upload assets: Cloudinary, nếu dùng tính năng upload

Backend là NestJS trong thư mục `be`. Không dùng Render Blueprint hay `render.yaml` — toàn bộ build/start command và biến môi trường khai báo trực tiếp trên service Render.

### Môi trường local vs production

| Thành phần | Development (local) | Production |
|------------|---------------------|------------|
| DB backend | PostgreSQL `localhost` (`be/.env`) | Supabase (`be/.env.production.example` → Render) |
| API frontend | `fe/.env.development` | Vercel env (`fe/.env.production.example`) |
| CORS backend | `http://localhost:5173` (`be/.env.development`) | `https://dogohungcuong.vercel.app` |

**Không** dùng chung Supabase cho dev và prod. Dev migrate/seed trên Postgres local; prod migrate trên Supabase qua Render build.

**Setup local lần đầu:**

```bash
# Backend
cd be && cp .env.example .env
# Sửa DATABASE_URL/DIRECT_URL trỏ Postgres local, rồi:
npm run prisma:migrate:dev
npm run start:dev

# Frontend
cd fe && cp .env.example .env
yarn dev
```

URL production backend (tham chiếu trong doc):

```text
https://backend-furniture-g98d.onrender.com
```

## 1. Chuẩn bị trước khi deploy

### 1.1 Kiểm tra code đã push lên GitHub

Repo cần có các file sau trên branch deploy:

- `be/package.json`
- `be/prisma/schema.prisma`
- `be/.env.example`

Cấu hình sẽ nhập trên Render Dashboard:

| Field | Giá trị |
|-------|---------|
| Root Directory | `be` |
| Build Command | `npm install && npm run prisma:generate && npm run prisma:migrate:deploy && npm run build` |
| Start Command | `npm run start:prod` (chạy `node dist/src/main.js`) |
| Health Check Path | `/health` |

### 1.2 Chuẩn bị Supabase connection strings

Trong Supabase Dashboard, lấy 2 connection strings:

#### `DATABASE_URL`

Dùng pooled connection cho runtime traffic:

```text
postgres://postgres.lsxtuwergkagsrmayghz:<password>@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

#### `DIRECT_URL`

Dùng **session pooler** (port `5432` trên host `*.pooler.supabase.com`) cho Prisma migrations trên Render. Không dùng `db.<project-ref>.supabase.co` — Render thường không reach được (lỗi P1001).

```text
postgres://postgres.lsxtuwergkagsrmayghz:<password>@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require
```

Tham chiếu mẫu: `be/.env.production.example`.

Không commit giá trị thật vào Git.

## 2. Deploy backend lên Render

### 2.1 Tạo Web Service

1. Mở [Render Dashboard](https://dashboard.render.com).
2. Chọn **New +** → **Web Service** (không chọn Blueprint).
3. Connect GitHub repository (ví dụ `herobeanz/Furniture`).
4. Chọn branch deploy, thường là `main`.
5. Điền cấu hình:
   - **Name:** `backend-furniture`
   - **Region:** theo nhu cầu (Free tier có sleep sau idle)
   - **Root Directory:** `be`
   - **Runtime:** Node
   - **Build Command:**
     ```bash
     npm install && npm run prisma:generate && npm run prisma:migrate:deploy && npm run build
     ```
   - **Start Command:**
     ```bash
     npm run start:prod
     ```
   - **Health Check Path:** `/health`
6. Chọn plan (Free hoặc paid) rồi **Create Web Service**.

### 2.2 Thêm Environment Variables

Trong Render service → **Environment**, set các biến sau.

Bắt buộc:

```text
NODE_ENV=production
FRONTEND_URL=https://dogohungcuong.vercel.app
DATABASE_URL=<supabase-transaction-pooler-port-6543-pgbouncer=true>
DIRECT_URL=<supabase-session-pooler-port-5432-on-pooler-host>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
```

Nếu dùng upload Cloudinary:

```text
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
CLOUDINARY_FOLDER=furniture
```

Render tự cung cấp `PORT`, không cần set thủ công.

### 2.3 Deploy và cập nhật

1. Bấm **Save** (nếu vừa thêm env) rồi **Manual Deploy → Deploy latest commit**.
2. Theo dõi log build trên commit mới nhất của branch deploy.
3. Log thành công phải có các bước:
   - `npm install`
   - `npm run prisma:generate`
   - `npm run prisma:migrate:deploy`
   - `npm run build`
   - `npm run start:prod`

### 2.4 Sửa service đã tạo nhầm cấu hình

Dùng mục này nếu log còn chạy `yarn install` / `yarn start` hoặc không tìm thấy `package.json`.

Vào service `backend-furniture` → **Settings**:

```text
Root Directory: be
Build Command: npm install && npm run prisma:generate && npm run prisma:migrate:deploy && npm run build
Start Command: npm run start:prod
Health Check Path: /health
```

**Save Changes** → **Manual Deploy → Deploy latest commit**.

Log đúng:

```text
Running build command 'npm install && npm run prisma:generate && npm run prisma:migrate:deploy && npm run build'
Running 'npm run start:prod'
```

Nếu start fail với `Cannot find module .../dist/main`, đổi Start Command thành `node dist/src/main.js` hoặc pull commit mới (`start:prod` đã trỏ đúng path).

Log sai (settings chưa đúng hoặc deploy nhầm service):

```text
Running build command 'yarn install'
Running 'yarn start'
Couldn't find a package.json file in "/opt/render/project/src"
```

## 3. Kiểm tra backend sau deploy

Health check:

```text
https://backend-furniture-g98d.onrender.com/health
```

Kết quả mong muốn:

```json
{
  "status": "ok",
  "database": "up"
}
```

API base URL cho frontend:

```text
https://backend-furniture-g98d.onrender.com/api/v1
```

## 4. Cấu hình frontend trên Vercel

Frontend Vite cần biến môi trường production:

```text
VITE_API_BASE_URL=https://backend-furniture-g98d.onrender.com/api/v1
VITE_SUPABASE_URL=https://lsxtuwergkagsrmayghz.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Tham chiếu đầy đủ: `fe/.env.production.example`. Nếu Vercel tự inject biến từ Supabase integration (prefix `dogohungcuong_` / `NEXT_PUBLIC_dogohungcuong_`), vẫn cần map sang tên `VITE_*` mà frontend đọc.

Các bước:

1. Mở Vercel Dashboard.
2. Chọn project frontend.
3. Vào **Settings** → **Environment Variables**.
4. Thêm hoặc sửa:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://backend-furniture-g98d.onrender.com/api/v1`
   - Environment: Production
   - Key: `VITE_SUPABASE_URL` → `https://lsxtuwergkagsrmayghz.supabase.co`
   - Key: `VITE_SUPABASE_ANON_KEY` → anon key từ Supabase Dashboard
   - Key: `VITE_SUPABASE_PUBLISHABLE_KEY` → publishable key (nếu dùng)
5. Bấm **Save**.
6. Redeploy frontend production.

Ghi chú Vercel: đặt **Root Directory** = `fe` và dùng `fe/vercel.json` (SPA rewrites).

## 5. Kiểm tra kết nối frontend-backend

Sau khi backend và frontend đều deploy:

1. Mở:

```text
https://dogohungcuong.vercel.app
```

2. Mở DevTools → Network.
3. Reload trang.
4. Kiểm tra request API phải gọi tới:

```text
https://backend-furniture-g98d.onrender.com/api/v1/...
```

Không được còn gọi:

```text
http://localhost:3000/api/v1
```

## 6. Lỗi thường gặp

### Frontend vẫn chưa có data

Nguyên nhân thường gặp:

- Chưa set `VITE_API_BASE_URL` trên Vercel Production.
- Set env rồi nhưng chưa redeploy frontend.
- Backend Render đang sleep, request đầu tiên chậm.
- Backend health check fail.
- CORS chưa đúng `FRONTEND_URL`.

Cách xử lý:

1. Kiểm tra `/health` backend.
2. Kiểm tra Vercel env `VITE_API_BASE_URL`.
3. Redeploy frontend.
4. Mở DevTools Network xem URL API thực tế.

### `Cannot find module .../dist/main` khi start

Nguyên nhân:

- Start command cũ là `node dist/main` nhưng Nest build ra `dist/src/main.js`.
- Hoặc **Root Directory** chưa là `be` (log hiện path `.../be/dist/main` từ repo root).

Cách sửa:

```text
Root Directory: be
Start Command: npm run start:prod
```

Hoặc trực tiếp: `node dist/src/main.js` (khi cwd là thư mục `be`).

### Render chạy `yarn install` hoặc `yarn start`

Nguyên nhân:

- Chưa set **Root Directory** là `be`.
- Build/start command đang dùng default của Render.
- Manual Deploy đang deploy nhầm service.

Cách sửa: xem mục [2.4](#24-sửa-service-đã-tạo-nhầm-cấu-hình).

### Render build fail ở Prisma migrate

Kiểm tra:

- `DATABASE_URL` đúng pooled URL port `6543`.
- `DIRECT_URL` đúng direct URL port `5432`.
- Supabase database password đúng.
- Migration SQL hợp lệ.

### CORS error

Kiểm tra Render env:

```text
FRONTEND_URL=https://dogohungcuong.vercel.app
```

Nếu có nhiều origin, phân tách bằng dấu phẩy:

```text
FRONTEND_URL=https://dogohungcuong.vercel.app,http://localhost:5173
```

## 7. Checklist deploy nhanh

Backend Render:

- [ ] Web Service đã connect GitHub (không dùng Blueprint)
- [ ] Service name là `backend-furniture`
- [ ] `Root Directory` là `be`
- [ ] Build command đúng (npm + prisma + build)
- [ ] Start command là `npm run start:prod`
- [ ] Health check path là `/health`
- [ ] Service URL là `https://backend-furniture-g98d.onrender.com`
- [ ] `DATABASE_URL` và `DIRECT_URL` đã set
- [ ] JWT secret đã set
- [ ] Cloudinary env đã set nếu dùng upload
- [ ] `/health` trả database `up`

Frontend Vercel:

- [ ] `VITE_API_BASE_URL` trỏ tới `https://backend-furniture-g98d.onrender.com/api/v1`
- [ ] `VITE_SUPABASE_URL=https://lsxtuwergkagsrmayghz.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` đã set (project `lsxtuwergkagsrmayghz`)
- [ ] `VITE_APP_URL=https://dogohungcuong.vercel.app`
- [ ] Redeploy production sau khi đổi env
- [ ] Network tab không còn gọi localhost

## 8. Bảo mật

- Không commit `.env` thật.
- Không paste secrets vào commit hoặc issue public.
- Nếu secrets từng bị lộ trong chat/log, rotate trong Supabase (DB password) / Cloudinary trước production.
