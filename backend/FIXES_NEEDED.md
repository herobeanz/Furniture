# Các lỗi cần sửa

## Vấn đề chính
Prisma schema sử dụng `@map` để map sang snake_case trong database (order_index, is_active, room_id, etc.), nhưng Prisma client trả về snake_case trong TypeScript. Code cần được cập nhật để sử dụng snake_case trong queries.

## Các thay đổi cần thiết

### 1. Trong where clauses:
- `isActive` → `is_active`
- `orderIndex` → `order_index`
- `categoryId` → `category_id`
- `roomId` → `room_id`
- `categoryGroupId` → `category_group_id` (không còn dùng)
- `isPrimary` → `is_primary`
- `seoTitle` → `seo_title`
- `seoDescription` → `seo_description`

### 2. Trong orderBy:
- `orderIndex` → `order_index`
- `isPrimary` → `is_primary`
- `createdAt` → `created_at`

### 3. Trong data (create/update):
- `orderIndex` → `order_index`
- `isActive` → `is_active`
- `categoryId` → `category_id`
- `roomId` → `room_id`
- `shortDescription` → `short_description`
- `salePrice` → `sale_price`
- `seoTitle` → `seo_title`
- `seoDescription` → `seo_description`
- `isFeatured` → `is_featured`
- `isHot` → `is_hot`
- `isPrimary` → `is_primary`
- `orderIndex` → `order_index`
- `altText` → `alt_text`
- `imageUrl` → `image_url`
- `adminNotes` → `admin_notes`
- `respondedAt` → `responded_at`
- `pageType` → `page_type`
- `metaKeywords` → `meta_keywords`
- `publishedAt` → `published_at`

### 4. Trong select:
- `categoryId` → `category_id`
- `roomId` → `room_id`
- `orderIndex` → `order_index`

### 5. Serialize functions:
Cần cập nhật để nhận cả snake_case và camelCase:
```typescript
function serializeX(x: any) {
  return {
    id: x.id,
    name: x.name,
    orderIndex: x.order_index ?? x.orderIndex,
    isActive: x.is_active ?? x.isActive,
    // ...
  };
}
```

### 6. Enums:
- AdminRole: `super_admin` → `admin` hoặc `editor`
- InquiryStatus: `pending` → `new`, `completed` → `done`
- InquirySource: `website` → `contact` hoặc các giá trị khác trong enum
- ProductStatus: `active` → `available`, `inactive` → `hidden`, `draft` → `discontinued`

### 7. Product fields:
- `comparePrice` → `salePrice` (đã đổi tên trong schema)
- `images` (array) → `images` (relation với ProductImage)
- `stockQuantity` → không còn (đã xóa)
- `weight` → không còn (đã xóa)

### 8. Seed file:
- Cần cập nhật để sử dụng Room > Category > Product
- Xóa CategoryGroup
- Xóa HeroItem
- Cập nhật enums

### 9. CategoryGroups module:
- Có thể xóa hoàn toàn vì không còn trong schema

### 10. Hero module:
- Cập nhật để sử dụng Room thay vì HeroItem
