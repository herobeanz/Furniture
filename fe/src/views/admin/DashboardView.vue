<template>
  <div class="dashboard">
    <div class="page-intro">
      <h1>Dashboard</h1>
      <p>Tổng quan hoạt động của hệ thống</p>
    </div>

    <div v-if="loading" class="state-message">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="state-message state-error">{{ error }}</div>

    <template v-else-if="data">
      <div class="stat-grid">
        <article class="stat-card">
          <div class="stat-body">
            <span class="stat-label">Yêu cầu mới</span>
            <div class="stat-value">{{ formatNumber(data.cards.newInquiries.value) }}</div>
            <p class="stat-trend">
              <span :class="['trend-badge', trendClass(data.cards.newInquiries.changePercent)]">
                <i class="fa-solid fa-arrow-trend-up" />
                {{ formatTrend(data.cards.newInquiries.changePercent) }}
              </span>
              <span class="trend-compare">{{ data.cards.newInquiries.compareLabel }}</span>
            </p>
          </div>
          <div class="stat-icon stat-icon-orange">
            <i class="fa-regular fa-file-lines" />
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-body">
            <span class="stat-label">Sản phẩm</span>
            <div class="stat-value">{{ formatNumber(data.cards.products.value) }}</div>
            <p class="stat-trend">
              <span :class="['trend-badge', trendClass(data.cards.products.changePercent)]">
                <i class="fa-solid fa-arrow-trend-up" />
                {{ formatTrend(data.cards.products.changePercent) }}
              </span>
              <span class="trend-compare">{{ data.cards.products.compareLabel }}</span>
            </p>
          </div>
          <div class="stat-icon stat-icon-amber">
            <i class="fa-solid fa-box" />
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-body">
            <span class="stat-label">Yêu cầu tuần này</span>
            <div class="stat-value">{{ formatNumber(data.cards.weeklyInquiries.value) }}</div>
            <p class="stat-trend">
              <span
                :class="['trend-badge', trendClass(data.cards.weeklyInquiries.changePercent)]"
              >
                <i class="fa-solid fa-arrow-trend-up" />
                {{ formatTrend(data.cards.weeklyInquiries.changePercent) }}
              </span>
              <span class="trend-compare">{{ data.cards.weeklyInquiries.compareLabel }}</span>
            </p>
          </div>
          <div class="stat-icon stat-icon-blue">
            <i class="fa-regular fa-eye" />
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-body">
            <span class="stat-label">Khách hàng</span>
            <div class="stat-value">{{ formatNumber(data.cards.customers.value) }}</div>
            <p class="stat-trend">
              <span :class="['trend-badge', trendClass(data.cards.customers.changePercent)]">
                <i class="fa-solid fa-arrow-trend-up" />
                {{ formatTrend(data.cards.customers.changePercent) }}
              </span>
              <span class="trend-compare">{{ data.cards.customers.compareLabel }}</span>
            </p>
          </div>
          <div class="stat-icon stat-icon-purple">
            <i class="fa-regular fa-user" />
          </div>
        </article>
      </div>

      <div class="panel-grid panel-grid-top">
        <section class="panel panel-chart">
          <div class="panel-head">
            <h3>Yêu cầu theo ngày</h3>
            <div class="chart-select-wrap">
              <select
                class="chart-select"
                :value="chartDays"
                @change="onChartDaysChange"
              >
                <option :value="7">7 ngày qua</option>
                <option :value="30">30 ngày qua</option>
              </select>
              <i class="fa-solid fa-chevron-down chart-select-icon" />
            </div>
          </div>
          <AdminLineChart
            :labels="data.activityChart.labels"
            :data="data.activityChart.data"
          />
        </section>

        <section class="panel">
          <div class="panel-head">
            <h3>Yêu cầu mới nhất</h3>
            <RouterLink to="/admin/inquiries" class="panel-link">Xem tất cả</RouterLink>
          </div>
          <div v-if="data.recentInquiries.length === 0" class="empty-inline">
            Chưa có yêu cầu.
          </div>
          <ul v-else class="inquiry-list">
            <li v-for="inq in data.recentInquiries" :key="inq.id" class="inquiry-item">
              <div>
                <h4>{{ inq.name }}</h4>
                <p>
                  {{ formatPhoneDisplay(inq.phone) }}
                  <span v-if="inquirySubtitle(inq)" class="inquiry-topic">
                    · {{ inquirySubtitle(inq) }}
                  </span>
                </p>
              </div>
              <div class="inquiry-meta">
                <span :class="['status-pill', inquiryStatusClass(inq.status)]">
                  {{ inquiryStatusLabel(inq.status) }}
                </span>
                <p>{{ formatRelativeTimeVi(inq.createdAt) }}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <div class="panel-grid panel-grid-bottom">
        <section class="panel panel-wide">
          <div class="panel-head">
            <h3>Sản phẩm mới nhất</h3>
            <RouterLink to="/admin/products" class="panel-link">Xem tất cả</RouterLink>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="data.latestProducts.length === 0">
                  <td colspan="5" class="empty-cell">Chưa có sản phẩm.</td>
                </tr>
                <tr v-for="product in data.latestProducts" :key="product.id">
                  <td>
                    <div class="product-cell">
                      <div class="product-thumb">
                        <img
                          v-if="product.thumbnail"
                          :src="resolveMediaUrl(product.thumbnail)"
                          :alt="product.name"
                        />
                        <i v-else class="fa-solid fa-image" />
                      </div>
                      {{ product.name }}
                    </div>
                  </td>
                  <td>{{ product.categoryName }}</td>
                  <td class="price-cell">{{ productPriceLabel(product) }}</td>
                  <td>
                    <span
                      :class="[
                        'status-tag',
                        product.isActive ? 'status-visible' : 'status-hidden',
                      ]"
                    >
                      {{ product.isActive ? 'Hiển thị' : 'Ẩn' }}
                    </span>
                  </td>
                  <td class="date-cell">{{ formatProductDate(product.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title-only">Thống kê theo danh mục</h3>
          <AdminCategoryChart :items="data.productsByCategory" />
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAdminDashboard } from '@/composables/admin/useAdminDashboard'
import AdminLineChart from '@/components/admin/AdminLineChart.vue'
import AdminCategoryChart from '@/components/admin/AdminCategoryChart.vue'
import { formatPhoneDisplay } from '@/constants/site'
import { formatRelativeTimeVi } from '@/utils/relativeTime'
import { formatPrice } from '@/utils/format'
import { resolveMediaUrl } from '@/utils/mediaUrl'

const {
  data,
  loading,
  error,
  chartDays,
  loadDashboardData,
  inquiryStatusLabel,
  inquiryStatusClass,
  formatTrend,
  trendClass,
} = useAdminDashboard()

onMounted(() => {
  loadDashboardData()
})

function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function onChartDaysChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  loadDashboardData(value === 30 ? 30 : 7)
}

function inquirySubtitle(inq: {
  productName: string | null
  message: string
}): string {
  if (inq.productName) return inq.productName
  const msg = inq.message?.trim()
  if (!msg) return ''
  return msg.length > 48 ? `${msg.slice(0, 48)}…` : msg
}

function productPriceLabel(product: {
  price: number
  isContactPrice: boolean
}): string {
  if (product.isContactPrice) return 'Liên hệ'
  return formatPrice(product.price)
}

function formatProductDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN')
}
</script>

