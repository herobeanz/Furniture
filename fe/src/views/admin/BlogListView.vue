<template>
  <div class="blog-page">
    <div class="page-intro">
      <span class="page-eyebrow">Nội dung website</span>
      <h1>Quản lý Blog</h1>
      <p>Đăng bài, chỉnh sửa và quản lý nội dung hiển thị trên trang Blog công khai.</p>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <i class="fa-regular fa-newspaper stat-icon" />
        <div>
          <h4>Tổng bài viết</h4>
          <p>{{ stats.total }} bài</p>
        </div>
      </div>
      <div class="stat-card">
        <i class="fa-solid fa-eye stat-icon" />
        <div>
          <h4>Đang hiển thị</h4>
          <p>{{ stats.visible }} bài</p>
        </div>
      </div>
      <div class="stat-card">
        <i class="fa-solid fa-star stat-icon" />
        <div>
          <h4>Nổi bật</h4>
          <p>{{ stats.featured }} bài</p>
        </div>
      </div>
      <div class="stat-card">
        <i class="fa-regular fa-eye-slash stat-icon" />
        <div>
          <h4>Đang ẩn</h4>
          <p>{{ stats.hidden }} bài</p>
        </div>
      </div>
    </div>

    <div class="blog-panel">
      <div class="panel-head">
        <div class="toolbar-filters">
          <div class="search-wrap">
            <input
              v-model="searchQuery"
              type="text"
              class="filter-input"
              placeholder="Tìm kiếm blog..."
            />
            <i class="fa-solid fa-magnifying-glass search-icon" />
          </div>
          <div class="select-wrap">
            <select v-model="categoryFilter" class="filter-select">
              <option value="">Tất cả danh mục</option>
              <option v-for="cat in categoryOptions" :key="cat" :value="cat">
                {{ getBlogCategoryStyle(cat).label }}
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
          <div class="date-range-wrap">
            <input
              v-model="dateFrom"
              type="date"
              class="filter-input filter-date"
              title="Từ ngày"
            />
            <span class="date-sep">–</span>
            <input
              v-model="dateTo"
              type="date"
              class="filter-input filter-date"
              title="Đến ngày"
            />
            <i class="fa-regular fa-calendar calendar-icon" />
          </div>
        </div>
        <RouterLink to="/admin/blog/new" class="btn-primary">
          <i class="fa-solid fa-plus" />
          Thêm bài viết
        </RouterLink>
      </div>

      <div v-if="loading" class="state-box">Đang tải...</div>
      <div v-else-if="error" class="state-box state-error">{{ error }}</div>
      <div v-else-if="filteredItems.length === 0" class="state-box">
        {{ items.length === 0 ? 'Chưa có bài viết nào.' : 'Không tìm thấy bài viết phù hợp.' }}
      </div>

      <template v-else>
        <p v-if="reordering" class="reorder-hint">
          <i class="fa-solid fa-spinner fa-spin" />
          Đang lưu thứ tự...
        </p>
        <p v-else-if="hasActiveFilters" class="reorder-hint reorder-hint--muted">
          Bỏ bộ lọc để kéo thả sắp xếp thứ tự bài viết.
        </p>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th v-if="canReorder" class="col-drag" aria-label="Sắp xếp" />
                <th class="col-thumb">Ảnh đại diện</th>
                <th class="col-title">Tiêu đề / Tóm tắt</th>
                <th class="col-category">Danh mục</th>
                <th class="col-author">Tác giả</th>
                <th class="col-status">Trạng thái</th>
                <th class="col-featured">Nổi bật</th>
                <th class="col-date">Ngày đăng</th>
                <th class="col-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(post, index) in displayItems"
                :key="post.id"
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
                <td class="col-thumb">
                  <div class="thumb-box">
                    <img
                      v-if="post.thumbnail"
                      :src="resolveMediaUrl(post.thumbnail)"
                      :alt="post.title"
                      class="thumb-img"
                    />
                    <i v-else class="fa-regular fa-image thumb-placeholder" />
                  </div>
                </td>
                <td class="col-title">
                  <div class="post-title">{{ post.title }}</div>
                  <div v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</div>
                </td>
                <td class="col-category">
                  <span
                    v-if="post.category"
                    :class="['cat-tag', getBlogCategoryStyle(post.category).className]"
                  >
                    {{ getBlogCategoryStyle(post.category).label }}
                  </span>
                  <span v-else class="cat-tag cat-neutral">—</span>
                </td>
                <td class="col-author">{{ post.author || 'Admin' }}</td>
                <td class="col-status">
                  <span
                    :class="['status-tag', post.isActive ? 'status-visible' : 'status-hidden']"
                  >
                    {{ post.isActive ? 'Hiển thị' : 'Ẩn' }}
                  </span>
                </td>
                <td class="col-featured">
                  <i
                    :class="[
                      post.isFeatured
                        ? 'fa-solid fa-star star-active'
                        : 'fa-regular fa-star star-inactive',
                    ]"
                  />
                </td>
                <td class="col-date">
                  <template v-if="publishedDisplay(post).date">
                    {{ publishedDisplay(post).date }}
                    <span class="date-time">{{ publishedDisplay(post).time }}</span>
                  </template>
                  <span v-else>—</span>
                </td>
                <td class="col-actions">
                  <RouterLink
                    :to="`/admin/blog/${post.id}`"
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
                    @click="removePost(post)"
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
          }}{{ hasActiveFilters ? ` / ${items.length}` : '' }} bài viết
          <template v-if="canReorder"> · Thứ tự lưu theo kéo thả</template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { blogApi, type BlogPost } from '@/services/api/blog'
