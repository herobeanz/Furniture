# Tối ưu tải sản phẩm (Performance)

Tài liệu mô tả các thay đổi nhằm giảm thời gian chờ khi người dùng điều hướng giữa các trang sản phẩm.

**Lịch sử cập nhật:** xem [CHANGELOG.md](./CHANGELOG.md).

---

## Triệu chứng ban đầu

- Mỗi lần click sang trang khác (danh sách, danh mục, chi tiết) phải chờ API và skeleton lại từ đầu.
- Header và trang `/san-pham` gọi trùng `GET /categories/tree`.
- Trang chi tiết gọi 2 API (sản phẩm + 12 related) và xóa `product` về `null` trước khi load xong.
- API list trả cả `description` HTML dù card chỉ cần thumbnail + giá.

---

## Giải pháp đã áp dụng

### Frontend (`fe/`)

| Thành phần | Mô tả |
|------------|--------|
| `stores/categoryTree.ts` | Một nguồn danh mục, cache 10 phút, dedupe request đồng thời |
| `stores/productsCache.ts` | Cache list / chi tiết / related / sản phẩm theo danh mục (TTL 5 phút) |
| `utils/cacheEntry.ts` | Hằng số TTL và helper `isCacheFresh` |
| Stale-while-revalidate | Hiển thị cache ngay; refresh nền nếu hết hạn |
| `App.vue` + `KeepAlive` | Giữ state 8 view public khi quay lại |
| `useProductData` | Không reset `product` khi có cache; related giới hạn **6** |
| Composables | `useProductsListPage`, `useCategoryData`, `useHomeData`, `SearchView` dùng cache |

**View có `defineOptions({ name: ... })` cho KeepAlive:**  
`HomeView`, `ProductsListView`, `CategoryView`, `ProductView`, `CollectionView`, `CollectionsListView`, `SearchView`.

### Backend (`be/`)

| Thành phần | Mô tả |
|------------|--------|
| `shared/utils/product-serialize.ts` | `serializeProductListItem` — không trả `description` đầy đủ |
| `GET /products`, related, category products | Dùng payload list gọn |
| `@PublicCacheHeaders()` | `Cache-Control: public, max-age=60, stale-while-revalidate=300` |

---

## Hành vi cache (FE)

- **Fresh (≤ 5 phút):** không gọi API, dùng dữ liệu trong Pinia.
- **Stale (> 5 phút):** hiển thị cache ngay, gọi API nền và cập nhật UI.
- **Force:** nút "Thử lại" hoặc tham số `{ force: true }` trên store.

Sau khi admin sửa sản phẩm, có thể gọi `useProductsCacheStore().invalidateAll()` (ví dụ sau save ở admin — tùy tích hợp sau).

---

## Việc nên làm thêm (chưa làm)

1. **Render cold start** — ping health `/health` định kỳ hoặc nâng plan Render.
2. **Prefetch** — `router.prefetch` / hover trên `ProductCard`.
3. **CDN** trước API hoặc cache Vercel cho `GET` public.
4. **Invalidate cache** từ admin sau create/update/delete sản phẩm.

---

## Kiểm tra nhanh

1. DevTools → Network: lần 2 vào cùng trang không nên thấy request trùng (trong TTL).
2. Back từ chi tiết → danh sách: grid hiện ngay (KeepAlive + cache).
3. Response list: không còn field `description` dài trên `GET /products`.
