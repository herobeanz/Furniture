# 📋 Giải thích chi tiết các trường dữ liệu trong Database

> Tài liệu mô tả chi tiết ý nghĩa và cách sử dụng từng trường dữ liệu trong các bảng của hệ thống Furniture E-commerce

---

## 📊 Tổng quan cấu trúc

Hệ thống có **7 bảng chính** với cấu trúc phân cấp 3 tầng:

```
Category (Phòng) 
  └── CategoryGroup (Danh mục: Sofa, Giường, Tủ...)  
      └── Product (Sản phẩm cụ thể)
```

Các bảng hỗ trợ:
- **Inquiries**: Lưu trữ yêu cầu từ khách hàng
- **CmsPage**: Quản lý nội dung trang tĩnh
- **HeroItem**: Quản lý banner hero trên trang chủ
- **Admin**: Quản lý tài khoản admin

---

## 1. 📁 Bảng `categories` (Phòng - Level 1)

Bảng lưu trữ thông tin các phòng trong nhà. Đây là cấp cao nhất trong phân cấp sản phẩm.

### Các trường dữ liệu:

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|--------|--------------|----------|-------|-------|
| **id** | UUID | ✅ | Khóa chính, tự động tạo bằng `gen_random_uuid()` | `550e8400-e29b-41d4-a716-446655440000` |
| **name** | VARCHAR(255) | ✅ | Tên phòng (hiển thị cho người dùng) | `"Phòng khách"`, `"Phòng ngủ"` |
| **slug** | VARCHAR(255) | ✅ | Tên URL-friendly, duy nhất, dùng trong đường dẫn | `"phong-khach"`, `"phong-ngu"` |
| **description** | TEXT | ❌ | Mô tả chi tiết về phòng (có thể null) | `"Nội thất phòng khách cao cấp..."` |
| **image_url** | VARCHAR(500) | ❌ | URL ảnh đại diện cho phòng (có thể null) | `"https://example.com/phong-khach.jpg"` |
| **order_index** | INTEGER | ✅ | Thứ tự hiển thị (sắp xếp), mặc định = 0 | `0`, `1`, `2` (số nhỏ hơn hiển thị trước) |
| **is_active** | BOOLEAN | ✅ | Trạng thái hoạt động, mặc định = true | `true` (hiển thị), `false` (ẩn) |
| **created_at** | TIMESTAMP | ✅ | Thời gian tạo, tự động = thời điểm hiện tại | `2024-01-15 10:30:00` |
| **updated_at** | TIMESTAMP | ✅ | Thời gian cập nhật cuối, tự động cập nhật | `2024-01-20 14:20:00` |

### Quan hệ:
- **1 Category** có nhiều **CategoryGroup** (`categoryGroups`)

### Indexes (để tối ưu truy vấn):
- `slug`: Tìm kiếm nhanh theo slug
- `order_index`: Sắp xếp nhanh theo thứ tự

### Ví dụ dữ liệu:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Phòng khách",
  "slug": "phong-khach",
  "description": "Nội thất phòng khách cao cấp với sofa, bàn trà, kệ tivi",
  "image_url": "https://example.com/phong-khach.jpg",
  "order_index": 0,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

---

## 2. 📁 Bảng `category_groups` (Danh mục - Level 2)

Bảng lưu trữ các danh mục sản phẩm trong mỗi phòng. Mỗi CategoryGroup thuộc về một Category.