import { getBlogCategoryStyle } from '@/constants/blog-categories'
import { logger } from '@/utils/logger'
import { resolveMediaUrl } from '@/utils/mediaUrl'

const items = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref('')
const reordering = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const dragFromIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const hasActiveFilters = computed(
  () =>
    !!searchQuery.value.trim() ||
    !!categoryFilter.value ||
    !!statusFilter.value ||
    !!dateFrom.value ||
    !!dateTo.value,
)

const canReorder = computed(() => !hasActiveFilters.value)

const stats = computed(() => {
  const list = items.value
  return {
    total: list.length,
    visible: list.filter((p) => p.isActive).length,
    featured: list.filter((p) => p.isFeatured).length,
    hidden: list.filter((p) => !p.isActive).length,
  }
})

const categoryOptions = computed(() => {
  const set = new Set<string>()
  for (const post of items.value) {
    if (post.category?.trim()) set.add(post.category.trim())
  }
  return Array.from(set).sort((a, b) =>
    getBlogCategoryStyle(a).label.localeCompare(getBlogCategoryStyle(b).label, 'vi'),
  )
})

function postDateValue(post: BlogPost): Date | null {
  const raw = post.publishedAt || post.createdAt
  if (!raw) return null
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

const filteredItems = computed(() => {
  let list = items.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)),
    )
  }
  if (categoryFilter.value) {
    list = list.filter((p) => p.category === categoryFilter.value)
  }
  if (statusFilter.value === 'active') {
    list = list.filter((p) => p.isActive)
  } else if (statusFilter.value === 'hidden') {
    list = list.filter((p) => !p.isActive)
  }
  if (dateFrom.value) {
    const from = new Date(dateFrom.value)
    from.setHours(0, 0, 0, 0)
    list = list.filter((p) => {
      const d = postDateValue(p)
      return d ? d >= from : false
    })
  }
  if (dateTo.value) {
    const to = new Date(dateTo.value)
    to.setHours(23, 59, 59, 999)
    list = list.filter((p) => {
      const d = postDateValue(p)
      return d ? d <= to : false
    })
  }
  return list
})

const displayItems = computed(() =>
  hasActiveFilters.value ? filteredItems.value : items.value,
)

function sortByOrder(list: BlogPost[]): BlogPost[] {
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
    await blogApi.reorder(
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

function publishedDisplay(post: BlogPost): { date: string; time: string } {
  const d = postDateValue(post)
  if (!d) return { date: '', time: '' }
  return {
    date: d.toLocaleDateString('vi-VN'),
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  }
}

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    items.value = sortByOrder(await blogApi.getAdminPosts())
  } catch (e: unknown) {
    logger.error(e)
    error.value = 'Không thể tải danh sách bài viết.'
    items.value = []
  } finally {
    loading.value = false
  }
}

