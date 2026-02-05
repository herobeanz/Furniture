# 📊 Database Schema Design

> Tài liệu mô tả schema database cho hệ thống Furniture E-commerce

---

## Tổng quan

- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Cache**: Redis 7+

**Cấu trúc phân cấp:**
```
Room (Phòng: Phòng khách, Phòng ngủ...) 
  └── Category (Danh mục: Sofa, Giường, Tủ...)
      └── Product (Sản phẩm cụ thể)
```

---

## Tables

### 1. Rooms (Phòng - Level 1)

Bảng lưu trữ thông tin phòng. Đây là level cao nhất trong phân cấp.

**Ví dụ:** Phòng khách, Phòng ngủ, Phòng bếp, Phòng thờ...

```sql
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rooms_slug ON rooms(slug);
CREATE INDEX idx_rooms_order ON rooms(order_index);
CREATE INDEX idx_rooms_active ON rooms(is_active);
```

**Fields:**
- `id`: Integer primary key (auto-increment)
- `name`: Tên phòng (ví dụ: "Phòng khách")
- `slug`: URL-friendly name (unique)
- `description`: Mô tả phòng
- `thumbnail`: URL ảnh đại diện cho phòng
- `order_index`: Thứ tự hiển thị
- `is_active`: Trạng thái active/inactive
- `seo_title`, `seo_description`: SEO metadata
- `created_at`, `updated_at`: Timestamps

---

### 2. Categories (Danh mục - Level 2)

Bảng lưu trữ danh mục sản phẩm trong mỗi phòng. Mỗi Category thuộc về một Room.

**Ví dụ:** Trong "Phòng khách" có: Sofa, Bàn trà, Bàn ăn, Ghế ăn... Trong "Phòng ngủ" có: Giường, Tủ quần áo...

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, slug)
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_room_id ON categories(room_id);
CREATE INDEX idx_categories_order ON categories(order_index);
```

**Fields:**
- `id`: Integer primary key (auto-increment)
- `name`: Tên danh mục (ví dụ: "Sofa", "Giường", "Tủ")
- `slug`: URL-friendly name (unique within room)
- `description`: Mô tả danh mục
- `thumbnail`: URL ảnh danh mục
- `room_id`: ID phòng (Room) - **Bắt buộc**
- `order_index`: Thứ tự hiển thị trong phòng
- `is_active`: Trạng thái active/inactive
- `seo_title`, `seo_description`: SEO metadata
- `created_at`, `updated_at`: Timestamps

**Unique Constraint:** `(room_id, slug)` - Mỗi slug chỉ unique trong một room

---

### 3. Products (Sản phẩm - Level 3)

Bảng lưu trữ thông tin sản phẩm cụ thể. Mỗi Product thuộc về một Category.

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  thumbnail VARCHAR(500),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'available', -- available, out_of_stock, discontinued
  material VARCHAR(255),
  dimensions VARCHAR(100), -- e.g., "100x50x80 cm"
  color VARCHAR(100),
  warranty VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_hot BOOLEAN DEFAULT false,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_hot ON products(is_hot);
```

**Fields:**
- `id`: Integer primary key (auto-increment)
- `name`: Tên sản phẩm
- `slug`: URL-friendly name (unique)
- `sku`: Mã sản phẩm (unique)
- `description`: Mô tả chi tiết
- `short_description`: Mô tả ngắn
- `price`: Giá bán
- `sale_price`: Giá so sánh (giá gốc)
- `thumbnail`: URL ảnh đại diện
- `category_id`: ID danh mục (Category)
- `status`: Trạng thái (available, out_of_stock, discontinued) - **Enum**
- `material`: Chất liệu
- `dimensions`: Kích thước
- `color`: Màu sắc
- `warranty`: Bảo hành
- `is_active`: Trạng thái active/inactive
- `is_featured`: Sản phẩm nổi bật
- `is_hot`: Sản phẩm hot
- `seo_title`, `seo_description`: SEO metadata
- `created_at`, `updated_at`: Timestamps

---

### 4. Product Images

Bảng lưu trữ các ảnh của sản phẩm (thay thế cho array images).

```sql
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  alt_text VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(is_primary);
```

**Fields:**
- `id`: Integer primary key
- `product_id`: ID sản phẩm
- `image_url`: URL ảnh
- `is_primary`: Ảnh chính
- `alt_text`: Alt text cho SEO
- `order_index`: Thứ tự hiển thị
- `created_at`, `updated_at`: Timestamps