### Các trường dữ liệu:

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|--------|--------------|----------|-------|-------|
| **id** | UUID | ✅ | Khóa chính, tự động tạo | `660e8400-e29b-41d4-a716-446655440001` |
| **name** | VARCHAR(255) | ✅ | Tên danh mục (hiển thị) | `"Sofa & Ghế bành"`, `"Giường ngủ"` |
| **slug** | VARCHAR(255) | ✅ | Tên URL-friendly, duy nhất | `"sofa-couches"`, `"giuong-ngu"` |
| **description** | TEXT | ❌ | Mô tả về danh mục | `"Sofa và ghế bành cao cấp..."` |
| **image_url** | VARCHAR(500) | ❌ | URL ảnh đại diện cho danh mục | `"https://example.com/sofa.jpg"` |
| **category_id** | UUID | ✅ | **ID của Category cha** (Foreign Key) | Liên kết đến `categories.id` |
| **order_index** | INTEGER | ✅ | Thứ tự hiển thị trong phòng, mặc định = 0 | `0`, `1`, `2` |
| **is_active** | BOOLEAN | ✅ | Trạng thái hoạt động, mặc định = true | `true` hoặc `false` |
| **created_at** | TIMESTAMP | ✅ | Thời gian tạo | `2024-01-15 10:30:00` |
| **updated_at** | TIMESTAMP | ✅ | Thời gian cập nhật cuối | `2024-01-20 14:20:00` |

### Quan hệ:
- **1 CategoryGroup** thuộc về **1 Category** (`category`)
- **1 CategoryGroup** có nhiều **Product** (`products`)

### Indexes:
- `slug`: Tìm kiếm nhanh theo slug
- `category_id`: Tìm kiếm nhanh các CategoryGroup theo Category
- `order_index`: Sắp xếp nhanh theo thứ tự

### Foreign Key Constraint:
- `category_id` → `categories.id` với `ON DELETE CASCADE`
  - **Ý nghĩa**: Khi xóa một Category, tất cả CategoryGroup thuộc Category đó sẽ tự động bị xóa

### Ví dụ dữ liệu:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Sofa & Ghế bành",
  "slug": "sofa-couches",
  "description": "Sofa và ghế bành cao cấp với nhiều mẫu mã đa dạng",
  "image_url": "https://example.com/sofa.jpg",
  "category_id": "550e8400-e29b-41d4-a716-446655440000",
  "order_index": 0,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

---

## 3. 📁 Bảng `products` (Sản phẩm - Level 3)

Bảng lưu trữ thông tin chi tiết của từng sản phẩm. Mỗi Product thuộc về một CategoryGroup.

### Các trường dữ liệu:

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|--------|--------------|----------|-------|-------|
| **id** | UUID | ✅ | Khóa chính, tự động tạo | `770e8400-e29b-41d4-a716-446655440002` |
| **name** | VARCHAR(255) | ✅ | Tên sản phẩm | `"Sofa da cao cấp 3 chỗ"` |
| **slug** | VARCHAR(255) | ✅ | Tên URL-friendly, duy nhất | `"sofa-da-cao-cap-3-cho"` |
| **description** | TEXT | ❌ | Mô tả chi tiết sản phẩm (HTML/Markdown) | `"<p>Sofa da thật...</p>"` |
| **short_description** | VARCHAR(500) | ❌ | Mô tả ngắn (hiển thị trong danh sách) | `"Sofa da cao cấp, thiết kế hiện đại"` |
| **price** | DECIMAL(10,2) | ✅ | **Giá bán** (10 chữ số, 2 số thập phân) | `15000000.00` (15 triệu) |
| **compare_price** | DECIMAL(10,2) | ❌ | Giá so sánh (giá gốc, để hiển thị giảm giá) | `20000000.00` (20 triệu) |
| **sku** | VARCHAR(100) | ❌ | Mã SKU (Stock Keeping Unit), duy nhất | `"SOFA-DA-3C-001"` |
| **category_group_id** | UUID | ❌ | **ID của CategoryGroup** (Foreign Key) | Liên kết đến `category_groups.id` |
| **images** | TEXT[] | ✅ | **Mảng các URL ảnh** (PostgreSQL array) | `["url1.jpg", "url2.jpg", "url3.jpg"]` |
| **status** | VARCHAR(50) | ✅ | Trạng thái sản phẩm, mặc định = `"active"` | `"active"`, `"inactive"`, `"draft"` |
| **stock_quantity** | INTEGER | ✅ | Số lượng tồn kho, mặc định = 0 | `10`, `0`, `999` |
| **weight** | DECIMAL(8,2) | ❌ | Trọng lượng (kg) | `45.50` (45.5 kg) |
| **dimensions** | VARCHAR(100) | ❌ | Kích thước (dài x rộng x cao) | `"200x90x85 cm"` |
| **material** | VARCHAR(255) | ❌ | Chất liệu | `"Da thật", "Gỗ sồi", "Vải bố"` |
| **color** | VARCHAR(100) | ❌ | Màu sắc | `"Nâu", "Xám", "Trắng"` |
| **meta_title** | VARCHAR(255) | ❌ | Tiêu đề SEO (cho thẻ `<title>`) | `"Sofa da cao cấp 3 chỗ - Giá tốt"` |
| **meta_description** | TEXT | ❌ | Mô tả SEO (cho thẻ `<meta description>`) | `"Sofa da cao cấp 3 chỗ..."` |
| **created_at** | TIMESTAMP | ✅ | Thời gian tạo | `2024-01-15 10:30:00` |
| **updated_at** | TIMESTAMP | ✅ | Thời gian cập nhật cuối | `2024-01-20 14:20:00` |

