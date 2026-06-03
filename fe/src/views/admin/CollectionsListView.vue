<template>
  <div class="collections-page">
    <div class="page-intro">
      <h1>Quản lý bộ sưu tập</h1>
      <p>Những thiết kế nổi bật hiển thị trên trang chủ và menu Bộ sưu tập.</p>
    </div>

    <div class="collections-panel">
      <div class="panel-head">
        <div class="toolbar-filters">
          <div class="search-wrap">
            <input
              v-model="searchQuery"
              type="text"
              class="filter-input"
              placeholder="Tìm kiếm bộ sưu tập..."
            />
            <i class="fa-solid fa-magnifying-glass search-icon" />
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
        <RouterLink to="/admin/collections/new" class="btn-primary">
          <i class="fa-solid fa-plus" />
          Thêm bộ sưu tập
        </RouterLink>
      </div>

      <div v-if="loading" class="state-box">Đang tải...</div>
      <div v-else-if="error" class="state-box state-error">{{ error }}</div>
      <div v-else-if="displayItems.length === 0" class="state-box">
        {{ items.length === 0 ? 'Chưa có bộ sưu tập.' : 'Không tìm thấy bộ sưu tập phù hợp.' }}
      </div>

      <template v-else>
        <p v-if="reordering" class="reorder-hint">
          <i class="fa-solid fa-spinner fa-spin" />
          Đang lưu thứ tự...
        </p>
        <p v-else-if="hasActiveFilters" class="reorder-hint reorder-hint--muted">
          Bỏ bộ lọc để kéo thả sắp xếp thứ tự bộ sưu tập.
        </p>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th v-if="canReorder" class="col-drag" aria-label="Sắp xếp" />
                <th class="col-collection">Bộ sưu tập</th>
                <th class="col-slug">Slug</th>
                <th class="col-count">Số sản phẩm</th>
                <th class="col-status">Trạng thái</th>
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
                <td class="col-collection">
                  <div class="collection-cell">
                    <div class="collection-thumb">
                      <img
                        v-if="item.thumbnail"
                        :src="resolveMediaUrl(item.thumbnail)"
                        :alt="item.name"
                        class="thumb-img"
                      />
                      <i v-else class="fa-regular fa-images thumb-placeholder" />
                    </div>
                    <div class="collection-text">
                      <div class="collection-name">{{ item.name }}</div>
                      <div v-if="item.description" class="collection-sub">
                        {{ truncateDescription(item.description) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="col-slug">
                  <code class="slug-text">{{ item.slug }}</code>
                </td>
                <td class="col-count">{{ item.productCount ?? 0 }}</td>
                <td class="col-status">
                  <span
                    :class="['status-tag', item.isActive ? 'status-visible' : 'status-hidden']"
                  >
                    {{ item.isActive ? 'Hiển thị' : 'Ẩn' }}
                  </span>
                </td>
                <td class="col-actions">
                  <RouterLink
                    :to="`/admin/collections/${item.id}`"
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
                    @click="remove(item)"
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
          }}{{ hasActiveFilters ? ` / ${items.length}` : '' }} bộ sưu tập
          <template v-if="canReorder"> · Thứ tự lưu theo kéo thả</template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { collectionApi, type Collection } from '@/services/api/collections'
import { logger } from '@/utils/logger'
import { resolveMediaUrl } from '@/utils/mediaUrl'

const items = ref<Collection[]>([])
const loading = ref(true)
const error = ref('')
const reordering = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')

const dragFromIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const hasActiveFilters = computed(
  () => !!searchQuery.value.trim() || !!statusFilter.value,
)

const canReorder = computed(() => !hasActiveFilters.value)

const filteredItems = computed(() => {
  let list = items.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)),
    )
  }
  if (statusFilter.value === 'active') {
    list = list.filter((c) => c.isActive)
  } else if (statusFilter.value === 'hidden') {
    list = list.filter((c) => !c.isActive)
  }
  return list
})

const displayItems = computed(() =>
  hasActiveFilters.value ? filteredItems.value : items.value,
)

