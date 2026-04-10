<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>Dashboard</h1>
    </div>
    <div class="summary-cards">
      <div class="summary-card card-earnings">
        <div class="card-content">
          <div class="card-value">{{ stats.products }}</div>
          <div class="card-label">Sản phẩm</div>
        </div>
        <div class="card-icon">📊</div>
        <div class="card-update">update: {{ currentTime }}</div>
      </div>
      <div class="summary-card card-views">
        <div class="card-content">
          <div class="card-value">{{ stats.inquiries }}+</div>
          <div class="card-label">Yêu cầu</div>
        </div>
        <div class="card-icon">📋</div>
        <div class="card-update">update: {{ currentTime }}</div>
      </div>
      <div class="summary-card card-tasks">
        <div class="card-content">
          <div class="card-value">{{ stats.categories }}</div>
          <div class="card-label">Danh mục</div>
        </div>
        <div class="card-icon">📁</div>
        <div class="card-update">update: {{ currentTime }}</div>
      </div>
      <div class="summary-card card-downloads">
        <div class="card-content">
          <div class="card-value">{{ stats.cms }}</div>
          <div class="card-label">Trang CMS</div>
        </div>
        <div class="card-icon">📄</div>
        <div class="card-update">update: {{ currentTime }}</div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAdminDashboard } from '@/composables/admin/useAdminDashboard'

// Container component: orchestrates data and logic
const { stats, recent, loading, formatDate } = useAdminDashboard()

const currentTime = ref('')
let timeInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 60000) // Update every minute
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

function updateTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
}
.page-header {
  margin-bottom: 1.5rem;
}
.page-header h1 {
  font-size: 1.75rem;
  margin: 0;
  font-weight: 700;
  color: #1e293b;
}
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.summary-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
}
.card-earnings {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
}
.card-views {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: #fff;
}
.card-tasks {
  background: linear-gradient(135deg, #ff8787 0%, #ff6b6b 100%);
  color: #fff;
}
.card-downloads {
  background: linear-gradient(135deg, #74c0fc 0%, #339af0 100%);
  color: #fff;
}
.card-content {
  flex: 1;
}
.card-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.card-label {
  font-size: 0.9rem;
  opacity: 0.9;
}
.card-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2.5rem;
  opacity: 0.2;
}
.card-update {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}
.recent-inquiries {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.recent-inquiries h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #1e293b;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
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
  font-size: 0.875rem;
  color: #64748b;
}
.data-table tbody tr:hover {
  background: #f8f8f8;
}
.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #e2e8f0;
  border-radius: 4px;
  color: #475569;
}
.link-more {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}
.link-more:hover {
  text-decoration: underline;
}
</style>