---

### 5. Collections

Bảng lưu trữ các bộ sưu tập sản phẩm.

```sql
CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_collections_active ON collections(is_active);
```

---

### 6. Collection Products

Bảng junction cho quan hệ many-to-many giữa Collection và Product.

```sql
CREATE TABLE collection_products (
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX idx_collection_products_collection ON collection_products(collection_id);
CREATE INDEX idx_collection_products_product ON collection_products(product_id);
```

---

### 7. Inquiries

Bảng lưu trữ các yêu cầu/lead từ khách hàng.

```sql
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, completed, cancelled
  source VARCHAR(50), -- contact, product, facebook, zalo, etc.
  anonymous_id VARCHAR(255), -- For tracking without login
  admin_notes TEXT, -- Admin notes
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_anonymous_id ON inquiries(anonymous_id);
CREATE INDEX idx_inquiries_product_id ON inquiries(product_id);
```

**Fields:**
- `id`: Integer primary key
- `name`: Tên khách hàng
- `phone`: Số điện thoại
- `email`: Email (optional)
- `message`: Nội dung yêu cầu
- `product_id`: ID sản phẩm quan tâm (single product, not array)
- `status`: Trạng thái xử lý (new, contacted, completed, cancelled) - **Enum**
- `source`: Nguồn inquiry (contact, product, facebook, zalo, etc.) - **Enum**
- `anonymous_id`: ID ẩn danh (tracking)
- `admin_notes`: Ghi chú của admin
- `responded_at`: Thời gian phản hồi
- `created_at`, `updated_at`: Timestamps

---

### 8. CMS Pages

Bảng lưu trữ các trang CMS (About, Privacy, Terms, etc.).

```sql
CREATE TABLE cms_pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  thumbnail VARCHAR(500),
  seo_title VARCHAR(255),
  seo_description TEXT,
  page_type VARCHAR(50), -- page, blog, article, etc.
  meta_keywords VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_active ON cms_pages(is_active);
```

**Fields:**
- `id`: Integer primary key
- `slug`: URL-friendly name (unique)
- `title`: Tiêu đề trang
- `content`: Nội dung HTML/Markdown
- `thumbnail`: Ảnh đại diện
- `seo_title`, `seo_description`: SEO metadata
- `page_type`: Loại trang (page, blog, article, etc.)
- `meta_keywords`: Keywords cho SEO
- `is_active`: Trạng thái publish
- `published_at`: Thời gian publish
- `created_at`, `updated_at`: Timestamps

---

### 9. Admins

Bảng lưu trữ thông tin admin users.

```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordhashed VARCHAR(255) NOT NULL,
  fullname VARCHAR(255),
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
- `id`: Integer primary key
- `username`: Username (optional, unique)
- `email`: Email (unique, required)
- `passwordhashed`: Mật khẩu đã hash
- `fullname`: Tên đầy đủ
- `role`: Vai trò (admin, super_admin) - **Enum**
- `is_active`: Trạng thái active
- `last_login_at`: Lần đăng nhập cuối
- `created_at`, `updated_at`: Timestamps

---

## Enums

### ProductStatus
- `available`: Có sẵn
- `out_of_stock`: Hết hàng
- `discontinued`: Ngừng sản xuất

### InquiryStatus
- `new`: Mới
- `contacted`: Đã liên hệ
- `completed`: Hoàn thành
- `cancelled`: Hủy

### InquirySource
- `contact`: Từ trang liên hệ
- `product`: Từ trang sản phẩm
- `facebook`: Từ Facebook
- `zalo`: Từ Zalo
- `other`: Khác

### AdminRole
- `admin`: Admin thường
- `super_admin`: Super admin

---

## Relationships

```
Room (1) ──< (N) Category
Category (1) ──< (N) Product
Product (1) ──< (N) ProductImage
Product (N) ──< (N) Collection (via collection_products)
Product (1) ──< (N) Inquiry
```

**Ví dụ phân cấp:**
```
Phòng khách (Room)
  ├── Sofa (Category)
  │   ├── Sofa da màu nâu (Product)
  │   │   ├── Image 1 (ProductImage)
  │   │   └── Image 2 (ProductImage)
  │   └── Sofa vải màu xám (Product)
  ├── Bàn trà (Category)
  │   └── Bàn trà gỗ (Product)
  └── Bàn ăn (Category)
      └── Bàn ăn 6 ghế (Product)