<style scoped>
.dashboard {
  padding: 1.5rem 2rem 2rem;
}

.page-intro h1 {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: var(--fs-card-title);
  font-weight: 700;
  color: #030712;
}

.page-intro p {
  margin: 0.125rem 0 0;
  font-size: var(--fs-body-sm);
  color: #9ca3af;
}

.state-message {
  margin-top: 1.5rem;
  padding: 2rem;
  text-align: center;
  font-size: var(--fs-body-sm);
  color: #6b7280;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
}

.state-error {
  color: #b91c1c;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (min-width: 640px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: #fff;
  padding: 1rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.stat-label {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: #9ca3af;
}

.stat-value {
  font-size: var(--fs-section-title);
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.stat-trend {
  margin: 0.25rem 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.trend-badge {
  font-size: var(--fs-caption);
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.trend-up {
  color: #059669;
  background: #ecfdf5;
}

.trend-down {
  color: #dc2626;
  background: #fef2f2;
}

.trend-neutral {
  color: #6b7280;
  background: #f3f4f6;
}

.trend-compare {
  font-size: var(--fs-caption);
  color: #9ca3af;
}

.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-orange {
  background: #fff7ed;
  color: #ea580c;
}

.stat-icon-amber {
  background: #fffbeb;
  color: #92400e;
}

.stat-icon-blue {
  background: #eff6ff;
  color: #2563eb;
}

.stat-icon-purple {
  background: #faf5ff;
  color: #9333ea;
}

.panel-grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.panel-grid-top {
  grid-template-columns: 1fr;
}

.panel-grid-bottom {
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .panel-grid-top {
    grid-template-columns: 7fr 5fr;
  }

  .panel-grid-bottom {
    grid-template-columns: 8fr 4fr;
  }
}

.panel {
  background: #fff;
  padding: 1.25rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.panel-head h3,
.panel-title-only {
  margin: 0;
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.panel-title-only {
  margin-bottom: 1rem;
}

.panel-link {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: #92400e;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.125rem 0.5rem;
  text-decoration: none;
}

.panel-link:hover {
  background: #f9fafb;
}

.chart-select-wrap {
  position: relative;
  font-size: var(--fs-body-sm);
}

.chart-select {
  appearance: none;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.25rem 1.5rem 0.25rem 0.5rem;
  color: #4b5563;
}

.chart-select:focus {
  outline: none;
}

.chart-select-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--fs-caption);
  color: #9ca3af;
  pointer-events: none;
}

.inquiry-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.inquiry-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f9fafb;
  font-size: var(--fs-body-sm);
}

.inquiry-item:first-child {
  border-top: none;
  padding-top: 0;
}

.inquiry-item h4 {
  margin: 0;
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: #111827;
}

.inquiry-item p {
  margin: 0.125rem 0 0;
  font-size: var(--fs-caption);
  color: #9ca3af;
}

.inquiry-topic {
  color: #4b5563;
}

.inquiry-meta {
  text-align: right;
  flex-shrink: 0;
}

.inquiry-meta p {
  margin: 0.25rem 0 0;
}

.status-pill {
  font-size: var(--fs-caption);
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.status-new {
  background: #ecfdf5;
  color: #047857;
}

.status-contacted {
  background: #fff7ed;
  color: #c2410c;
}

.status-done {
  background: #eff6ff;
  color: #1d4ed8;
}

.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-body-sm);
}

.data-table th {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #9ca3af;
  border-bottom: 1px solid #f3f4f6;
  background: rgba(249, 250, 251, 0.5);
}

.data-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f9fafb;
  color: #374151;
  font-weight: 500;
  vertical-align: middle;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-thumb {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.25rem;
  background: #f3f4f6;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #9ca3af;
  font-size: var(--fs-caption);
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-cell {
  font-weight: 600;
  color: #111827;
}

.date-cell {
  color: #9ca3af;
  font-size: var(--fs-body-sm);
}

.status-tag {
  font-size: var(--fs-caption);
  padding: 0.125rem 0.5rem;
  border-radius: 0.125rem;
}

.status-visible {
  background: #ecfdf5;
  color: #047857;
}

.status-hidden {
  background: #f3f4f6;
  color: #6b7280;
}

.empty-inline,
.empty-cell {
  color: #9ca3af;
  font-size: var(--fs-body-sm);
}
</style>
