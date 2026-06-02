# 🪑 Furniture E-commerce System – Full Architecture (Public Website)

> Tài liệu mô tả **đầy đủ kiến trúc Backend & Frontend** cho website bán nội thất **public**.
> ❌ Không đăng ký / đăng nhập
> 🌐 Tất cả người dùng internet đều truy cập được
> ❤️ Có wishlist – 🛒 có giỏ hàng – 💬 mua qua Facebook / Zalo / liên hệ

---

## 1. Tổng quan hệ thống

* Mô hình: **Public Furniture Showcase & Lead-based Ordering**
* Mục tiêu:

  * Trưng bày sản phẩm nội thất
  * Cho phép khách lưu wishlist & giỏ hàng
  * Chuyển đổi mua hàng bằng **liên hệ trực tiếp**

Định hướng kiến trúc:

* **Public-first**
* **SEO-first**
* **Module-based backend**
* **Frontend tách biệt, dễ mở rộng sang e-commerce đầy đủ**

---

## 2. User scope

### Public user

* Không cần tài khoản
* Có thể:

  * Xem / tìm / lọc sản phẩm
  * Lưu wishlist
  * Thêm giỏ hàng
  * Gửi yêu cầu mua hàng (lead)

Lưu trạng thái bằng:

* localStorage
* cookie
* anonymousId

---

## 3. Functional Overview

* Trang chủ
* Danh mục & tìm kiếm
* Trang chi tiết sản phẩm
* Wishlist
* Giỏ hàng
* Liên hệ mua hàng (Messenger / Zalo / Form)
* Admin quản lý nội dung & lead

---

# 🧱 PHẦN A – FRONTEND ARCHITECTURE

## A1. Tổng quan Frontend

* Framework: **VueJS 3 + Vite**
* Ngôn ngữ: **TypeScript**
* Routing: **Vue Router 4**
* State Management: **Pinia**
* UI: **Shadcn UI (Vue)** (sẽ setup sau)
* Mục tiêu:

  * SPA với Vue Router
  * UX mượt, load nhanh
  * Quản lý state rõ ràng với Pinia

---

## A2. Cấu trúc thư mục Frontend

```text
frontend/
 ├── src/
 │    ├── assets/           # ảnh, font, global css
 │    ├── components/       # UI components (Button, Card...)
 │    ├── views/            # page components
 │    │    ├── HomeView.vue
 │    │    ├── CategoryView.vue
 │    │    ├── ProductView.vue
 │    │    ├── WishlistView.vue
 │    │    ├── CartView.vue
 │    │    └── ContactView.vue
 │    ├── layouts/          # layout chính (DefaultLayout)
 │    ├── composables/      # logic dùng chung (useCart, useWishlist)
 │    ├── stores/           # Pinia stores
 │    ├── services/         # gọi API backend
 │    ├── utils/            # helper frontend
 │    ├── types/            # TypeScript types
 │    ├── router/           # Vue Router configuration
 │    ├── App.vue           # root component
 │    └── main.ts           # entry point
 ├── public/                # static files
 └── vite.config.ts         # Vite configuration
```

---

## A3. State Management (Pinia)

### useCartStore

* items[]
* addItem()
* removeItem()
* updateQuantity()
* persist localStorage

### useWishlistStore

* items[]
* toggleWishlist()
* persist localStorage

---

## A4. Frontend Data Flow

```text
User Action
   ↓
Vue Component
   ↓
Pinia Store (state)
   ↓
Composable / Service
   ↓
Backend API
```

---

## A5. SEO & Performance

* Dynamic meta tags (vue-meta hoặc @vueuse/head)
* OpenGraph tags
* Lazy load images
* Code splitting với dynamic imports
* CDN assets

---

# 🧱 PHẦN B – BACKEND ARCHITECTURE

## B1. Tổng quan Backend

* Framework: **NestJS**
* Ngôn ngữ: **TypeScript**
* Kiến trúc: **Module-based**
* Vai trò:

  * Cung cấp dữ liệu sản phẩm
  * Lưu lead / inquiry
  * CMS nội dung

---

## B2. Cấu trúc thư mục Backend

```text
backend/
 └── src/
      ├── modules/
      │    ├── product/
      │    ├── category/
      │    ├── wishlist/
      │    ├── cart/
      │    ├── inquiry/      # lead mua hàng
      │    ├── promotion/
      │    ├── inventory/
      │    ├── cms/
      │    └── tracking/
      │
      ├── shared/
      │    ├── constants/
      │    ├── enums/
      │    ├── dto/
      │    ├── interfaces/
      │    ├── types/
      │    ├── utils/
      │    ├── exceptions/
      │    ├── guards/
      │    ├── decorators/
      │    ├── interceptors/
      │    ├── middlewares/
      │    ├── pipes/
      │    └── base/
      │
      ├── database/
      └── main.ts
```

---

## B3. Nguyên tắc Module Backend

Mỗi module gồm:

* controller
* service
* repository
* dto
* entity

❌ Không gọi chéo DB giữa các module
✅ Giao tiếp qua service hoặc event

---

## B4. Shared Layer – Vai trò

* Dùng chung cho nhiều module
* Không chứa business logic
* Chuẩn hoá:

  * response format
  * error handling
  * pagination

---

## B5. Backend Data Flow

```text
HTTP Request
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

---

## B6. Database Overview

* PostgreSQL:

  * product
  * category
  * inquiry (lead)
  * cms

---

# 🔗 FRONTEND ↔ BACKEND INTERACTION

## API Communication

* REST API
* JSON
* Versioning: /api/v1

Frontend gọi:

* product listing
* product detail
* inquiry submit

---

# ⚠️ Critical Edge Cases

* Người dùng xoá cookie → mất cart & wishlist
* Giá chỉ mang tính tham khảo
* Custom sản phẩm → báo giá sau
* Spam form liên hệ

---

# 🚀 Roadmap mở rộng

* Bật đăng nhập / tài khoản
* Thanh toán online
* CRM automation
* Recommendation system

---

📌 Tài liệu này dùng làm **README.md / ARCHITECTURE.md** cho dự án.
