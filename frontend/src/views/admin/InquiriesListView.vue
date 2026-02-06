<template>
  <div class="inquiries-list">
    <div class="list-header">
      <h1>Quản lý Yêu cầu</h1>
      <div class="header-actions">
        <button type="button" class="btn-delete" @click="handleBulkDelete" :disabled="selectedItems.length === 0">
          <span class="btn-icon">−</span>
          Xóa
        </button>
        <select v-model="statusFilter" class="filter-select">
          <option value="">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="contacted">Đã liên hệ</option>
          <option value="done">Hoàn thành</option>
        </select>
      </div>
    </div>
    <div v-if="loading" class="loading-state">Đang tải...</div>
    <div v-else-if="items.length === 0" class="empty-state">Chưa có yêu cầu.</div>
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            </th>
            <th>Ngày</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in paginatedItems" :key="i.id">
            <td>
              <input type="checkbox" :checked="selectedItems.includes(i.id)" @change="toggleSelect(i.id)" />
            </td>
            <td>{{ formatDate(i.createdAt) }}</td>
            <td>{{ i.name }}</td>
            <td>{{ i.phone }}</td>
            <td>{{ i.email || '—' }}</td>
            <td class="cell-message">{{ truncate(i.message, 50) }}</td>
            <td>
              <select
                :value="i.status"
                class="status-select"
                @change="updateStatus(i.id, ($event.target as HTMLSelectElement).value)"
              >
                <option value="new">Mới</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="done">Hoàn thành</option>
              </select>
            </td>
            <td class="actions-cell">
              <button type="button" class="action-btn view" @click="viewDetail(i)" title="Xem chi tiết">
                👁️
              </button>
              <button type="button" class="action-btn cart" @click="viewCart(i)" title="Xem giỏ hàng">
                🛒
              </button>
              <a :href="`tel:${i.phone}`" class="action-btn phone" title="Gọi điện">📞</a>
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
import { ref, computed, watch } from 'vue'
import apiClient from '@/services/api.client'
import { ITEMS_PER_PAGE } from '@/constants/admin'

const items = ref<any[]>([])
const loading = ref(true)
const statusFilter = ref('')
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

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN')
}

function truncate(text: string, len: number) {
  if (!text) return ''
  return text.length <= len ? text : text.slice(0, len) + '...'
}

function viewDetail(inquiry: any) {
  const detail = [
    `Họ tên: ${inquiry.name}`,
    `Điện thoại: ${inquiry.phone}`,
    inquiry.email ? `Email: ${inquiry.email}` : '',
    `Nội dung: ${inquiry.message}`,
    inquiry.product ? `Sản phẩm: ${inquiry.product.name}` : '',
    `Nguồn: ${getSourceLabel(inquiry.source)}`,
    `Trạng thái: ${getStatusLabel(inquiry.status)}`,
    `Ngày tạo: ${formatDate(inquiry.createdAt)}`,
  ].filter(Boolean).join('\n')
  alert(detail)
}

function viewCart(inquiry: any) {
  // Hiển thị thông tin giỏ hàng/đơn hàng từ inquiry
  const cartInfo = [
    `Khách hàng: ${inquiry.name}`,
    `SĐT: ${inquiry.phone}`,
    inquiry.email ? `Email: ${inquiry.email}` : '',
    `---`,
    `Nội dung yêu cầu:`,
    inquiry.message,
    `---`,
    inquiry.product ? `Sản phẩm quan tâm: ${inquiry.product.name}` : 'Không có sản phẩm cụ thể',
    `Nguồn: ${getSourceLabel(inquiry.source)}`,
    `Trạng thái: ${getStatusLabel(inquiry.status)}`,
    `Ngày: ${formatDate(inquiry.createdAt)}`,
  ].filter(Boolean).join('\n')
  alert(cartInfo)
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    new: 'Mới',
    contacted: 'Đã liên hệ',
    done: 'Hoàn thành',
  }
  return labels[status] || status
}

function getSourceLabel(source: string) {
  const labels: Record<string, string> = {
    product: 'Từ sản phẩm',
    contact: 'Từ trang liên hệ',
    facebook: 'Từ Facebook',
    zalo: 'Từ Zalo',
  }
  return labels[source] || source
}

async function fetchList() {
  loading.value = true
  try {
    const res = await apiClient.get('/inquiries', {
      params: { limit: 100, status: statusFilter.value || undefined },
    })
    items.value = (res as any).data ?? []
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
  if (!confirm(`Xóa ${selectedItems.value.length} yêu cầu đã chọn?`)) return
  try {
    await Promise.all(selectedItems.value.map((id) => apiClient.delete(`/inquiries/${id}`)))
    items.value = items.value.filter((x) => !selectedItems.value.includes(x.id))
    selectedItems.value = []
  } catch (e) {
    console.error(e)
    alert('Xóa thất bại.')
  }
}

async function updateStatus(id: number, status: string) {
  try {
    await apiClient.patch(`/inquiries/${id}/status`, { status })
    const item = items.value.find((x) => x.id === id)
    if (item) item.status = status
  } catch (e) {
    console.error(e)
    alert('Cập nhật thất bại.')
  }
}

watch(statusFilter, () => {
  currentPage.value = 1
  selectedItems.value = []
  fetchList()
})
watch(() => statusFilter.value, fetchList, { immediate: true })
</script>

<style scoped>
.inquiries-list {
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

.btn-icon {
  font-size: 1rem;
  font-weight: bold;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
}

.filter-select option {
  background: #1e293b;
  color: #fff;
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

.cell-message {
  max-width: 200px;
}

.status-select {
  padding: 0.35rem 0.5rem;
  font-size: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
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
  text-decoration: none;
}

.action-btn.view:hover {
  background: #dbeafe;
}

.action-btn.cart:hover {
  background: #fef3c7;
}

.action-btn.phone:hover {
  background: #dcfce7;
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