Phòng ngủ (Room)
  ├── Giường (Category)
  │   └── Giường ngủ gỗ (Product)
  └── Tủ quần áo (Category)
      └── Tủ quần áo 4 cánh (Product)
```

---

## URL Structure

### Frontend Routes
- **Room**: `/:roomSlug` (ví dụ: `/phong-khach`)
- **Category**: `/:roomSlug/:categorySlug` (ví dụ: `/phong-khach/sofa`)
- **Product**: `/:roomSlug/:categorySlug/:productSlug` (ví dụ: `/phong-khach/sofa/sofa-da-mau-nau`)
- **Collection**: `/bo-suu-tap/:slug`
- **CMS Page**: `/trang/:slug`
- **Contact**: `/lien-he`
- **Inquiry Form**: `/san-pham/:slug/lien-he`

### Admin Routes
- `/admin/login`
- `/admin/dashboard`
- `/admin/rooms`
- `/admin/categories`
- `/admin/products`
- `/admin/collections`
- `/admin/inquiries`
- `/admin/cms-pages`
- `/admin/reports`

---

## Redis Keys Structure

### Cache Keys

```
cache:room:{slug}              # Cache room by slug (TTL: 1 hour)
cache:room:list                 # Cache all rooms (TTL: 1 hour)
cache:category:{slug}            # Cache category by slug (TTL: 1 hour)
cache:category:by-room:{roomId} # Cache categories by room (TTL: 1 hour)
cache:product:{slug}             # Cache product by slug (TTL: 1 hour)
cache:product:list:{page}        # Cache product list by page (TTL: 30 min)
cache:collection:{slug}          # Cache collection by slug (TTL: 1 hour)
cache:cms:{slug}                 # Cache CMS page (TTL: 24 hours)
```

### Rate Limiting Keys

```
rate_limit:inquiry:{ip}         # Rate limit inquiry submissions (TTL: 1 hour)
rate_limit:api:{ip}              # Rate limit API calls (TTL: 1 minute)
```

---

## Migration Strategy

1. **Initial Migration**: Tạo tất cả tables với Int IDs
2. **Indexes**: Tạo indexes sau khi có data
3. **Foreign Keys**: Setup foreign key constraints
4. **Enums**: Tạo enums cho status, role, source
5. **Triggers**: Auto-update `updated_at` timestamps

**Lưu ý khi migrate:**
- Tất cả IDs đổi từ UUID sang Int với auto-increment
- Room thay thế Category (level 1)
- Category thay thế CategoryGroup (level 2)
- Product giữ nguyên nhưng link đến Category thay vì CategoryGroup
- ProductImage tách riêng thay vì dùng array
- Collection và CollectionProduct thêm mới
- Inquiry: `product_ids` array → `product_id` single, thêm enums

---

## Sample Data

### Rooms
- Phòng khách
- Phòng ngủ
- Phòng bếp
- Phòng thờ

### Categories (theo từng phòng)
**Phòng khách:**
- Sofa
- Bàn trà
- Bàn ăn
- Ghế ăn

**Phòng ngủ:**
- Giường
- Tủ quần áo
- Bàn trang điểm

**Phòng thờ:**
- Bàn thờ
- Kệ thờ

### Products
- Sample products với đầy đủ thông tin
- ProductImages với is_primary flag
- Prices và sale prices

---

## Notes

- Tất cả timestamps sử dụng `TIMESTAMP` (UTC)
- **Int IDs** được sử dụng cho tất cả primary keys (auto-increment)
- ProductImages tách riêng thay vì dùng array
- Indexes được tạo cho các fields thường xuyên query
- Foreign keys:
  - Category → Room: `ON DELETE CASCADE` (xóa phòng thì xóa danh mục)
  - Product → Category: `ON DELETE SET NULL` (xóa danh mục thì sản phẩm vẫn giữ, chỉ mất link)
  - ProductImage → Product: `ON DELETE CASCADE` (xóa sản phẩm thì xóa ảnh)
  - CollectionProduct → Collection/Product: `ON DELETE CASCADE`
  - Inquiry → Product: `ON DELETE SET NULL`
- Enums được sử dụng cho: ProductStatus, InquiryStatus, InquirySource, AdminRole
- Unique constraints:
  - `rooms.slug`: Unique
  - `categories(room_id, slug)`: Unique within room
  - `products.slug`: Unique
  - `products.sku`: Unique
  - `collections.slug`: Unique
  - `cms_pages.slug`: Unique
  - `admins.username`: Unique (nullable)
  - `admins.email`: Unique
