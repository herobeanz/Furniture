<template>
  <div class="reports-view">
    <div class="page-header">
      <h1>Báo cáo</h1>
    </div>
    <div class="reports-grid">
      <div class="report-card">
        <h3>Tổng quan</h3>
        <p class="report-desc">Xem tổng quan về hệ thống</p>
        <div class="report-stats">
          <div class="stat-item">
            <span class="stat-label">Tổng sản phẩm</span>
            <span class="stat-value">{{ stats.totalProducts || '—' }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tổng inquiries</span>
            <span class="stat-value">{{ stats.totalInquiries || '—' }}</span>
          </div>
        </div>
      </div>
      <div class="report-card">
        <h3>Inquiries mới</h3>
        <p class="report-desc">Các yêu cầu chưa xử lý</p>
        <div class="report-stats">
          <div class="stat-item">
            <span class="stat-label">Chưa xử lý</span>
            <span class="stat-value">{{ stats.newInquiries || '—' }}</span>
          </div>
        </div>
      </div>
    </div>
    <p class="note">Tính năng báo cáo đang được phát triển.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/api.client'

const stats = ref({
  totalProducts: null as number | null,
  totalInquiries: null as number | null,
  newInquiries: null as number | null,
})

onMounted(async () => {
  try {
    // TODO: Replace with actual reports API endpoints
    // const productsRes = await apiClient.get('/products?limit=1')
    // stats.value.totalProducts = productsRes.total || 0
    
    // const inquiriesRes = await apiClient.get('/inquiries')
    // stats.value.totalInquiries = Array.isArray(inquiriesRes) ? inquiriesRes.length : 0
    // stats.value.newInquiries = Array.isArray(inquiriesRes) 
    //   ? inquiriesRes.filter((i: any) => i.status === 'new').length 
    //   : 0
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}
.page-header h1 {
  font-size: 1.5rem;
  margin: 0;
}
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.report-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.report-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}
.report-desc {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
.report-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-top: 1px solid #eee;
}
.stat-item:first-child {
  border-top: none;
}
.stat-label {
  font-size: 0.875rem;
  color: #666;
}
.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
}
.note {
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
}
</style>
