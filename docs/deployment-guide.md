# Deployment Guide

## Tổng quan

Dự án deploy theo mô hình tách riêng:

- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL
- Upload assets: Cloudinary, nếu dùng tính năng upload

Backend đã có `render.yaml` ở repo root. Render Blueprint sẽ đọc file này để build và chạy service NestJS trong thư mục `be`.

## 1. Chuẩn bị trước khi deploy

### 1.1 Kiểm tra code đã push lên GitHub

Repo cần có các file sau trên branch deploy:

- `render.yaml`
- `be/package.json`
- `be/prisma/schema.prisma`
- `be/.env.example`

Backend build command trên Render:

```bash
npm ci && npm run prisma:generate && npm run prisma:migrate:deploy && npm run build
```

Start command:

```bash
npm run start:prod
```

Health check path:

```text
/health
```

### 1.2 Chuẩn bị Supabase connection strings

Trong Supabase Dashboard, lấy 2 connection strings:

#### `DATABASE_URL`

Dùng pooled connection cho runtime traffic:

```text
postgres://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

#### `DIRECT_URL`

Dùng direct/non-pooling connection cho Prisma migrations:

```text
postgres://postgres.<project-ref>:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require
```

Không commit giá trị thật vào Git.

## 2. Deploy backend lên Render

### 2.1 Tạo Render Blueprint

1. Mở Render Dashboard.
2. Chọn **New +**.
3. Chọn **Blueprint**.
4. Connect GitHub repository:
   - `herobeanz/Furniture`
5. Chọn branch deploy, thường là `main`.
6. Render sẽ tự đọc `render.yaml`.
7. Xác nhận service backend:
   - Name: `furniture-backend`
   - Type: `web`
   - Runtime: `node`
   - Root directory: `be`

### 2.2 Thêm Environment Variables trên Render

Trong Render service, vào **Environment** và set các biến sau.

Bắt buộc:

```text
NODE_ENV=production
FRONTEND_URL=https://dogohungcuong.vercel.app
DATABASE_URL=<supabase-pooled-url-port-6543>
DIRECT_URL=<supabase-direct-url-port-5432>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
SUPABASE_URL=<supabase-project-url>
SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
SUPABASE_JWT_SECRET=<supabase-jwt-secret>
SUPABASE_PUBLISHABLE_KEY=<supabase-publishable-key>
SUPABASE_SECRET_KEY=<supabase-secret-key>
```

Nếu dùng upload Cloudinary:

```text
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
CLOUDINARY_FOLDER=furniture
```

Render tự cung cấp `PORT`, không cần set thủ công.

### 2.3 Deploy

1. Bấm **Apply** hoặc **Deploy latest commit**.
2. Theo dõi log build.
3. Đảm bảo các bước sau chạy thành công:
   - `npm ci`
   - `npm run prisma:generate`
   - `npm run prisma:migrate:deploy`
   - `npm run build`
   - `npm run start:prod`

## 3. Kiểm tra backend sau deploy

Giả sử Render URL là:

```text
https://furniture-backend.onrender.com
```

Mở health check:

```text
https://furniture-backend.onrender.com/health
```

Kết quả mong muốn:

```json
{
  "status": "ok",
  "database": "up"
}
```

Nếu Redis không được cấu hình, health có thể là `degraded` nhưng database vẫn phải là `up`.

API base URL cho frontend:

```text
https://furniture-backend.onrender.com/api/v1
```

## 4. Cấu hình frontend trên Vercel

Frontend Vite cần biến môi trường production:

```text
VITE_API_BASE_URL=https://furniture-backend.onrender.com/api/v1
```

Các bước:

1. Mở Vercel Dashboard.
2. Chọn project frontend.
3. Vào **Settings** → **Environment Variables**.
4. Thêm hoặc sửa:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://furniture-backend.onrender.com/api/v1`
   - Environment: Production
5. Bấm **Save**.
6. Redeploy frontend production.

Nếu dùng Supabase public client ở frontend, set thêm:

```text
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_SUPABASE_PUBLISHABLE_KEY=<supabase-publishable-key>
VITE_APP_URL=https://dogohungcuong.vercel.app
```

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
https://furniture-backend.onrender.com/api/v1/...
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

- [ ] GitHub repo đã có `render.yaml`
- [ ] Render Blueprint đã connect repo
- [ ] `DATABASE_URL` đã set
- [ ] `DIRECT_URL` đã set
- [ ] JWT/Supabase secrets đã set
- [ ] Cloudinary env đã set nếu dùng upload
- [ ] `/health` trả database `up`

Frontend Vercel:

- [ ] `VITE_API_BASE_URL` trỏ tới Render `/api/v1`
- [ ] `VITE_APP_URL=https://dogohungcuong.vercel.app`
- [ ] Redeploy production sau khi đổi env
- [ ] Network tab không còn gọi localhost

## 8. Bảo mật

- Không commit `.env` thật.
- Không paste secrets vào commit hoặc issue public.
- Nếu secrets từng bị lộ trong chat/log, rotate trong Supabase/Cloudinary trước production.
- `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng backend, không set ở frontend.
