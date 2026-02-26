# 🚀 Furniture E-commerce System – Implementation Plan

> Tài liệu mô tả **các giai đoạn triển khai** và **hướng dẫn setup đầy đủ** cho hệ thống website bán nội thất.

---

## 📋 Mục lục

1. [Tổng quan các giai đoạn](#tổng-quan-các-giai-đoạn)
2. [Giai đoạn 0: Setup môi trường & Infrastructure](#giai-đoạn-0-setup-môi-trường--infrastructure)
3. [Giai đoạn 1: Backend Foundation](#giai-đoạn-1-backend-foundation)
4. [Giai đoạn 2: Frontend Foundation](#giai-đoạn-2-frontend-foundation)
5. [Giai đoạn 3: Core Features – Product & Category](#giai-đoạn-3-core-features--product--category)
6. [Giai đoạn 4: User Features – Cart & Wishlist](#giai-đoạn-4-user-features--cart--wishlist)
7. [Giai đoạn 5: Inquiry & Contact System](#giai-đoạn-5-inquiry--contact-system)
8. [Giai đoạn 6: Admin Panel & CMS](#giai-đoạn-6-admin-panel--cms)
9. [Giai đoạn 7: SEO, Performance & Optimization](#giai-đoạn-7-seo-performance--optimization)
10. [Giai đoạn 8: Testing & Deployment](#giai-đoạn-8-testing--deployment)
11. [Checklist tổng hợp](#checklist-tổng-hợp)

---

## Tổng quan các giai đoạn

| Giai đoạn | Tên | Thời gian ước tính | Mức độ ưu tiên |
|-----------|-----|-------------------|----------------|
| **0** | Setup môi trường & Infrastructure | 1-2 ngày | 🔴 Critical |
| **1** | Backend Foundation | 3-5 ngày | 🔴 Critical |
| **2** | Frontend Foundation | 3-5 ngày | 🔴 Critical |
| **3** | Core Features – Product & Category | 5-7 ngày | 🔴 Critical |
| **4** | User Features – Cart & Wishlist | 4-6 ngày | 🟡 High |
| **5** | Inquiry & Contact System | 3-4 ngày | 🟡 High |
| **6** | Admin Panel & CMS | 5-7 ngày | 🟢 Medium |
| **7** | SEO, Performance & Optimization | 3-5 ngày | 🟢 Medium |
| **8** | Testing & Deployment | 4-6 ngày | 🔴 Critical |

**Tổng thời gian ước tính: 30-47 ngày làm việc**

---

## Giai đoạn 0: Setup môi trường & Infrastructure

### Mục tiêu
- Chuẩn bị môi trường phát triển
- Setup database và các service cần thiết
- Cấu hình CI/CD cơ bản

### Công việc chi tiết

#### 0.1. Cài đặt công cụ phát triển

**Node.js & Package Managers**
```bash
# Cài đặt Node.js (v18+)
# Cài đặt Yarn
npm install -g yarn
```

**Database**
```bash
# PostgreSQL (v14+) - cài đặt local
# Redis (v7+) - cài đặt local (optional cho cache)
```

#### 0.2. Khởi tạo dự án

**Backend (NestJS)**
```bash
npm i -g @nestjs/cli
nest new backend
cd backend
yarn install
```

**Frontend (Vue 3 + Vite)**
```bash
yarn create vite frontend --template vue-ts
cd frontend
yarn install
yarn add vue-router@4 pinia axios
```

#### 0.3. Cấu hình Git & Repository

```bash
# .gitignore cho cả 2 project
# Setup branch strategy (main, develop, feature/*)
# Setup pre-commit hooks (husky, lint-staged)
```

#### 0.4. Database Schema Design

**PostgreSQL Tables:**
- `categories` (id, name, slug, description, image_url, parent_id, order, created_at, updated_at)
- `products` (id, name, slug, description, price, compare_price, sku, category_id, images[], status, created_at, updated_at)
- `inquiries` (id, name, phone, email, message, product_ids[], status, created_at, updated_at)
- `cms_pages` (id, slug, title, content, meta_title, meta_description, created_at, updated_at)

**Redis Keys:**
- `cache:product:*` - Cache sản phẩm
- `cache:category:*` - Cache danh mục
- `rate_limit:*` - Rate limiting

#### 0.5. Environment Variables

**Backend `.env`**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/furniture_db
REDIS_URL=redis://localhost:6379

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3001

# JWT (nếu cần cho admin)
JWT_SECRET=your-secret-key

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**Frontend `.env`**
```env
# API
VITE_API_BASE_URL=http://localhost:3000/api/v1

# App
VITE_APP_NAME=Đồ gỗ Hùng Cường
VITE_APP_URL=http://localhost:5173

# Social Links
VITE_FACEBOOK_URL=https://facebook.com/...
VITE_ZALO_URL=https://zalo.me/...
```

### Checklist

- [ ] Node.js v18+ đã cài đặt
- [ ] PostgreSQL & Redis đã chạy
- [ ] Backend project đã khởi tạo
- [ ] Frontend project đã khởi tạo
- [ ] Git repository đã setup
- [ ] Database schema đã thiết kế
- [ ] Environment variables đã cấu hình
---

## Giai đoạn 1: Backend Foundation

### Mục tiêu
- Setup NestJS với cấu trúc module-based
- Kết nối database (PostgreSQL + TypeORM/Prisma)
- Setup Redis cho cache
- Tạo shared layer (response, error handling, validation)

### Công việc chi tiết

#### 1.1. Setup Database Connection
```bash
yarn add prisma @prisma/client
npx prisma init
npx prisma migrate dev
```

#### 1.2. Tạo Shared Layer

**Response Interceptor**
```typescript
// src/shared/interceptors/transform.interceptor.ts
// Standardize API response: { success, data, message, timestamp }
```

**Exception Filters**
```typescript
// src/shared/exceptions/http-exception.filter.ts
// Handle và format errors
```

**Validation Pipes**
```typescript
// src/shared/pipes/validation.pipe.ts
// Dùng class-validator
```

**Pagination DTO**
```typescript
// src/shared/dto/pagination.dto.ts
// page, limit, sort, order
```

#### 1.3. Setup Redis Module

```typescript
// src/shared/modules/redis.module.ts
// Cache service wrapper
```

#### 1.4. CORS & Security

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

#### 1.5. Health Check Endpoint

```typescript
// GET /health
// Kiểm tra DB, Redis connection
```

### Checklist

- [ ] Database connection đã hoạt động
- [ ] TypeORM/Prisma đã setup
- [ ] Shared interceptors đã tạo
- [ ] Exception filters đã tạo
- [ ] Validation pipes đã tạo
- [ ] Redis module đã setup
- [ ] CORS đã cấu hình
- [ ] Health check endpoint đã tạo
- [ ] Unit tests cho shared layer

---

## Giai đoạn 2: Frontend Foundation

### Mục tiêu
- Setup Vue 3 + Vite với TypeScript
- Cấu hình Vue Router
- Setup Pinia stores
- Tạo layout và routing cơ bản
- Setup API service layer

### Công việc chi tiết

#### 2.1. Vite + Vue 3 Configuration

**vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

**main.ts**
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

#### 2.2. Setup Shadcn UI (Vue)

```bash
# Cài đặt shadcn-vue hoặc tương đương
yarn add shadcn-vue
# Hoặc tự build components từ shadcn/ui
```

**Components cần tạo:**
- Button
- Card
- Input
- Select
- Dialog/Modal
- Badge
- Skeleton

#### 2.2. Vue Router Setup

**router/index.ts**
```typescript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/category/:slug', component: () => import('../views/CategoryView.vue') },
  { path: '/product/:slug', component: () => import('../views/ProductView.vue') },
  { path: '/wishlist', component: () => import('../views/WishlistView.vue') },
  { path: '/cart', component: () => import('../views/CartView.vue') },
  { path: '/contact', component: () => import('../views/ContactView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

#### 2.3. Pinia Stores Setup

**stores/cart.ts**
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  function addItem(item: CartItem) {
    // Implementation
  }
  
  function saveToLocalStorage() {
    localStorage.setItem('furniture-cart', JSON.stringify(items.value))
  }
  
  return { items, totalItems, addItem }
})
```

**stores/wishlist.store.ts**
```typescript
// Tương tự cart store
```

**stores/tracking.store.ts**
```typescript
// anonymousId, pageView tracking
```

#### 2.4. API Service Layer

**services/api.client.ts**
```typescript
// Axios instance với interceptors
// Base URL, error handling
```

**services/product.service.ts**
```typescript
export const productService = {
  getProducts(params: ProductQueryParams): Promise<ProductListResponse> {},
  getProduct(slug: string): Promise<Product> {},
};
```

**services/category.service.ts**
```typescript
export const categoryService = {
  getCategories(): Promise<Category[]> {},
  getCategory(slug: string): Promise<Category> {},
};
```

#### 2.5. Composables

**composables/useCart.ts**
```typescript
export const useCart = () => {
  const cartStore = useCartStore();
  // Wrapper functions
};
```

**composables/useWishlist.ts**
```typescript
// Tương tự
```

#### 2.6. Views & Components Structure

**Cấu trúc thư mục:**
```
src/
├── assets/          # Images, fonts, CSS
├── components/      # Reusable components
├── views/           # Page components
│   ├── HomeView.vue
│   ├── CategoryView.vue
│   ├── ProductView.vue
│   ├── WishlistView.vue
│   ├── CartView.vue
│   └── ContactView.vue
├── layouts/         # Layout components
│   └── DefaultLayout.vue
├── stores/          # Pinia stores
├── services/        # API services
├── composables/     # Composable functions
├── utils/           # Utility functions
├── types/           # TypeScript types
└── router/           # Vue Router config
```

**layouts/DefaultLayout.vue**
- Header với navigation
- Footer
- Router-view cho content

**views/HomeView.vue**
- Trang chủ placeholder

**views/CategoryView.vue**
- Dynamic route cho category

**views/ProductView.vue**
- Dynamic route cho product detail

### Checklist

- [ ] Vue 3 + Vite đã cấu hình
- [ ] TypeScript đã setup
- [ ] Vue Router đã setup
- [ ] Pinia stores đã setup
- [ ] API service layer đã tạo
- [ ] Composables đã tạo
- [ ] Layouts đã tạo
- [ ] Views đã tạo
- [ ] Routing cơ bản đã setup
- [ ] Error handling đã implement

---

## Giai đoạn 3: Core Features – Product & Category

### Mục tiêu
- Hoàn thiện module Product & Category ở Backend
- Tích hợp Frontend với API
- Hiển thị danh sách sản phẩm, danh mục
- Trang chi tiết sản phẩm

### Công việc chi tiết

#### 3.1. Backend – Product Module

**Entity**
```typescript
// src/modules/product/entities/product.entity.ts
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column('decimal', { nullable: true })
  comparePrice: number;

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => Category)
  category: Category;

  @Column({ default: 'active' })
  status: string;
}
```

**DTOs**
```typescript
// CreateProductDto, UpdateProductDto, ProductQueryDto
```

**Service**
```typescript
// ProductService với methods:
// - findAll(query: ProductQueryDto)
// - findOne(slug: string)
// - create(dto: CreateProductDto)
// - update(id: string, dto: UpdateProductDto)
// - delete(id: string)
```

**Controller**
```typescript
// GET /api/v1/products
// GET /api/v1/products/:slug
// POST /api/v1/products (admin)
// PATCH /api/v1/products/:id (admin)
// DELETE /api/v1/products/:id (admin)
```

**Repository**
```typescript
// Custom queries: search, filter, pagination
```

#### 3.2. Backend – Category Module

**Tương tự Product Module:**
- Entity với parent_id (nested categories)
- DTOs, Service, Controller, Repository

**Endpoints:**
```typescript
// GET /api/v1/categories
// GET /api/v1/categories/:slug
// GET /api/v1/categories/:slug/products
```

#### 3.3. Frontend – Product Listing

**pages/index.vue**
- Hero section
- Featured products
- Categories grid

**pages/category/[slug].vue**
- Category info
- Product grid với filters (price, sort)
- Pagination

**components/ProductCard.vue**
- Product image, name, price
- Add to cart button
- Wishlist icon

**components/ProductGrid.vue**
- Grid layout với ProductCard

#### 3.4. Frontend – Product Detail

**pages/product/[slug].vue**
- Product images gallery
- Product info (name, price, description)
- Add to cart form
- Related products

**components/ProductGallery.vue**
- Image carousel/lightbox

**components/ProductInfo.vue**
- Product details, specs

#### 3.5. Search & Filter

**components/SearchBar.vue**
- Search input với debounce

**components/ProductFilters.vue**
- Price range
- Category filter
- Sort options

### Checklist

- [x] Product entity & migration đã tạo
- [x] Category entity & migration đã tạo
- [x] Product module backend đã hoàn thiện
- [x] Category module backend đã hoàn thiện
- [x] API endpoints đã test
- [x] Frontend product listing đã implement (CategoryView + ProductGrid, sort, pagination)
- [x] Frontend product detail đã implement (ProductView: gallery, info, add-to-cart, related)
- [x] Search & filter đã hoạt động (sort trên trang danh mục)
- [ ] Image upload/display đã setup (admin phase)
- [x] Pagination đã implement

---

## Giai đoạn 4: User Features – Cart & Wishlist

### Mục tiêu
- Implement Cart & Wishlist ở Frontend
- Persist data vào localStorage
- Sync với Backend (optional, cho analytics)

### Công việc chi tiết

#### 4.1. Cart Store Enhancement

**stores/cart.store.ts**
```typescript
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  actions: {
    addItem(product: Product, quantity: number) {
      // Check if exists, update quantity or add new
    },
    removeItem(productId: string) {},
    updateQuantity(productId: string, quantity: number) {},
    clearCart() {},
    // Sync với backend (optional)
    async syncToBackend() {},
  },
  persist: {
    storage: persistedState.localStorage,
    key: 'furniture-cart',
  },
});
```

#### 4.2. Wishlist Store Enhancement

**stores/wishlist.store.ts**
```typescript
// Tương tự cart store
// Toggle wishlist item
// Check if product is in wishlist
```

#### 4.3. Cart Page

**pages/cart.vue**
- List cart items
- Update quantity
- Remove items
- Total calculation
- Checkout button (redirect to contact/inquiry)

**components/CartItem.vue**
- Product image, name, price
- Quantity selector
- Remove button

#### 4.4. Wishlist Page

**pages/wishlist.vue**
- Grid of wishlist products
- Remove from wishlist
- Add to cart from wishlist

#### 4.5. Cart & Wishlist Icons (Header)

**components/Header.vue**
- Cart icon với badge (total items)
- Wishlist icon với badge
- Click để navigate

#### 4.6. Backend – Cart/Wishlist Tracking (Optional)

**Module tracking (analytics only)**
- Lưu anonymousId
- Track cart events (add, remove, checkout)
- Không lưu cart state ở server

### Checklist

- [x] Cart store đã hoàn thiện
- [x] Wishlist store đã hoàn thiện
- [x] localStorage persistence đã hoạt động
- [x] Cart page đã implement (CartItem.vue, list, qty, remove, tổng, nút Thanh toán → /contact)
- [x] Wishlist page đã implement (grid, xóa, Thêm vào giỏ, Xem sản phẩm)
- [x] Cart/Wishlist icons trong header (DefaultLayout, badge count)
- [x] Add to cart từ product page
- [x] Add to wishlist từ product page
- [x] Update quantity trong cart
- [x] Remove items đã hoạt động
- [x] Total calculation đã chính xác

---

## Giai đoạn 5: Inquiry & Contact System

### Mục tiêu
- Tạo form liên hệ/inquiry
- Lưu lead vào database
- Tích hợp Facebook Messenger / Zalo
- Email notification (optional)

### Công việc chi tiết

#### 5.1. Backend – Inquiry Module

**Entity**
```typescript
// src/modules/inquiry/entities/inquiry.entity.ts
@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column('text')
  message: string;

  @Column('simple-array', { nullable: true })
  productIds: string[];

  @Column({ default: 'pending' })
  status: string; // pending, contacted, completed

  @Column({ nullable: true })
  anonymousId: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

**DTOs**
```typescript
// CreateInquiryDto
// InquiryQueryDto (cho admin)
```

**Service**
```typescript
// create(dto: CreateInquiryDto)
// findAll(query: InquiryQueryDto) // admin
// updateStatus(id: string, status: string) // admin
```

**Controller**
```typescript
// POST /api/v1/inquiries
// GET /api/v1/inquiries (admin)
// PATCH /api/v1/inquiries/:id/status (admin)
```

#### 5.2. Frontend – Contact/Inquiry Form

**pages/contact.vue**
- Form fields: name, phone, email, message
- Product selection (từ cart hoặc manual)
- Submit button
- Success/error messages

**components/InquiryForm.vue**
- Reusable form component
- Validation
- Loading state

#### 5.3. Integration với Cart

**Khi click "Checkout" từ cart:**
- Pre-fill inquiry form với cart items
- Show cart summary
- Submit inquiry với productIds

#### 5.4. Social Media Integration

**components/SocialButtons.vue**
- Facebook Messenger button
- Zalo button
- Link đến contact form

**Cấu hình:**
```typescript
// .env
VITE_FACEBOOK_URL=https://facebook.com/...
VITE_ZALO_URL=https://zalo.me/...
```

#### 5.5. Email Notification (Optional)

**Backend service:**
```typescript
// src/shared/services/email.service.ts
// Send email khi có inquiry mới
// Dùng Nodemailer hoặc SendGrid
```

### Checklist

- [x] Inquiry entity & migration đã tạo (Prisma model Inquiry)
- [x] Inquiry module backend đã hoàn thiện (DTO, service, controller POST /inquiries)
- [x] API endpoint POST /inquiries đã test
- [x] Contact form đã implement (gọi API, validation, loading/success/error)
- [x] Form validation đã hoạt động (backend class-validator)
- [x] Integration với cart đã làm (from=cart → hiển thị tóm tắt giỏ, gửi productIds + source)
- [x] Social media buttons đã tích hợp (Facebook Messenger, Zalo qua VITE_FACEBOOK_URL, VITE_ZALO_URL)
- [ ] Email notification (optional) đã setup
- [ ] Rate limiting cho inquiry endpoint
- [ ] Spam protection (captcha optional)

---

## Giai đoạn 6: Admin Panel & CMS

### Mục tiêu
- Tạo admin panel để quản lý sản phẩm, danh mục
- Quản lý inquiries/leads
- CMS cho static pages

### Công việc chi tiết

#### 6.1. Backend – Auth Module (Admin only)

**JWT Authentication**
```typescript
// src/modules/auth/
// Login endpoint
// JWT guard
// Admin role guard
```

**Endpoints:**
```typescript
// POST /api/v1/auth/login
// GET /api/v1/auth/me
```

#### 6.2. Backend – CMS Module

**Entity**
```typescript
// src/modules/cms/entities/cms-page.entity.ts
@Entity('cms_pages')
export class CmsPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column('text', { nullable: true })
  metaDescription: string;
}
```

**Endpoints:**
```typescript
// GET /api/v1/cms/:slug (public)
// CRUD endpoints (admin)
```

#### 6.3. Frontend – Admin Pages

**pages/admin/login.vue**
- Login form

**pages/admin/dashboard.vue**
- Overview stats
- Recent inquiries
- Quick actions

**pages/admin/products/index.vue**
- Product list với CRUD
- Bulk actions

**pages/admin/products/[id].vue**
- Product form (create/edit)
- Image upload

**pages/admin/categories/index.vue**
- Category tree
- CRUD operations

**pages/admin/inquiries/index.vue**
- Inquiry list
- Filter by status
- Update status
- View details

**pages/admin/cms/index.vue**
- CMS pages list
- Editor (markdown hoặc rich text)

#### 6.4. Admin Layout

**layouts/admin.vue**
- Sidebar navigation
- Header với user info
- Protected routes

**Middleware:**
```typescript
// middleware/admin.ts
// Check authentication
```

### Checklist

- [x] Auth module backend đã tạo (JWT, login, me, JwtAuthGuard)
- [x] JWT authentication đã hoạt động
- [x] Admin guards đã implement (JwtAuthGuard trên admin endpoints)
- [x] CMS module backend đã tạo (GET page/:slug public, CRUD admin)
- [x] Admin login page đã implement
- [x] Admin dashboard đã tạo (stats, recent inquiries)
- [x] Product management đã hoàn thiện (list, create, edit, delete)
- [x] Category management đã hoàn thiện (list, add/edit modal, delete)
- [x] Inquiry management đã hoàn thiện (list, filter, update status)
- [x] CMS editor đã implement (list, form create/edit)
- [ ] Image upload đã hoạt động (admin dùng URL ảnh)
- [x] Admin routes protection đã setup (router guard, token)

---

## Giai đoạn 7: SEO, Performance & Optimization

### Mục tiêu
- Tối ưu SEO (meta tags, sitemap, robots.txt)
- Cải thiện performance (lazy load, caching)
- Optimize images
- CDN setup (optional)

### Công việc chi tiết

#### 7.1. SEO Optimization

**Vue Meta/Head Management**
```bash
yarn add @vueuse/head
# hoặc
yarn add vue-meta
```

**Dynamic Meta Tags**
```typescript
// views/ProductView.vue
import { useHead } from '@vueuse/head'

useHead({
  title: product.value.name,
  meta: [
    { name: 'description', content: product.value.description },
    { property: 'og:title', content: product.value.name },
    { property: 'og:image', content: product.value.images[0] },
  ],
})
```

**Sitemap Generation**
```typescript
// utils/sitemap.ts
// Generate sitemap từ products, categories
// Có thể dùng thư viện như sitemap-generator hoặc tự build
```

**robots.txt**
```text
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

#### 7.2. Performance Optimization

**Image Optimization**
```typescript
// Vite Image Optimization
// Sử dụng vite-plugin-imagemin hoặc tự optimize
yarn add -D vite-plugin-imagemin
// Lazy load images với loading="lazy"
// WebP format với picture element
// Responsive images với srcset
```

**Code Splitting**
```typescript
// Dynamic imports cho routes (đã có trong router)
// Dynamic imports cho components
const ProductCard = defineAsyncComponent(() => 
  import('@/components/ProductCard.vue')
)
```

**Caching Strategy**
- Backend: Redis cache cho products, categories
- Frontend: Service worker (optional)

#### 7.3. Backend Caching

**Cache Service**
```typescript
// src/shared/services/cache.service.ts
// Cache products, categories
// TTL: 1 hour
// Invalidate on update
```

**Cache Decorator**
```typescript
// @Cacheable('product', 3600)
// @CacheEvict('product')
```

#### 7.4. Frontend Performance

**Lazy Loading**
- Images với loading="lazy"
- Components với defineAsyncComponent
- Routes với dynamic imports (đã có trong router)

**Bundle Optimization**
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router', 'pinia'],
        utils: ['axios'],
      },
    },
  },
}
// Analyze bundle với vite-bundle-visualizer
yarn add -D vite-bundle-visualizer
```

#### 7.5. Analytics & Tracking

**Google Analytics / Plausible**
```typescript
// composables/useAnalytics.ts
// Track page views, events
```

**Custom Tracking**
```typescript
// Track: product views, cart adds, wishlist adds, inquiries
```

### Checklist

- [ ] SEO meta tags đã setup
- [ ] Sitemap đã generate
- [ ] robots.txt đã tạo
- [ ] OpenGraph tags đã implement
- [ ] Image optimization đã setup
- [ ] Lazy loading đã implement
- [ ] Backend caching đã hoạt động
- [ ] Frontend bundle đã optimize
- [ ] Analytics đã tích hợp
- [ ] Performance testing đã pass (Lighthouse)

---

## Giai đoạn 8: Testing & Deployment

### Mục tiêu
- Viết tests (unit, integration, e2e)
- Setup CI/CD
- Deploy lên production
- Monitoring & logging

### Công việc chi tiết

#### 8.1. Backend Testing

**Unit Tests**
```typescript
// *.spec.ts files
// Test services, repositories
// Jest hoặc Vitest
```

**Integration Tests**
```typescript
// Test API endpoints
// Test database operations
```

**Test Coverage**
```bash
# Aim for 70%+ coverage
```

#### 8.2. Frontend Testing

**Component Tests**
```typescript
// Vitest + Vue Test Utils
// Test components, composables
```

**E2E Tests**
```typescript
// Playwright hoặc Cypress
// Test user flows:
// - Browse products
// - Add to cart
// - Submit inquiry
```

#### 8.3. CI/CD Pipeline

**GitHub Actions / GitLab CI**
```yaml
# .github/workflows/ci.yml
# - Lint
# - Type check
# - Run tests
# - Build
# - Deploy (staging/production)
```

#### 8.4. Deployment

**Backend Deployment**
- Chạy local hoặc VPS (Node.js, env vars, database migration)

**Frontend Deployment**
- Build: `yarn build` (output: `dist/`), serve static từ `dist/`

**Database**
- PostgreSQL (local hoặc managed service)

**Redis**
- Redis (local hoặc managed service, optional)

#### 8.5. Monitoring & Logging

**Backend Logging**
```typescript
// Winston hoặc Pino
// Log levels: error, warn, info, debug
```

**Error Tracking**
- Sentry hoặc tương đương

**Uptime Monitoring**
- UptimeRobot, Pingdom

**Performance Monitoring**
- New Relic, Datadog (optional)

#### 8.6. Security Checklist

- [ ] Environment variables không commit vào Git
- [ ] CORS đã cấu hình đúng
- [ ] Rate limiting đã setup
- [ ] Input validation đã implement
- [ ] SQL injection protection (ORM)
- [ ] XSS protection
- [ ] HTTPS đã enable
- [ ] Security headers đã setup

### Checklist

- [ ] Backend unit tests đã viết
- [ ] Backend integration tests đã viết
- [ ] Frontend component tests đã viết
- [ ] E2E tests đã viết
- [ ] CI/CD pipeline đã setup
- [ ] Backend đã deploy
- [ ] Frontend đã deploy
- [ ] Database migration đã chạy
- [ ] Environment variables đã cấu hình
- [ ] Monitoring đã setup
- [ ] Logging đã hoạt động
- [ ] Security checklist đã pass
- [ ] Documentation đã cập nhật

---

## Checklist tổng hợp

### Pre-launch Checklist

**Backend**
- [ ] Tất cả modules đã hoàn thiện
- [ ] API documentation đã viết (Swagger optional)
- [ ] Database migrations đã chạy
- [ ] Environment variables đã cấu hình
- [ ] Error handling đã hoàn thiện
- [ ] Logging đã setup
- [ ] Tests đã pass
- [ ] Performance đã optimize

**Frontend**
- [ ] Tất cả pages đã implement
- [ ] Responsive design đã test
- [ ] Cross-browser testing đã pass
- [ ] SEO đã optimize
- [ ] Performance đã optimize
- [ ] Analytics đã tích hợp
- [ ] Error boundaries đã setup
- [ ] Loading states đã implement

**Infrastructure**
- [ ] Domain đã setup
- [ ] SSL certificate đã cài
- [ ] CDN đã cấu hình (optional)
- [ ] Backup strategy đã có
- [ ] Monitoring đã setup
- [ ] Uptime monitoring đã có

**Content**
- [ ] Sample products đã thêm
- [ ] Categories đã setup
- [ ] CMS pages đã tạo (About, Privacy, Terms)
- [ ] Images đã optimize

**Testing**
- [ ] User flows đã test
- [ ] Edge cases đã test
- [ ] Performance testing đã pass
- [ ] Security testing đã pass

---

## 📚 Tài liệu tham khảo

### Tech Stack Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vite.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Best Practices
- REST API Design
- SEO Best Practices
- Performance Optimization
- Security Best Practices

---

## 🎯 Kết luận

Tài liệu này cung cấp roadmap chi tiết để triển khai hệ thống Furniture E-commerce từ đầu đến cuối. Mỗi giai đoạn có thể điều chỉnh theo nhu cầu và timeline thực tế của dự án.

**Lưu ý:**
- Ưu tiên các giai đoạn Critical trước
- Test thường xuyên trong quá trình phát triển
- Code review trước khi merge
- Document code và API
- Backup database thường xuyên

**Chúc bạn triển khai thành công! 🚀**
