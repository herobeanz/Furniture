<template>
  <div class="reports-view">
    <div class="page-header">
      <h1>Báo cáo</h1>
    </div>

    <div v-if="loading" class="loading">Đang tải dữ liệu...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <!-- Overview Section -->
      <section class="reports-section">
        <h2 class="section-title">Tổng quan hệ thống</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏠</div>
            <div class="stat-content">
              <div class="stat-label">Phòng</div>
              <div class="stat-value">{{ overview?.totals?.rooms || 0 }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📁</div>
            <div class="stat-content">
              <div class="stat-label">Danh mục</div>
              <div class="stat-value">{{ overview?.totals?.categories || 0 }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🛋️</div>
            <div class="stat-content">
              <div class="stat-label">Sản phẩm</div>
              <div class="stat-value">{{ overview?.totals?.products || 0 }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <div class="stat-label">Yêu cầu</div>
              <div class="stat-value">{{ overview?.totals?.inquiries || 0 }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-label">Bộ sưu tập</div>
              <div class="stat-value">{{ overview?.totals?.collections || 0 }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📄</div>
            <div class="stat-content">
              <div class="stat-label">Trang CMS</div>
              <div class="stat-value">{{ overview?.totals?.cmsPages || 0 }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Inquiries Section -->
      <section class="reports-section">
        <h2 class="section-title">Thống kê yêu cầu</h2>
        <div class="reports-grid">
          <div class="report-card">
            <h3>Tổng quan</h3>
            <div class="report-stats">
              <div class="stat-item">
                <span class="stat-label">Tổng số</span>
                <span class="stat-value">{{ inquiriesStats?.total || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">30 ngày qua</span>
                <span class="stat-value">{{ inquiriesStats?.last30Days || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">7 ngày qua</span>
                <span class="stat-value">{{ inquiriesStats?.last7Days || 0 }}</span>
              </div>
            </div>
          </div>
          <div class="report-card">
            <h3>Theo trạng thái</h3>
            <div class="report-stats">
              <div
                v-for="(count, status) in inquiriesStats?.byStatus"
                :key="status"
                class="stat-item"
              >
                <span class="stat-label">{{ getStatusLabel(status) }}</span>
                <span class="stat-value">{{ count }}</span>
              </div>
            </div>
          </div>
          <div class="report-card">
            <h3>Theo nguồn</h3>
            <div class="report-stats">
              <div
                v-for="(count, source) in inquiriesStats?.bySource"
                :key="source"
                class="stat-item"
              >
                <span class="stat-label">{{ getSourceLabel(source) }}</span>
                <span class="stat-value">{{ count }}</span>
              </div>
            </div>
          </div>
          <div class="report-card highlight">
            <h3>Yêu cầu mới</h3>
            <div class="report-stats">
              <div class="stat-item">
                <span class="stat-label">Chưa xử lý</span>
                <span class="stat-value large">{{ overview?.inquiries?.new || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">7 ngày qua</span>
                <span class="stat-value">{{ overview?.inquiries?.recent || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Section -->
      <section class="reports-section">
        <h2 class="section-title">Thống kê sản phẩm</h2>
        <div class="reports-grid">
          <div class="report-card">
            <h3>Tổng quan</h3>
            <div class="report-stats">
              <div class="stat-item">
                <span class="stat-label">Tổng số</span>
                <span class="stat-value">{{ productsStats?.total || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Đang hoạt động</span>
                <span class="stat-value">{{ productsStats?.active || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Không hoạt động</span>
                <span class="stat-value">{{ productsStats?.inactive || 0 }}</span>
              </div>
            </div>
          </div>
          <div class="report-card">
            <h3>Theo phòng</h3>
            <div class="report-stats">
              <div
                v-for="(count, room) in productsStats?.byRoom"
                :key="room"
                class="stat-item"
              >
                <span class="stat-label">{{ room }}</span>
                <span class="stat-value">{{ count }}</span>
              </div>
              <div v-if="!productsStats?.byRoom || Object.keys(productsStats.byRoom).length === 0" class="stat-item">
                <span class="stat-label">Chưa có dữ liệu</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAdminReports } from '@/composables/admin/useAdminReports'

// Container component: orchestrates data and logic
const {
  loading,
  error,
  overview,
  inquiriesStats,
  productsStats,
  getStatusLabel,
  getSourceLabel,
} = useAdminReports()
</script>

<style scoped>
.reports-view {
  max-width: 1400px;
}
.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 1.75rem;
  margin: 0;
  font-weight: 700;
}
.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #666;
}
.error {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 8px;
}
.reports-section {
  margin-bottom: 2.5rem;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.stat-card {
  background: #fff;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
}
.stat-icon {
  font-size: 2rem;
  line-height: 1;
}
.stat-content {
  flex: 1;
}
.stat-label {
  font-size: 0.875rem;
  color: #666;
  display: block;
  margin-bottom: 0.25rem;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary, #1976d2);
  display: block;
}
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.report-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.report-card.highlight {
  border: 2px solid var(--color-primary, #1976d2);
  background: #f3f8ff;
}
.report-card h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
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
  padding: 0.75rem 0;
  border-top: 1px solid #eee;
}
.stat-item:first-child {
  border-top: none;
}
.stat-item .stat-label {
  font-size: 0.875rem;
  color: #666;
}
.stat-item .stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary, #1976d2);
}
.stat-item .stat-value.large {
  font-size: 1.75rem;
}
</style>
