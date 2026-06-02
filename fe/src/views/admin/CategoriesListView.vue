<template>
  <div class="categories-panel">
    <div class="panel-head">
      <div>
        <h2>Loại sản phẩm</h2>
        <p>Kéo thả để sắp xếp thứ tự hiển thị</p>
      </div>
      <RouterLink to="/admin/categories/new" class="btn-primary">
        <i class="fa-solid fa-plus" />
        Thêm loại sản phẩm
      </RouterLink>
    </div>

    <div v-if="loading" class="state-box">Đang tải...</div>
    <div v-else-if="error" class="state-box state-error">{{ error }}</div>
    <div v-else-if="items.length === 0" class="state-box">Chưa có loại sản phẩm.</div>

    <template v-else>
      <p v-if="reordering" class="reorder-hint">
        <i class="fa-solid fa-spinner fa-spin" />
        Đang lưu thứ tự...
      </p>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-drag" aria-label="Sắp xếp" />
              <th>Tên loại sản phẩm</th>
              <th class="col-slug">Slug</th>
              <th class="col-count">Số lượng sản phẩm</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-actions">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              class="data-row"
              :class="{
                'row-dragging': dragFromIndex === index,
                'row-drag-over': dragOverIndex === index && dragFromIndex !== index,
              }"
              @dragover.prevent="onDragOver(index, $event)"
              @dragenter.prevent="onDragOver(index, $event)"
              @drop.prevent="onDrop(index, $event)"
            >
              <td class="col-drag">
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
              <td class="col-name">
                <div class="category-cell">
                  <div class="category-thumb">
                    <img
                      v-if="item.thumbnail"
                      :src="resolveMediaUrl(item.thumbnail)"
                      :alt="item.name"
                      class="thumb-img"
                    />
                    <i v-else class="fa-regular fa-images thumb-placeholder" />
                  </div>
                  <div class="category-text">
                    <div class="category-name">{{ item.name }}</div>
                    <div v-if="item.description" class="category-sub">
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
                  :to="`/admin/categories/${item.id}`"
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
        Tổng {{ items.length }} loại sản phẩm · Thứ tự lưu theo cột kéo thả
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { categoryApi, type Category } from '@/services/api/categories'
import { logger } from '@/utils/logger'
import { resolveMediaUrl } from '@/utils/mediaUrl'

const items = ref<Category[]>([])
const loading = ref(true)
const error = ref('')
const reordering = ref(false)

const dragFromIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function sortByOrder(list: Category[]): Category[] {
  return [...list].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0) || a.id - b.id,
  )
}

function truncateDescription(text: string, max = 72): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 3)}...`
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
  items.value = list.map((cat, i) => ({ ...cat, orderIndex: i }))

  await persistOrder()
}

function onDragEnd() {
  dragFromIndex.value = null
  dragOverIndex.value = null
}

async function persistOrder() {
  reordering.value = true
  const snapshot = items.value.map((cat) => ({ ...cat }))
  try {
    await categoryApi.reorder(
      items.value.map((cat, index) => ({ id: cat.id, orderIndex: index })),
    )
  } catch (e: unknown) {
    logger.error(e)
    items.value = snapshot
    alert('Không thể lưu thứ tự. Danh sách đã được khôi phục.')
  } finally {
    reordering.value = false
  }
}

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    items.value = sortByOrder(await categoryApi.listAdmin())
  } catch (e: unknown) {
    logger.error(e)
    error.value = 'Không thể tải danh sách loại sản phẩm.'
    items.value = []
  } finally {
    loading.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Xóa loại sản phẩm này?')) return
  try {
    await categoryApi.remove(id)
    items.value = items.value
      .filter((x) => x.id !== id)
      .map((cat, index) => ({ ...cat, orderIndex: index }))
    await persistOrder()
  } catch (e: unknown) {
    logger.error(e)
    alert('Xóa thất bại. Có thể loại này còn sản phẩm liên kết.')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.categories-panel {
  margin-top: 1.5rem;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 1.25rem;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.panel-head h2 {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel-head p {
  margin: 0.125rem 0 0;
  font-size: 0.6875rem;
  color: #9ca3af;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
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

.btn-primary:hover {
  background: #492f1b;
}

.btn-primary i {
  font-size: 0.625rem;
}

.reorder-hint {
  margin: 0 0 0.75rem;
  font-size: 0.6875rem;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 0.375rem;
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

.data-row {
  border-bottom: 1px solid #f9fafb;
  color: #374151;
  font-weight: 500;
  transition: background 0.15s;
}

.data-row:hover {
  background: rgba(249, 250, 251, 0.3);
}

.data-row.row-dragging {
  opacity: 0.45;
}

.data-row.row-drag-over {
  background: #f5f2eb;
  box-shadow: inset 0 2px 0 var(--color-primary);
}

.col-drag {
  width: 2.5rem;
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.drag-handle {
  user-select: none;
  -webkit-user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: #9ca3af;
  cursor: grab;
  border-radius: 0.25rem;
  transition: color 0.15s, background 0.15s;
}

.drag-handle:hover {
  color: var(--color-primary);
  background: #f5f2eb;
}

.drag-handle:active {
  cursor: grabbing;
}

.col-name {
  min-width: 14rem;
}

.category-cell {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.category-thumb {
  width: 2rem;
  height: 2rem;
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
  font-size: 0.75rem;
  color: #d1d5db;
}

.category-name {
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.category-sub {
  font-size: 0.625rem;
  font-weight: 400;
  color: #9ca3af;
  margin-top: 0.125rem;
  line-height: 1.3;
}

.col-slug {
  min-width: 10rem;
  max-width: 16rem;
}

.slug-text {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.125rem;
  word-break: break-all;
}

.col-count {
  width: 12rem;
  color: #4b5563;
}

.col-status {
  width: 8rem;
}

.col-actions {
  width: 8rem;
  text-align: center;
  white-space: nowrap;
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
  background: #f3f4f6;
  color: #6b7280;
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
  font-size: 0.6875rem;
  color: #9ca3af;
}
</style>