### Quan hệ:
- **1 Product** thuộc về **1 CategoryGroup** (`categoryGroup`)

### Indexes:
- `slug`: Tìm kiếm nhanh theo slug
- `category_group_id`: Tìm kiếm nhanh các Product theo CategoryGroup
- `status`: Lọc nhanh theo trạng thái
- `sku`: Tìm kiếm nhanh theo mã SKU
- `price`: Sắp xếp/tìm kiếm theo giá

### Foreign Key Constraint:
- `category_group_id` → `category_groups.id` với `ON DELETE SET NULL`
  - **Ý nghĩa**: Khi xóa một CategoryGroup, các Product thuộc CategoryGroup đó sẽ không bị xóa, nhưng `category_group_id` sẽ được set thành `NULL`

### Giải thích các giá trị `status`:
- **`"active"`**: Sản phẩm đang bán, hiển thị trên website
- **`"inactive"`**: Sản phẩm tạm ngừng bán, không hiển thị
- **`"draft"`**: Sản phẩm đang soạn thảo, chưa publish

### Ví dụ dữ liệu:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Sofa da cao cấp 3 chỗ",
  "slug": "sofa-da-cao-cap-3-cho",
  "description": "<p>Sofa da thật cao cấp, thiết kế hiện đại...</p>",
  "short_description": "Sofa da cao cấp, thiết kế hiện đại",
  "price": "15000000.00",
  "compare_price": "20000000.00",
  "sku": "SOFA-DA-3C-001",
  "category_group_id": "660e8400-e29b-41d4-a716-446655440001",
  "images": [
    "https://example.com/sofa-1.jpg",
    "https://example.com/sofa-2.jpg",
    "https://example.com/sofa-3.jpg"
  ],
  "status": "active",
  "stock_quantity": 10,
  "weight": "45.50",
  "dimensions": "200x90x85 cm",
  "material": "Da thật",
  "color": "Nâu",
  "meta_title": "Sofa da cao cấp 3 chỗ - Giá tốt",
  "meta_description": "Sofa da cao cấp 3 chỗ với giá ưu đãi...",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

---

## 4. 📁 Bảng `inquiries` (Yêu cầu từ khách hàng)

Bảng lưu trữ các yêu cầu/lead từ khách hàng (form liên hệ, yêu cầu báo giá, v.v.).

