# 🚀 Setup Guide - Phase 0

Hướng dẫn setup môi trường phát triển cho dự án Furniture E-commerce.

---

## Yêu cầu hệ thống

- **Node.js**: v18+ 
- **Yarn**: v1.22+ (hoặc npm)
- **Docker**: v20+ (khuyến nghị)
- **Docker Compose**: v2+ (khuyến nghị)
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

### Docker (khuyến nghị)

```bash
# Kiểm tra Docker
docker --version
docker-compose --version
```

---

## Bước 3: Setup Database với Docker

```bash
# Start PostgreSQL và Redis
docker-compose up -d

# Kiểm tra containers đang chạy
docker-compose ps

# Xem logs
docker-compose logs -f
```

**Database Connection:**
- PostgreSQL: `localhost:5432`
- Username: `furniture_user`
- Password: `furniture_password`
- Database: `furniture_db`

**Redis Connection:**
- Redis: `localhost:6379`

---

## Bước 4: Setup Backend

```bash
cd backend

# Cài đặt dependencies
yarn install

# Copy file .env.example thành .env
# Windows PowerShell:
Copy-Item .env.example .env

# Linux/Mac:
# cp .env.example .env

# Chỉnh sửa .env với thông tin phù hợp
# (Database URL đã được cấu hình sẵn cho Docker)

# Chạy Prisma migration (tạo bảng trong PostgreSQL)
yarn prisma:generate
yarn prisma:migrate

# Chạy development server
yarn start:dev
```

Backend sẽ chạy tại: `http://localhost:3000`

---

## Bước 5: Setup Frontend

```bash
cd frontend

# Cài đặt dependencies
yarn install

# Copy file .env.example thành .env
# Windows PowerShell:
Copy-Item .env.example .env

# Linux/Mac:
# cp .env.example .env

# Chỉnh sửa .env với thông tin phù hợp
# (API URL đã được cấu hình sẵn)

# Chạy development server
yarn dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## Bước 6: Kiểm tra

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3000/health
   # Hoặc mở browser: http://localhost:3000
   ```

2. **Frontend:**
   - Mở browser: `http://localhost:5173`
   - Kiểm tra console không có lỗi

3. **Database:**
   ```bash
   # Kết nối PostgreSQL
   docker exec -it furniture_postgres psql -U furniture_user -d furniture_db
   
   # Kiểm tra tables
   \dt
   ```

---

## Cấu trúc thư mục

```
Furniture/
├── backend/          # NestJS Backend
│   ├── src/
│   ├── .env
│   └── package.json
├── frontend/         # Vue 3 + Vite Frontend
│   ├── src/
│   ├── .env
│   └── package.json
├── docker-compose.yml
├── .gitignore
├── README.md
├── IMPLEMENTATION.md
└── DATABASE_SCHEMA.md
```

---

## Troubleshooting

### Docker containers không start

```bash
# Kiểm tra ports đã được sử dụng chưa
netstat -ano | findstr :5432  # Windows
lsof -i :5432                  # Mac/Linux

# Xóa containers và volumes cũ
docker-compose down -v

# Start lại
docker-compose up -d
```

### Backend không kết nối được database

- Kiểm tra Docker containers đang chạy: `docker-compose ps`
- Kiểm tra `.env` file có đúng DATABASE_URL không
- Kiểm tra logs: `docker-compose logs postgres`

### Frontend không kết nối được API

- Kiểm tra Backend đang chạy tại `http://localhost:3000`
- Kiểm tra `.env` file có đúng `VITE_API_BASE_URL` không
- Kiểm tra CORS settings trong Backend

---

## Next Steps

Sau khi setup xong Phase 0, tiếp tục với:
- **Phase 1**: Backend Foundation
- **Phase 2**: Frontend Foundation

Xem chi tiết trong `IMPLEMENTATION.md`

---

## Lệnh hữu ích

```bash
# Docker
docker-compose up -d          # Start services
docker-compose down           # Stop services
docker-compose logs -f        # View logs
docker-compose ps             # Check status

# Backend
cd backend
yarn start:dev               # Development mode
yarn build                   # Build production
yarn start:prod              # Production mode

# Frontend
cd frontend
yarn dev                     # Development mode
yarn build                   # Build production
yarn preview                 # Preview production build
```

---

**Chúc bạn setup thành công! 🎉**
