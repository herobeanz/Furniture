<template>
  <div class="products-list">
    <div class="page-header">
      <h1>Sản phẩm</h1>
      <RouterLink to="/admin/products/new" class="btn btn-primary">Thêm sản phẩm</RouterLink>
    </div>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="items.length === 0">Chưa có sản phẩm.</div>
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Tên</th>
          <th>Slug</th>
          <th>Giá</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in items" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.slug }}</td>
          <td>{{ formatPrice(p.price) }}</td>
          <td>{{ p.status }}</td>
          <td>
            <RouterLink :to="'/admin/products/' + p.id" class="link">Sửa</RouterLink>
            <button type="button" class="btn-link danger" @click="remove(p.id)">Xóa</button>
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
import { formatPrice } from '@/utils/format'

const items = ref<any[]>([])
const loading = ref(true)

async function fetchList() {
  loading.value = true
  try {
    const res = await apiClient.get('/products/list/all')
    items.value = Array.isArray(res) ? res : []
  } finally {
    loading.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Xóa sản phẩm này?')) return
  try {
    await apiClient.delete(`/products/${id}`)
    items.value = items.value.filter((x) => x.id !== id)
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchList)
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
.link, .btn-link {
  margin-right: 0.75rem;
  font-size: 0.875rem;
}
.btn-link.danger {
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.btn-link.danger:hover {
  text-decoration: underline;
}
</style>
