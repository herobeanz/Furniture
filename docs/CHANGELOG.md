# Changelog — Furniture

Ghi lại các thay đổi đáng chú ý theo **ngày** (ISO 8601). Mục mới nhất ở trên.

---

## 2026-06-02

### Tối ưu tải sản phẩm (performance)

**Mục tiêu:** Giảm thời gian chờ khi click điều hướng; tránh tải lại API không cần thiết.

#### Frontend

- Thêm Pinia store `categoryTree` — cache cây danh mục, tránh gọi `/categories/tree` trùng (Header + `/san-pham`).
- Thêm Pinia store `productsCache` — cache danh sách, chi tiết, related, sản phẩm theo slug danh mục (TTL 5 phút).
- Thêm `utils/cacheEntry.ts` (TTL, `isCacheFresh`).
- Cập nhật `useCategoryTree`, `useProductsListPage`, `useProductData`, `useCategoryData`, `useHomeData`.
- Cập nhật `SearchView` dùng cache tìm kiếm.
- `App.vue`: `KeepAlive` (max 8) cho các view public; bỏ `:key="route.path"` trong layout chính.
- `defineOptions({ name })` trên 7 view để KeepAlive hoạt động.
- Trang chi tiết: stale-while-revalidate, related **6** sản phẩm (trước 12).
- `onActivated` trên các composable/view liên quan để refresh nhẹ khi quay lại tab.

#### Backend

- Thêm `serializeProductListItem` — list/related không trả `description` HTML đầy đủ.
- Áp dụng list serializer cho `GET /products`, related, `GET /categories/:slug/products`.
- Thêm `@PublicCacheHeaders()` (60s + SWR 300s) trên GET public products & categories.

#### Tài liệu

- Thêm `docs/performance-optimization.md` (mô tả kiến trúc cache).
- Thêm `docs/CHANGELOG.md` (file này).

**File chính:**  
`fe/src/stores/categoryTree.ts`, `fe/src/stores/productsCache.ts`, `fe/src/App.vue`, `be/src/shared/utils/product-serialize.ts`, `be/src/shared/decorators/public-cache.decorator.ts`

---

## Mẫu ghi chép (cho lần sau)

```markdown
## YYYY-MM-DD

### Tiêu đề ngắn

- Bullet mô tả thay đổi
- **Phạm vi:** fe | be | docs
```
