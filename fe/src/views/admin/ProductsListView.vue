<template>
  <div class="products-panel">
    <div class="toolbar">
      <div class="toolbar-filters">
        <div class="search-wrap">
          <input
            v-model="searchQuery"
            type="text"
            class="filter-input"
            placeholder="Tìm kiếm sản phẩm..."
          />
          <i class="fa-solid fa-magnifying-glass search-icon" />
        </div>
        <div class="select-wrap">
          <select v-model="categoryFilter" class="filter-select">
            <option value="">Tất cả loại sản phẩm</option>
            <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
              {{ cat.name }}
            </option>
          </select>
          <i class="fa-solid fa-chevron-down select-icon" />
        </div>
        <div class="select-wrap">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
          <i class="fa-solid fa-chevron-down select-icon" />
        </div>
      </div>
      <RouterLink to="/admin/products/new" class="btn-primary">
        <i class="fa-solid fa-plus" />
        Thêm sản phẩm
      </RouterLink>
    </div>

    <div v-if="loading" class="state-box">Đang tải...</div>
    <div v-else-if="error" class="state-box state-error">{{ error }}</div>
    <div v-else-if="filteredItems.length === 0" class="state-box">
      {{ items.length === 0 ? 'Chưa có sản phẩm.' : 'Không tìm thấy sản phẩm phù hợp.' }}
    </div>

    <template v-else>
      <p v-if="reordering" class="reorder-hint">
        <i class="fa-solid fa-spinner fa-spin" />
        Đang lưu thứ tự...
      </p>
      <p v-else-if="hasActiveFilters" class="reorder-hint reorder-hint--muted">
        Bỏ bộ lọc để kéo thả sắp xếp thứ tự sản phẩm.
      </p>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th v-if="canReorder" class="col-drag" aria-label="Sắp xếp" />
              <th class="col-product">Sản phẩm</th>
              <th class="col-sku">SKU</th>
              <th class="col-category">Loại sản phẩm</th>
              <th class="col-price">Giá bán</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-featured">Nổi bật</th>
              <th class="col-date">Ngày tạo</th>
              <th class="col-actions">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in displayItems"
              :key="item.id"
              class="data-row"
              :class="{
                'row-dragging': canReorder && dragFromIndex === index,
                'row-drag-over':
                  canReorder && dragOverIndex === index && dragFromIndex !== index,
              }"
              @dragover.prevent="canReorder && onDragOver(index, $event)"
              @dragenter.prevent="canReorder && onDragOver(index, $event)"
              @drop.prevent="canReorder && onDrop(index, $event)"
            >
              <td v-if="canReorder" class="col-drag">
                <span
                  class="drag-handle"
                  draggable="true"
                  title="Kéo để sắp xếp"
                  aria-label="Kéo để sắp xếp"
                  @dragstart.stop="onDragStart(index, $event)"
                  @dragend="onDragEnd"
                >
                  <i class="fa-solid fa-bars" />
                </span>
              </td>
              <td class="col-product">
                <div class="product-cell">
                  <div class="product-thumb">
                    <img
                      v-if="productThumb(item)"
                      :src="productThumb(item)"
                      :alt="item.name"
                      class="thumb-img"
                    />
                  </div>
                  <div class="product-text">
                    <div class="product-name">{{ item.name }}</div>
                    <div v-if="item.shortDescription" class="product-sub">
                      {{ item.shortDescription }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="col-sku">
                <code class="sku-text">{{ item.sku || '—' }}</code>
              </td>
              <td class="col-category">{{ getCategoryName(item.categoryId) }}</td>
              <td class="col-price">{{ displayPrice(item) }}</td>
              <td class="col-status">
                <span
                  :class="['status-tag', item.isActive ? 'status-visible' : 'status-hidden']"
                >
                  {{ item.isActive ? 'Hiển thị' : 'Ẩn' }}
                </span>
              </td>
              <td class="col-featured">
                <i
                  :class="[
                    item.isFeatured ? 'fa-solid fa-star star-active' : 'fa-regular fa-star star-inactive',
                  ]"
                />
              </td>
              <td class="col-date">{{ formatCreatedDate(item.createdAt) }}</td>
              <td class="col-actions">
                <RouterLink
                  :to="`/admin/products/${item.id}`"
                  class="icon-btn"
                  title="Sửa"
                  @mousedown.stop
                >
                  <i class="fa-regular fa-pen-to-square" />
                </RouterLink>
                <button
                  type="button"
                  class="icon-btn icon-btn-danger"
                  title="Xóa"
                  @mousedown.stop
                  @click="remove(item.id)"
                >
                  <i class="fa-regular fa-trash-can" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        Tổng {{ displayItems.length
        }}{{ hasActiveFilters ? ` / ${items.length}` : '' }} sản phẩm
        <template v-if="canReorder"> · Thứ tự lưu theo kéo thả</template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { productApi, type Product } from '@/services/api/products'