### Các trường dữ liệu:

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|--------|--------------|----------|-------|-------|
| **id** | UUID | ✅ | Khóa chính, tự động tạo | `880e8400-e29b-41d4-a716-446655440003` |
| **name** | VARCHAR(255) | ✅ | Tên khách hàng | `"Nguyễn Văn A"` |
| **phone** | VARCHAR(20) | ✅ | Số điện thoại | `"0901234567"` |
| **email** | VARCHAR(255) | ❌ | Email khách hàng (có thể null) | `"customer@example.com"` |
| **message** | TEXT | ✅ | Nội dung yêu cầu | `"Tôi muốn biết giá sản phẩm..."` |
| **product_ids** | UUID[] | ✅ | **Mảng ID sản phẩm** khách quan tâm (PostgreSQL array) | `["id1", "id2", "id3"]` |
| **status** | VARCHAR(50) | ✅ | Trạng thái xử lý, mặc định = `"pending"` | `"pending"`, `"contacted"`, `"completed"`, `"cancelled"` |
| **anonymous_id** | VARCHAR(255) | ❌ | ID ẩn danh (dùng để tracking không cần đăng nhập) | `"anon_abc123xyz"` |
| **source** | VARCHAR(100) | ❌ | Nguồn inquiry | `"website"`, `"facebook"`, `"zalo"`, `"phone"` |
| **notes** | TEXT | ❌ | Ghi chú của admin (nội bộ) | `"Khách hàng VIP, ưu tiên liên hệ"` |
| **created_at** | TIMESTAMP | ✅ | Thời gian tạo | `2024-01-15 10:30:00` |
| **updated_at** | TIMESTAMP | ✅ | Thời gian cập nhật cuối | `2024-01-20 14:20:00` |

### Indexes:
- `status`: Lọc nhanh theo trạng thái
- `created_at DESC`: Sắp xếp nhanh theo thời gian (mới nhất trước)
- `anonymous_id`: Tracking nhanh theo anonymous ID

### Giải thích các giá trị `status`:
- **`"pending"`**: Chưa xử lý (mặc định)
- **`"contacted"`**: Đã liên hệ khách hàng
- **`"completed"`**: Đã hoàn thành (đã bán, đã tư vấn xong)
- **`"cancelled"`**: Đã hủy (khách không còn nhu cầu)

### Ví dụ dữ liệu:
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "name": "Nguyễn Văn A",
  "phone": "0901234567",
  "email": "nguyenvana@example.com",
  "message": "Tôi muốn biết giá sản phẩm sofa da cao cấp 3 chỗ",
  "product_ids": [
    "770e8400-e29b-41d4-a716-446655440002"
  ],
  "status": "pending",
  "anonymous_id": "anon_abc123xyz",
  "source": "website",
  "notes": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## 5. 📁 Bảng `cms_pages` (Trang CMS)

Bảng lưu trữ các trang nội dung tĩnh (About, Privacy Policy, Terms of Service, v.v.).

### Các trường dữ liệu:

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|--------|--------------|----------|-------|-------|
| **id** | UUID | ✅ | Khóa chính, tự động tạo | `990e8400-e29b-41d4-a716-446655440004` |
| **slug** | VARCHAR(255) | ✅ | Tên URL-friendly, duy nhất | `"about"`, `"privacy"`, `"terms"` |
| **title** | VARCHAR(255) | ✅ | Tiêu đề trang | `"Về chúng tôi"`, `"Chính sách bảo mật"` |
| **content** | TEXT | ✅ | Nội dung trang (HTML/Markdown) | `"<h1>Về chúng tôi</h1><p>..."` |
| **meta_title** | VARCHAR(255) | ❌ | Tiêu đề SEO | `"Về chúng tôi - Furniture Store"` |
| **meta_description** | TEXT | ❌ | Mô tả SEO | `"Tìm hiểu về Furniture Store..."` |
| **is_published** | BOOLEAN | ✅ | Trạng thái publish, mặc định = true | `true` (hiển thị), `false` (ẩn) |
| **created_at** | TIMESTAMP | ✅ | Thời gian tạo | `2024-01-15 10:30:00` |
| **updated_at** | TIMESTAMP | ✅ | Thời gian cập nhật cuối | `2024-01-20 14:20:00` |

### Indexes:
- `slug`: Tìm kiếm nhanh theo slug
- `is_published`: Lọc nhanh các trang đã publish

