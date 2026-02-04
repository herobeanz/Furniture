<template>
  <div class="inquiries-list">
    <h1>Yêu cầu liên hệ</h1>
    <div class="toolbar">
      <select v-model="statusFilter" class="filter-select">
        <option value="">Tất cả trạng thái</option>
        <option value="pending">pending</option>
        <option value="contacted">contacted</option>
        <option value="completed">completed</option>
        <option value="cancelled">cancelled</option>
      </select>
    </div>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="items.length === 0">Chưa có yêu cầu.</div>
    <table v-else class="data-table">
      <thead>
        <tr>
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
        <tr v-for="i in items" :key="i.id">
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
              <option value="pending">pending</option>
              <option value="contacted">contacted</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </td>
          <td>—</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import apiClient from '@/services/api.client'

const items = ref<any[]>([])
const loading = ref(true)
const statusFilter = ref('')

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN')
}

function truncate(text: string, len: number) {
  if (!text) return ''
  return text.length <= len ? text : text.slice(0, len) + '...'
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

async function updateStatus(id: string, status: string) {
  try {
    await apiClient.patch(`/inquiries/${id}/status`, { status })
    const item = items.value.find((x) => x.id === id)
    if (item) item.status = status
  } catch (e) {
    console.error(e)
  }
}

watch(statusFilter, fetchList)
watch(() => statusFilter.value, fetchList, { immediate: true })
</script>

<style scoped>
.inquiries-list h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.toolbar {
  margin-bottom: 1rem;
}
.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.data-table th {
  background: #f8f8f8;
  font-weight: 600;
  font-size: 0.8rem;
}
.cell-message {
  max-width: 200px;
}
.status-select {
  padding: 0.35rem 0.5rem;
  font-size: 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}
</style>