import { categoryApi, type Category } from '@/services/api/categories'
import { formatPrice } from '@/utils/format'
import { logger } from '@/utils/logger'
import { resolveMediaUrl } from '@/utils/mediaUrl'

const items = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref('')
const reordering = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

const dragFromIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const hasActiveFilters = computed(
  () =>
    !!searchQuery.value.trim() || !!categoryFilter.value || !!statusFilter.value,
)

const canReorder = computed(() => !hasActiveFilters.value)

const filteredItems = computed(() => {
  let list = items.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)),
    )
  }
  if (categoryFilter.value) {
    const catId = Number(categoryFilter.value)
    list = list.filter((p) => p.categoryId === catId)
  }
  if (statusFilter.value === 'active') {
    list = list.filter((p) => p.isActive)
  } else if (statusFilter.value === 'hidden') {
    list = list.filter((p) => !p.isActive)
  }
  return list
})

const displayItems = computed(() =>
  hasActiveFilters.value ? filteredItems.value : items.value,
)

function sortByOrder(list: Product[]): Product[] {
  return [...list].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id,
  )
}

function onDragStart(index: number, e: DragEvent) {
  dragFromIndex.value = index
  dragOverIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    const row = (e.target as HTMLElement).closest('tr')
    if (row) {
      e.dataTransfer.setDragImage(row, 24, 20)
    }
  }
}