### Ví dụ dữ liệu:
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "slug": "about",
  "title": "Về chúng tôi",
  "content": "<h1>Về chúng tôi</h1><p>Furniture Store là...</p>",
  "meta_title": "Về chúng tôi - Furniture Store",
  "meta_description": "Tìm hiểu về Furniture Store, thương hiệu nội thất hàng đầu...",
  "is_published": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

---

## 6. 📁 Bảng `hero_items` (Hero Items - Banner trang chủ)

Bảng lưu trữ các banner hero trên trang chủ (có thể link đến Category hoặc trang khác).

### Các trường dữ liệu:

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|--------|--------------|----------|-------|-------|
| **id** | UUID | ✅ | Khóa chính, tự động tạo | `aa0e8400-e29b-41d4-a716-446655440005` |
| **title** | VARCHAR(255) | ✅ | Tiêu đề banner | `"Phòng khách cao cấp"` |
| **link** | VARCHAR(500) | ✅ | Link khi click vào banner | `"/category/phong-khach"`, `"/product/sofa-xyz"` |
| **image_url** | VARCHAR(500) | ❌ | URL ảnh banner | `"https://example.com/hero-phong-khach.jpg"` |
| **order_index** | INTEGER | ✅ | Thứ tự hiển thị, mặc định = 0 | `0`, `1`, `2` (số nhỏ hơn hiển thị trước) |
| **is_active** | BOOLEAN | ✅ | Trạng thái hoạt động, mặc định = true | `true` (hiển thị), `false` (ẩn) |
| **created_at** | TIMESTAMP | ✅ | Thời gian tạo | `2024-01-15 10:30:00` |
| **updated_at** | TIMESTAMP | ✅ | Thời gian cập nhật cuối | `2024-01-20 14:20:00` |

### Indexes:
- `order_index`: Sắp xếp nhanh theo thứ tự
- `is_active`: Lọc nhanh các banner đang active

### Ví dụ dữ liệu:
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "title": "Phòng khách cao cấp",
  "link": "/category/phong-khach",
  "image_url": "https://example.com/hero-phong-khach.jpg",
  "order_index": 0,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

---

## 7. 📁 Bảng `admins` (Quản trị viên)

Bảng lưu trữ thông tin tài khoản admin (dùng cho admin panel).

### Các trường dữ liệu:

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|--------|--------------|----------|-------|-------|
| **id** | UUID | ✅ | Khóa chính, tự động tạo | `bb0e8400-e29b-41d4-a716-446655440006` |
| **username** | VARCHAR(100) | ✅ | Tên đăng nhập, duy nhất | `"admin"`, `"manager"` |
| **email** | VARCHAR(255) | ✅ | Email, duy nhất | `"admin@example.com"` |
| **password_hash** | VARCHAR(255) | ✅ | **Mật khẩu đã hash** (không lưu plain text) | `"$2b$10$..."` (bcrypt hash) |
| **full_name** | VARCHAR(255) | ❌ | Họ tên đầy đủ | `"Nguyễn Văn Admin"` |
| **role** | VARCHAR(50) | ✅ | Vai trò, mặc định = `"admin"` | `"admin"`, `"super_admin"` |
| **is_active** | BOOLEAN | ✅ | Trạng thái hoạt động, mặc định = true | `true` (có thể đăng nhập), `false` (bị khóa) |
| **last_login_at** | TIMESTAMP | ❌ | Thời gian đăng nhập cuối cùng | `2024-01-20 14:20:00` |
| **created_at** | TIMESTAMP | ✅ | Thời gian tạo | `2024-01-15 10:30:00` |
| **updated_at** | TIMESTAMP | ✅ | Thời gian cập nhật cuối | `2024-01-20 14:20:00` |

### Indexes:
- `username`: Tìm kiếm nhanh theo username
- `email`: Tìm kiếm nhanh theo email

### Giải thích các giá trị `role`:
- **`"admin"`**: Admin thường (quyền hạn cơ bản)
- **`"super_admin"`**: Super admin (quyền cao nhất, có thể quản lý admin khác)

