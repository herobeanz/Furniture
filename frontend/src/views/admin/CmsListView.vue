<template>
  <div class="cms-list">
    <div class="page-header">
      <h1>Trang CMS</h1>
      <RouterLink to="/admin/cms/new" class="btn btn-primary">Thêm trang</RouterLink>
    </div>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="items.length === 0">Chưa có trang CMS.</div>
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Slug</th>
          <th>Tiêu đề</th>
          <th>Xuất bản</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in items" :key="p.id">
          <td>{{ p.slug }}</td>
          <td>{{ p.title }}</td>
          <td>{{ p.isPublished ? 'Có' : 'Không' }}</td>
          <td>
            <RouterLink :to="'/admin/cms/' + p.id" class="link">Sửa</RouterLink>
            <a :href="pageUrl(p.slug)" target="_blank" rel="noopener" class="link">Xem</a>
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

function pageUrl(slug: string) {
  const base = window.location.origin + import.meta.env.BASE_URL
  return `${base.replace(/\/$/, '')}/page/${slug}`
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/cms')
    items.value = Array.isArray(res) ? res : []
  } finally {
    loading.value = false
  }
})
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
</style>