function sortByOrder(list: Collection[]): Collection[] {
  return [...list].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0) || a.id - b.id,
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
  items.value = list.map((col, i) => ({ ...col, orderIndex: i }))

  await persistOrder()
}

function onDragEnd() {
  dragFromIndex.value = null
  dragOverIndex.value = null
}

async function persistOrder() {
  reordering.value = true
  const snapshot = items.value.map((col) => ({ ...col }))
  try {
    await collectionApi.reorder(
      items.value.map((col, index) => ({ id: col.id, orderIndex: index })),
    )
  } catch (e: unknown) {
    logger.error(e)
    items.value = snapshot
    alert('Không thể lưu thứ tự. Danh sách đã được khôi phục.')
  } finally {
    reordering.value = false
  }
}

function truncateDescription(text: string, max = 72): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 3)}...`
}

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    items.value = sortByOrder(await collectionApi.listAdmin())
  } catch (e: unknown) {
    logger.error(e)
    error.value = 'Không thể tải danh sách bộ sưu tập.'
    items.value = []
  } finally {
    loading.value = false
  }
}

async function remove(item: Collection) {
  if (!confirm(`Xóa bộ sưu tập "${item.name}"?`)) return
  try {
    await collectionApi.remove(item.id)
    items.value = items.value
      .filter((x) => x.id !== item.id)
      .map((col, index) => ({ ...col, orderIndex: index }))
    if (canReorder.value) {
      await persistOrder()
    }
  } catch (e: unknown) {
    logger.error(e)
    alert('Xóa thất bại. Có thể bộ sưu tập còn sản phẩm liên kết.')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.collections-page {
  padding: 1.5rem 2rem 2rem;
}

.page-intro h1 {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: var(--fs-card-title);
  font-weight: 700;
  color: #030712;
}

.page-intro p {
  margin: 0.375rem 0 0;
  font-size: var(--fs-body-sm);
  color: #9ca3af;
}

.collections-panel {
  margin-top: 1.5rem;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 1.25rem;
}

.panel-head {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 1024px) {
  .panel-head {
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
  font-size: var(--fs-body-sm);
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
  font-size: var(--fs-body-sm);
  color: #9ca3af;
  pointer-events: none;
}

.select-wrap {
  position: relative;
  width: 100%;
}

@media (min-width: 640px) {
  .select-wrap {
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
  font-size: var(--fs-body-sm);
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
  font-size: var(--fs-caption);
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
  font-size: var(--fs-body-sm);
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
  font-size: var(--fs-caption);
}

.reorder-hint {
  margin: 0 0 0.75rem;
  font-size: var(--fs-body-sm);
  color: #78350f;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.reorder-hint--muted {
  color: #9ca3af;
}

.state-box {
  padding: 2rem 1rem;
  text-align: center;
  font-size: var(--fs-body-sm);
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
  font-size: var(--fs-body-sm);
}

.data-table thead tr {
  border-bottom: 1px solid #f3f4f6;
  background: rgba(249, 250, 251, 0.4);
  color: #9ca3af;
  font-size: var(--fs-body-sm);
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

.col-collection {
  min-width: 14rem;
}

.collection-cell {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.collection-thumb {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  background: #f3f4f6;
  border-radius: 0.25rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  font-size: var(--fs-body-sm);
  color: #d1d5db;
}

.collection-name {
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.collection-sub {
  font-size: var(--fs-caption);
  font-weight: 400;
  color: #9ca3af;
  margin-top: 0.125rem;
  line-height: 1.35;
}

.col-slug {
  min-width: 8rem;
}

.slug-text {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.125rem;
  word-break: break-all;
}

.col-count {
  width: 6rem;
  color: #4b5563;
}

.col-status {
  width: 6rem;
}

.status-tag {
  font-size: var(--fs-caption);
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
  padding-top: 1rem;
  margin-top: 0.5rem;
  font-size: var(--fs-body-sm);
  color: #6b7280;
  font-weight: 500;
}
</style>
