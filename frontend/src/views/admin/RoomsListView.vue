<template>
  <div class="rooms-list">
    <div class="page-header">
      <h1>Phòng</h1>
      <RouterLink to="/admin/rooms/new" class="btn btn-primary">Thêm phòng</RouterLink>
    </div>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="items.length === 0">Chưa có phòng.</div>
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Tên</th>
          <th>Slug</th>
          <th>Thứ tự</th>
          <th>Hiển thị</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in items" :key="r.id">
          <td>{{ r.name }}</td>
          <td><code>{{ r.slug }}</code></td>
          <td>{{ r.orderIndex }}</td>
          <td>{{ r.isActive ? 'Có' : 'Ẩn' }}</td>
          <td>
            <RouterLink :to="'/admin/rooms/' + r.id" class="link">Sửa</RouterLink>
            <button type="button" class="link btn-link" @click="confirmRemove(r)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import apiClient from '@/services/api.client'

const items = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/rooms/list/all')
    items.value = Array.isArray(res) ? res : []
  } finally {
    loading.value = false
  }
})

function confirmRemove(r: any) {
  if (!confirm(`Xóa phòng "${r.name}"?`)) return
  apiClient.delete(`/rooms/${r.id}`).then(() => {
    items.value = items.value.filter((x) => x.id !== r.id)
  }).catch((e) => {
    console.error(e)
    alert('Xóa thất bại.')
  })
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.page-header h1 {
  font-size: 1.5rem;
  margin: 0;
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
.link {
  margin-right: 0.75rem;
  font-size: 0.875rem;
}
.btn-link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: inherit;
  text-decoration: underline;
}
.btn-link:hover {
  color: var(--color-primary);
}
code {
  font-size: 0.8rem;
  background: #f0f0f0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}
</style>
