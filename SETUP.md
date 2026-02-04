# 🚀 Setup Guide - Phase 0

Hướng dẫn setup môi trường phát triển cho dự án Furniture E-commerce (chạy local).

---

## Yêu cầu hệ thống

- **Node.js**: v18+
- **Yarn**: v1.22+ (hoặc npm)
- **PostgreSQL**: v14+ (cài đặt local)
- **Redis**: v7+ (cài đặt local, optional cho cache)
- **Git**: v2.30+

---

## Bước 1: Clone repository

```bash
git clone <repository-url>
cd Furniture
```

---

## Bước 2: Cài đặt công cụ

### Node.js & Yarn

```bash
# Kiểm tra Node.js version
node --version  # Cần >= 18

# Cài đặt Yarn (nếu chưa có)
npm install -g yarn
```

### PostgreSQL (local)

- **Windows:** tải installer từ [postgresql.org](https://www.postgresql.org/download/windows/) hoặc dùng [PostgreSQL portable](https://www.enterprisedb.com/download-postgresql-binaries).
- **macOS:** `brew install postgresql@14` rồi `brew services start postgresql@14`.
- **Linux:** `sudo apt install postgresql postgresql-contrib` (Ubuntu/Debian) hoặc tương đương.

Tạo database và user (trong `psql` hoặc pgAdmin):

```sql
CREATE USER furniture_user WITH PASSWORD 'furniture_password';
CREATE DATABASE furniture_db OWNER furniture_user;
```

**Kết nối mặc định:** `localhost:5432`, user `furniture_user`, database `furniture_db`. Chỉnh trong `.env` nếu bạn dùng user/password/port khác.

### Redis (optional – dùng sau cho cache)

- **Windows:** [Redis for Windows](https://github.com/microsoftarchive/redis/releases) hoặc WSL.
- **macOS:** `brew install redis` → `brew services start redis`.
- **Linux:** `sudo apt install redis-server`.

Mặc định Redis: `localhost:6379`. Có thể bỏ qua nếu chưa dùng cache.

---

## Bước 3: Setup Backend

```bash
cd backend

# Cài đặt dependencies
yarn install

# Copy file .env.example thành .env
# Windows PowerShell:
Copy-Item .env.example .env

# Linux/Mac:
# cp .env.example .env

# Chỉnh .env: DATABASE_URL đúng với PostgreSQL local của bạn
# Ví dụ: postgresql://furniture_user:furniture_password@localhost:5432/furniture_db

# Chạy Prisma migration (tạo bảng trong PostgreSQL)
yarn prisma:generate
yarn prisma:migrate

# (Optional) Seed dữ liệu test
yarn prisma:seed

# Chạy development server
yarn start:dev
```

Backend chạy tại: `http://localhost:3000`

---

## Bước 4: Setup Frontend

```bash
cd frontend

# Cài đặt dependencies
yarn install

# Copy file .env.example thành .env
# Windows PowerShell:
Copy-Item .env.example .env

# Linux/Mac:
# cp .env.example .env

# Chỉnh .env nếu cần (VITE_API_BASE_URL trỏ tới backend)

# Chạy development server
yarn dev
```

Frontend chạy tại: `http://localhost:5173`

---

## Bước 5: Kiểm tra

1. **Backend**
   - Mở: `http://localhost:3000` (hoặc endpoint health nếu có).
   - Kiểm tra không lỗi kết nối database.

2. **Frontend**
   - Mở: `http://localhost:5173`
   - Kiểm tra console không lỗi, API gọi được.

3. **Database**
   - Dùng pgAdmin, DBeaver hoặc `psql -U furniture_user -d furniture_db` để xem bảng đã được tạo (sau khi chạy `yarn prisma:migrate`).

---

## Cấu trúc thư mục

```
Furniture/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env
│   └── package.json
├── .gitignore
├── README.md
├── IMPLEMENTATION.md
├── DATABASE_SCHEMA.md
├── SETUP.md
└── PHASE0_COMPLETE.md
```

---

## Troubleshooting

### Backend không kết nối được database

- Kiểm tra PostgreSQL đã chạy (service / process).
- Kiểm tra `.env`: `DATABASE_URL` đúng user, password, port, tên database.
- Thử kết nối bằng `psql` hoặc pgAdmin với cùng thông tin.

### Frontend không gọi được API

- Kiểm tra backend đang chạy tại `http://localhost:3000`.
- Kiểm tra `.env` frontend: `VITE_API_BASE_URL` trỏ đúng backend.
- Kiểm tra CORS trên backend cho phép origin frontend.

### Lỗi migration Prisma

- Đảm bảo database đã tạo và user có quyền.
- Chạy lại: `yarn prisma:generate` rồi `yarn prisma:migrate`.

---

## Next Steps

Sau khi setup xong Phase 0, tiếp tục với:

- **Phase 1**: Backend Foundation
- **Phase 2**: Frontend Foundation

Chi tiết trong `IMPLEMENTATION.md`.

---

**Chúc bạn setup thành công.**