function onDragOver(index: number, e: DragEvent) {
  if (dragFromIndex.value === null) return
  dragOverIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

async function onDrop(index: number, e: DragEvent) {
  let from = dragFromIndex.value
  if (from === null) {
    const raw = e.dataTransfer?.getData('text/plain')
    if (raw !== '') {
      const parsed = Number(raw)
      if (!Number.isNaN(parsed)) from = parsed
    }
  }
  onDragEnd()
  if (from === null || from === index) return

  const list = [...items.value]
  const [moved] = list.splice(from, 1)
  if (!moved) return
  list.splice(index, 0, moved)
  items.value = list.map((p, i) => ({ ...p, sortOrder: i }))

  await persistOrder()
}

function onDragEnd() {
  dragFromIndex.value = null
  dragOverIndex.value = null
}

async function persistOrder() {
  reordering.value = true
  const snapshot = items.value.map((p) => ({ ...p }))
  try {
    await productApi.reorder(
      items.value.map((p, index) => ({ id: p.id, sortOrder: index })),
    )
  } catch (e: unknown) {
    logger.error(e)
    items.value = snapshot
    alert('Không thể lưu thứ tự. Danh sách đã được khôi phục.')
  } finally {
    reordering.value = false
  }
}

function getCategoryName(categoryId: number): string {
  return categories.value.find((c) => c.id === categoryId)?.name ?? '—'
}

function productThumb(item: Product): string {
  const raw = item.thumbnail || item.images?.[0] || ''
  return resolveMediaUrl(raw)
}

function displayPrice(item: Product): string {
  if (item.isContactPrice) return 'Liên hệ'
  const value = item.salePrice ?? item.price
  return formatPrice(value)
}

function formatCreatedDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN')
}

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    const [products, cats] = await Promise.all([
      productApi.listAdmin(),
      categoryApi.listAdmin(),
    ])
    items.value = sortByOrder(products)
    categories.value = cats
  } catch (e: unknown) {
    logger.error(e)
    error.value = 'Không thể tải danh sách sản phẩm.'
    items.value = []
  } finally {
    loading.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Xóa sản phẩm này?')) return
  try {
    await productApi.remove(id)
    items.value = items.value
      .filter((x) => x.id !== id)
      .map((p, index) => ({ ...p, sortOrder: index }))
    if (canReorder.value) {
      await persistOrder()
    }
  } catch (e: unknown) {
    logger.error(e)
    alert('Xóa thất bại.')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.products-panel {
  margin-top: 1.5rem;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.75rem;
}

@media (min-width: 1024px) {
  .toolbar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.toolbar-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 1024px) {
  .toolbar-filters {
    width: auto;
  }
}

.search-wrap {
  position: relative;
  width: 100%;
}

@media (min-width: 640px) {
  .search-wrap {
    width: 16rem;
  }
}

.filter-input {
  width: 100%;
  background: rgba(249, 250, 251, 0.5);
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #4b5563;
}

.filter-input:focus {
  outline: none;
  border-color: #92400e;
}

.search-icon {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.6875rem;
  color: #9ca3af;
  pointer-events: none;
}

.select-wrap {
  position: relative;
  width: 100%;
}

@media (min-width: 640px) {
  .select-wrap:nth-of-type(2) {
    width: 11rem;
  }

  .select-wrap:nth-of-type(3) {
    width: 10rem;
  }
}

.filter-select {
  width: 100%;
  appearance: none;
  background: rgba(249, 250, 251, 0.5);
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #4b5563;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #92400e;
}

.select-icon {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.5625rem;
  color: #9ca3af;
  pointer-events: none;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-end;
  background: #5c3c24;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: background 0.2s;
  white-space: nowrap;
}

@media (min-width: 1024px) {
  .btn-primary {
    align-self: auto;
  }
}

.btn-primary:hover {
  background: #492f1b;
}

.btn-primary i {
  font-size: 0.625rem;
}

.state-box {
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
}

.state-error {
  color: #b91c1c;
}

.table-scroll {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.data-table thead tr {
  border-bottom: 1px solid #f3f4f6;
  background: rgba(249, 250, 251, 0.4);
  color: #9ca3af;
  font-size: 0.6875rem;
  font-weight: 600;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  vertical-align: middle;
}

.data-table tbody tr {
  border-bottom: 1px solid #f9fafb;
  color: #374151;
  font-weight: 500;
  transition: background 0.15s;
}

.data-row.row-dragging {
  opacity: 0.45;
}

.data-row.row-drag-over {
  background: rgba(254, 243, 199, 0.45);
  box-shadow: inset 0 2px 0 #d97706;
}

.reorder-hint {
  margin: 0;
  font-size: 0.6875rem;
  color: #78350f;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.reorder-hint--muted {
  color: #9ca3af;
}

.col-drag {
  width: 2.5rem;
  padding-left: 0.5rem !important;
  padding-right: 0.25rem !important;
}

.drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: #9ca3af;
  cursor: grab;
  border-radius: 0.25rem;
  user-select: none;
  -webkit-user-select: none;
}

.drag-handle:hover {
  color: #78350f;
  background: #f3f4f6;
}

.drag-handle:active {
  cursor: grabbing;
}

.col-product {
  min-width: 14rem;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.product-thumb {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  background: #f3f4f6;
  border-radius: 0.25rem;
  overflow: hidden;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.product-sub {
  font-size: 0.625rem;
  font-weight: 400;
  color: #9ca3af;
  margin-top: 0.125rem;
  line-height: 1.3;
}

.col-sku {
  width: 8rem;
}

.sku-text {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  padding: 0;
}

.col-category {
  width: 8rem;
  color: #4b5563;
}

.col-price {
  width: 8rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

.col-status {
  width: 6rem;
}

.status-tag {
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 0.125rem;
}

.status-visible {
  background: #ecfdf5;
  color: #047857;
}

.status-hidden {
  background: #fef2f2;
  color: #dc2626;
}

.col-featured {
  width: 5rem;
  text-align: center;
}

.star-active {
  color: #f59e0b;
  font-size: 0.75rem;
}

.star-inactive {
  color: #d1d5db;
  font-size: 0.75rem;
}

.col-date {
  width: 7rem;
  font-size: 0.6875rem;
  color: #9ca3af;
}

.col-actions {
  width: 7rem;
  text-align: center;
  white-space: nowrap;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background: #fff;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  text-decoration: none;
  vertical-align: middle;
  margin: 0 0.125rem;
}

.icon-btn:hover {
  color: #78350f;
  border-color: rgba(120, 53, 15, 0.3);
}

.icon-btn-danger:hover {
  color: #dc2626;
  border-color: #fecaca;
}

.table-footer {
  padding-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}
</style>