async function removePost(post: BlogPost) {
  if (!confirm(`Bạn có chắc muốn xóa bài viết "${post.title}"?`)) return
  try {
    await blogApi.deletePost(post.id)
    items.value = items.value
      .filter((p) => p.id !== post.id)
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
.blog-page {
  padding: 1.5rem 2rem 2rem;
}

.page-eyebrow {
  display: block;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 0.375rem;
}

.page-intro h1 {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.page-intro p {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
  max-width: 32rem;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1.25rem;
}

@media (min-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  padding: 0.875rem 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  font-size: 1.125rem;
  color: var(--color-primary);
  flex-shrink: 0;
}

.stat-card h4 {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #111827;
}

.stat-card p {
  margin: 0.125rem 0 0;
  font-size: 0.625rem;
  color: #9ca3af;
}

.blog-panel {
  margin-top: 1.25rem;
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
    align-items: flex-start;
  }
}

.toolbar-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.search-wrap {
  position: relative;
  width: 100%;
}

@media (min-width: 640px) {
  .search-wrap {
    width: 14rem;
  }
}

.filter-input {
  width: 100%;
  background: rgba(249, 250, 251, 0.6);
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #4b5563;
}

.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-icon {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.625rem;
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
  background: rgba(249, 250, 251, 0.6);
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #4b5563;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.select-icon {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.5rem;
  color: #9ca3af;
  pointer-events: none;
}

.date-range-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
}

@media (min-width: 640px) {
  .date-range-wrap {
    width: auto;
  }
}

.filter-date {
  padding-right: 0.5rem;
  flex: 1;
  min-width: 0;
}

@media (min-width: 640px) {
  .filter-date {
    width: 7.5rem;
    flex: none;
  }
}

.date-sep {
  color: #9ca3af;
  flex-shrink: 0;
}

.calendar-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.625rem;
  color: #9ca3af;
  pointer-events: none;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-end;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary i {
  font-size: 0.625rem;
}

@media (min-width: 1024px) {
  .btn-primary {
    align-self: auto;
    flex-shrink: 0;
  }
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
  margin: 0 -0.25rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.data-table thead tr {
  border-bottom: 1px solid #f3f4f6;
  background: #faf9f6;
  color: #9ca3af;
  font-size: 0.6875rem;
  font-weight: 600;
}

.data-table th,
.data-table td {
  padding: 1rem;
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
  box-shadow: inset 0 2px 0 var(--color-primary);
}

.reorder-hint {
  margin: 0 0 0.75rem;
  font-size: 0.6875rem;
  color: var(--color-primary);
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
  color: var(--color-primary);
  background: #f3f4f6;
}

.drag-handle:active {
  cursor: grabbing;
}

.col-thumb {
  width: 6rem;
}

.thumb-box {
  width: 5rem;
  height: 3rem;
  background: #f3f4f6;
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
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
  font-size: 1rem;
  color: #d1d5db;
}

.col-title {
  max-width: 20rem;
}

.post-title {
  font-weight: 700;
  color: #111827;
  font-size: 0.75rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-excerpt {
  font-size: 0.625rem;
  font-weight: 400;
  color: #9ca3af;
  margin-top: 0.125rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.col-category {
  width: 7rem;
}

.cat-tag {
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 0.125rem;
  white-space: nowrap;
}

.cat-orange {
  background: #fff7ed;
  color: #c2410c;
}

.cat-blue {
  background: #eff6ff;
  color: #1d4ed8;
}

.cat-emerald {
  background: #ecfdf5;
  color: #047857;
}

.cat-purple {
  background: #faf5ff;
  color: #7e22ce;
}

.cat-pink {
  background: #fdf2f8;
  color: #be185d;
}

.cat-teal {
  background: #f0fdfa;
  color: #0f766e;
}

.cat-neutral {
  background: #f3f4f6;
  color: #6b7280;
}

.col-author {
  width: 6rem;
  font-size: 0.6875rem;
  color: #4b5563;
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
  width: 8rem;
  font-size: 0.6875rem;
  color: #6b7280;
}

.date-time {
  color: #9ca3af;
  margin-left: 0.125rem;
}

.col-actions {
  width: 6rem;
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  font-size: 0.6875rem;
}

.icon-btn:hover {
  color: var(--color-primary);
  border-color: rgba(146, 64, 14, 0.3);
}

.icon-btn-danger:hover {
  color: #dc2626;
  border-color: #fecaca;
}

.table-footer {
  padding: 1rem 0 0;
  margin-top: 1rem;
  border-top: 1px solid #f9fafb;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}
</style>
