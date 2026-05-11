<template>
  <div class="categories-list">
    <div class="list-header">
      <h1>Quản lý Danh mục</h1>
      <div class="header-actions">
        <button type="button" class="btn-delete" @click="handleBulkDelete" :disabled="selectedItems.length === 0">
          <span class="btn-icon">−</span>
          Xóa
        </button>
        <RouterLink to="/admin/categories/new" class="btn-add">
          <span class="btn-icon">+</span>
          Thêm danh mục mới
        </RouterLink>
      </div>
    </div>
    <div v-if="loading" class="loading-state">Đang tải...</div>
    <div v-else-if="items.length === 0" class="empty-state">Chưa có danh mục.</div>
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            </th>
            <th>Tên</th>
            <th>Slug</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in paginatedItems" :key="c.id">
            <td>
              <input type="checkbox" :checked="selectedItems.includes(c.id)" @change="toggleSelect(c.id)" />
            </td>
            <td>{{ c.name }}</td>
            <td><code>{{ c.slug }}</code></td>
            <td class="actions-cell">
              <RouterLink :to="'/admin/categories/' + c.id" class="action-btn edit" title="Sửa">
                ✏️
              </RouterLink>
              <button type="button" class="action-btn delete" @click="remove(c.id)" title="Xóa">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <div class="pagination-info">
          Hiển thị {{ paginatedItems.length }} trong tổng số {{ items.length }} mục
        </div>
        <div class="pagination-controls">
          <button type="button" class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            Previous
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import apiClient from '@/services/api/client'
import { ITEMS_PER_PAGE } from '@/constants/admin'

const items = ref<any[]>([])
const loading = ref(true)
const selectedItems = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = ITEMS_PER_PAGE

const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage))
const allSelected = computed(() => {
  if (items.value.length === 0) return false
  return paginatedItems.value.every((item) => selectedItems.value.includes(item.id))
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return items.value.slice(start, end)
})

async function fetchList() {
  loading.value = true
  try {
    const res = await apiClient.get('/categories/list/all')
    items.value = Array.isArray(res) ? res : []
  } finally {
    loading.value = false
  }
}

function toggleSelect(id: number) {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = paginatedItems.value.map((item) => item.id)
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    selectedItems.value = []
  }
}

async function handleBulkDelete() {
  if (selectedItems.value.length === 0) return
  if (!confirm(`Xóa ${selectedItems.value.length} danh mục đã chọn?`)) return
  try {
    await Promise.all(selectedItems.value.map((id) => apiClient.delete(`/categories/${id}`)))
    items.value = items.value.filter((x) => !selectedItems.value.includes(x.id))
    selectedItems.value = []
  } catch (e) {
    logger.error(e)
    alert('Xóa thất bại.')
  }
}

async function remove(id: number) {
  if (!confirm('Xóa danh mục này?')) return
  try {
    await apiClient.delete(`/categories/${id}`)
    items.value = items.value.filter((x) => x.id !== id)
  } catch (e) {
    logger.error(e)
    alert('Xóa thất bại.')
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.categories-list {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 0;
}

.list-header {
  background: #1e293b;
  color: #fff;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}

.list-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-delete {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.btn-delete:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-add {
  background: #16a34a;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #15803d;
}

.btn-icon {
  font-size: 1rem;
  font-weight: bold;
}

.loading-state,
.empty-state {
  background: #fff;
  padding: 2rem;
  text-align: center;
  color: #666;
}

.table-container {
  background: #fff;
  padding: 1.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.data-table input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit:hover {
  background: #fef3c7;
}

.action-btn.delete:hover {
  background: #fee2e2;
}

code {
  font-size: 0.8rem;
  background: #f0f0f0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.pagination {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  background: #fff;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

.page-btn.active:hover {
  background: #2563eb;
}
</style>
