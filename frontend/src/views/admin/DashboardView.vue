<template>
  <div class="dashboard">
    <h1>Tổng quan</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">{{ stats.products }}</span>
        <span class="stat-label">Sản phẩm</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.categories }}</span>
        <span class="stat-label">Danh mục</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.inquiries }}</span>
        <span class="stat-label">Yêu cầu</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.cms }}</span>
        <span class="stat-label">Trang CMS</span>
      </div>
    </div>
    <section class="recent-inquiries">
      <h2>Yêu cầu gần đây</h2>
      <div v-if="loading">Đang tải...</div>
      <div v-else-if="recent.length === 0">Chưa có yêu cầu.</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in recent" :key="i.id">
            <td>{{ formatDate(i.createdAt) }}</td>
            <td>{{ i.name }}</td>
            <td>{{ i.phone }}</td>
            <td><span class="badge">{{ i.status }}</span></td>
          </tr>
        </tbody>
      </table>
      <RouterLink to="/admin/inquiries" class="link-more">Xem tất cả →</RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import apiClient from '@/services/api.client'

const stats = ref({ products: 0, categories: 0, inquiries: 0, cms: 0 })
const recent = ref<any[]>([])
const loading = ref(true)

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN')
}

onMounted(async () => {
  try {
    const [productsRes, categoriesRes, inquiriesRes, cmsRes] = await Promise.all([
      apiClient.get('/products/list/all').catch(() => []),
      apiClient.get('/categories/list/all').catch(() => []),
      apiClient.get('/inquiries', { params: { limit: 5 } }).catch(() => ({ data: [], total: 0 })),
      apiClient.get('/cms').catch(() => []),
    ])
    stats.value = {
      products: Array.isArray(productsRes) ? (productsRes as any[]).length : 0,
      categories: Array.isArray(categoriesRes) ? (categoriesRes as any[]).length : 0,
      inquiries: (inquiriesRes as any).total ?? 0,
      cms: Array.isArray(cmsRes) ? (cmsRes as any[]).length : 0,
    }
    recent.value = (inquiriesRes as any).data ?? []
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: #fff;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
}
.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.recent-inquiries h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
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
.badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: #eee;
  border-radius: 4px;
}
.link-more {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}
</style>
