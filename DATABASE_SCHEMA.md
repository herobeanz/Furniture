# 📊 Database Schema Design

> Tài liệu mô tả schema database cho hệ thống Furniture E-commerce

---

## Tổng quan

- **Database**: PostgreSQL 14+
- **ORM**: TypeORM (hoặc Prisma)
- **Cache**: Redis 7+

---

## Tables

### 1. Categories

Bảng lưu trữ danh mục sản phẩm (hỗ trợ nested categories).

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_order ON categories(order_index);
```

**Fields:**
- `id`: UUID primary key
- `name`: Tên danh mục
- `slug`: URL-friendly name (unique)
- `description`: Mô tả danh mục
- `image_url`: URL ảnh danh mục
- `parent_id`: ID danh mục cha (null nếu là root category)
- `order_index`: Thứ tự hiển thị
- `is_active`: Trạng thái active/inactive
- `created_at`, `updated_at`: Timestamps

---

### 2. Products

Bảng lưu trữ thông tin sản phẩm.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  sku VARCHAR(100) UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[], -- Array of image URLs
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, draft
  stock_quantity INTEGER DEFAULT 0,
  weight DECIMAL(8, 2),
  dimensions VARCHAR(100), -- e.g., "100x50x80 cm"
  material VARCHAR(255),
  color VARCHAR(100),
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_price ON products(price);
```

**Fields:**
- `id`: UUID primary key
- `name`: Tên sản phẩm
- `slug`: URL-friendly name (unique)
- `description`: Mô tả chi tiết
- `short_description`: Mô tả ngắn
- `price`: Giá bán
- `compare_price`: Giá so sánh (giá gốc)
- `sku`: Mã sản phẩm (unique)
- `category_id`: ID danh mục
- `images`: Mảng các URL ảnh
- `status`: Trạng thái (active, inactive, draft)
- `stock_quantity`: Số lượng tồn kho
- `weight`: Trọng lượng (kg)
- `dimensions`: Kích thước
- `material`: Chất liệu
- `color`: Màu sắc
- `meta_title`, `meta_description`: SEO metadata
- `created_at`, `updated_at`: Timestamps

---

### 3. Inquiries

Bảng lưu trữ các yêu cầu/lead từ khách hàng.

```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  product_ids UUID[], -- Array of product IDs
  status VARCHAR(50) DEFAULT 'pending', -- pending, contacted, completed, cancelled
  anonymous_id VARCHAR(255), -- For tracking without login
  source VARCHAR(100), -- website, facebook, zalo, etc.
  notes TEXT, -- Admin notes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_anonymous_id ON inquiries(anonymous_id);
```

**Fields:**
- `id`: UUID primary key
- `name`: Tên khách hàng
- `phone`: Số điện thoại
- `email`: Email (optional)
- `message`: Nội dung yêu cầu
- `product_ids`: Mảng ID sản phẩm quan tâm
- `status`: Trạng thái xử lý
- `anonymous_id`: ID ẩn danh (tracking)
- `source`: Nguồn inquiry
- `notes`: Ghi chú của admin
- `created_at`, `updated_at`: Timestamps

---

### 4. CMS Pages

Bảng lưu trữ các trang CMS (About, Privacy, Terms, etc.).

```sql
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_published ON cms_pages(is_published);
```

**Fields:**
- `id`: UUID primary key
- `slug`: URL-friendly name (unique)
- `title`: Tiêu đề trang
- `content`: Nội dung HTML/Markdown
- `meta_title`, `meta_description`: SEO metadata
- `is_published`: Trạng thái publish
- `created_at`, `updated_at`: Timestamps

---

### 5. Admins (Optional - cho admin panel)

Bảng lưu trữ thông tin admin users.

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin', -- admin, super_admin
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_email ON admins(email);
```

**Fields:**
- `id`: UUID primary key
- `username`: Tên đăng nhập (unique)
- `email`: Email (unique)
- `password_hash`: Mật khẩu đã hash
- `full_name`: Tên đầy đủ
- `role`: Vai trò (admin, super_admin)
- `is_active`: Trạng thái active
- `last_login_at`: Lần đăng nhập cuối
- `created_at`, `updated_at`: Timestamps

---

## Redis Keys Structure

### Cache Keys

```
cache:product:{slug}          # Cache product by slug (TTL: 1 hour)
cache:product:list:{page}     # Cache product list by page (TTL: 30 min)
cache:category:{slug}          # Cache category by slug (TTL: 1 hour)
cache:category:tree            # Cache category tree (TTL: 1 hour)
cache:cms:{slug}               # Cache CMS page (TTL: 24 hours)
```

### Rate Limiting Keys

```
rate_limit:inquiry:{ip}       # Rate limit inquiry submissions (TTL: 1 hour)
rate_limit:api:{ip}            # Rate limit API calls (TTL: 1 minute)
```

### Session Keys (nếu cần)

```
session:{anonymous_id}         # Session data (TTL: 7 days)
```

---

## Relationships

```
Categories (1) ──< (N) Products
Categories (1) ──< (N) Categories (self-referencing)
Products (N) ──< (N) Inquiries (via product_ids array)
```

---

## Migration Strategy

1. **Initial Migration**: Tạo tất cả tables
2. **Indexes**: Tạo indexes sau khi có data
3. **Foreign Keys**: Setup foreign key constraints
4. **Triggers**: Auto-update `updated_at` timestamps

---

## Sample Data

### Categories
- Sofa & Couches
  - Living Room Sofas
  - Sectional Sofas
- Tables
  - Dining Tables
  - Coffee Tables
- Chairs
  - Dining Chairs
  - Office Chairs

### Products
- Sample products với đầy đủ thông tin
- Images URLs
- Prices và compare prices

---

## Notes

- Tất cả timestamps sử dụng `TIMESTAMP` (UTC)
- UUID được sử dụng cho tất cả primary keys
- Arrays (images, product_ids) sử dụng PostgreSQL array type
- Indexes được tạo cho các fields thường xuyên query
- Foreign keys có `ON DELETE SET NULL` để tránh cascade delete