### Lưu ý bảo mật:
- **`password_hash`**: **KHÔNG BAO GIỜ** lưu mật khẩu dạng plain text
- Sử dụng bcrypt hoặc argon2 để hash mật khẩu
- Khi tạo admin mới, hash mật khẩu trước khi lưu vào database

### Ví dụ dữ liệu:
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "username": "admin",
  "email": "admin@example.com",
  "password_hash": "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "full_name": "Nguyễn Văn Admin",
  "role": "super_admin",
  "is_active": true,
  "last_login_at": "2024-01-20T14:20:00Z",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

---

## 🔗 Tóm tắt quan hệ giữa các bảng

```
Category (1) ──< (N) CategoryGroup
CategoryGroup (1) ──< (N) Product
Products (N) ──< (N) Inquiries (via product_ids array)
```

### Ví dụ phân cấp thực tế:

```
Phòng khách (Category)
  ├── Sofa & Ghế bành (CategoryGroup)
  │   ├── Sofa da cao cấp 3 chỗ (Product)
  │   └── Ghế bành da màu nâu (Product)
  ├── Bàn (CategoryGroup)
  │   ├── Bàn trà gỗ (Product)
  │   └── Bàn ăn 6 ghế (Product)
  └── Tủ kệ (CategoryGroup)
      └── Kệ tivi gỗ (Product)

Phòng ngủ (Category)
  ├── Giường (CategoryGroup)
  │   ├── Giường ngủ gỗ (Product)
  │   └── Giường ngủ kim loại (Product)
  └── Tủ quần áo (CategoryGroup)
      └── Tủ quần áo 4 cánh (Product)
```

---

## 📝 Ghi chú quan trọng

### 1. UUID vs Auto-increment
- Tất cả bảng sử dụng **UUID** làm primary key (không phải auto-increment integer)
- **Lợi ích**: 
  - Bảo mật hơn (không đoán được ID)
  - Dễ merge data từ nhiều nguồn
  - Phù hợp với distributed systems

### 2. Timestamps
- Tất cả timestamps sử dụng **UTC** (Coordinated Universal Time)
- `created_at`: Tự động set khi tạo record
- `updated_at`: Tự động cập nhật mỗi khi record được sửa

### 3. Foreign Key Constraints
- **CategoryGroup → Category**: `ON DELETE CASCADE`
  - Xóa Category → tự động xóa tất cả CategoryGroup thuộc Category đó
- **Product → CategoryGroup**: `ON DELETE SET NULL`
  - Xóa CategoryGroup → Product không bị xóa, nhưng `category_group_id` = NULL

### 4. Arrays (PostgreSQL)
- `products.images`: Mảng các URL ảnh
- `inquiries.product_ids`: Mảng các ID sản phẩm
- PostgreSQL hỗ trợ native array type, không cần bảng trung gian

### 5. Indexes
- Indexes được tạo cho các trường thường xuyên query:
  - `slug`: Tìm kiếm theo URL
  - `category_id`, `category_group_id`: Join nhanh
  - `status`, `is_active`: Lọc nhanh
  - `price`: Sắp xếp/tìm kiếm theo giá
  - `created_at DESC`: Sắp xếp theo thời gian

### 6. Slug (URL-friendly)
- Tất cả bảng có trường `slug` (trừ `admins` và `inquiries`)
- Slug dùng trong URL: `/category/phong-khach`, `/product/sofa-da-cao-cap-3-cho`
- Slug phải **unique** và **không có ký tự đặc biệt** (chỉ chữ, số, dấu gạch ngang)

---

## 🎯 Kết luận

Tài liệu này giải thích chi tiết tất cả các trường dữ liệu trong 7 bảng của hệ thống. Mỗi trường đều có:
- **Kiểu dữ liệu** rõ ràng
- **Bắt buộc hay không** (nullable)
- **Mô tả** chi tiết
- **Ví dụ** cụ thể

Khi làm việc với database, hãy tham khảo tài liệu này để hiểu rõ ý nghĩa và cách sử dụng từng trường.
