<template>
  <div class="inquiries-page">
    <div class="page-intro">
      <h1>Quản lý yêu cầu</h1>
      <p>Quản lý tất cả các yêu cầu khách hàng gửi về từ website</p>
    </div>

    <div class="toolbar">
      <div class="toolbar-filters">
        <div class="field-search">
          <input
            v-model="search"
            type="text"
            placeholder="Tìm theo tên, số điện thoại, email..."
            class="field-input"
          />
          <i class="fa-solid fa-magnifying-glass field-icon" />
        </div>
        <div class="field-dates">
          <input v-model="dateFrom" type="date" class="field-input field-date" title="Từ ngày" />
          <span class="date-sep">–</span>
          <input v-model="dateTo" type="date" class="field-input field-date" title="Đến ngày" />
        </div>
        <div class="field-select-wrap">
          <select v-model="statusFilter" class="field-input field-select">
            <option value="">Trạng thái: Tất cả</option>
            <option value="new">Mới</option>
            <option value="contacted">Đang xử lý</option>
            <option value="done">Đã xử lý</option>
          </select>
          <i class="fa-solid fa-chevron-down field-select-icon" />
        </div>
      </div>
      <button type="button" class="btn-export" :disabled="exporting" @click="handleExport">
        <i class="fa-solid fa-download" />
        {{ exporting ? 'Đang xuất...' : 'Xuất danh sách' }}
      </button>
    </div>

    <div class="table-panel">
      <div v-if="loading" class="state-box">Đang tải...</div>
      <div v-else-if="error" class="state-box state-error">{{ error }}</div>
      <div v-else-if="items.length === 0" class="state-box">Chưa có yêu cầu phù hợp bộ lọc.</div>

      <template v-else>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th class="col-index">#</th>
                <th class="col-customer">Khách hàng</th>
                <th>Nội dung yêu cầu</th>
                <th class="col-contact">Liên hệ</th>
                <th class="col-time">Thời gian</th>
                <th class="col-status">Trạng thái</th>
                <th class="col-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id">
                <td class="col-index">{{ rowNumber(index) }}</td>
                <td class="col-customer">
                  <div class="customer-name">{{ item.name }}</div>
                  <div class="customer-phone">{{ formatPhoneDisplay(item.phone) }}</div>
                </td>
                <td class="col-message">
                  <span class="message-text">{{ item.message }}</span>
                  <span v-if="item.product?.name" class="message-product">
                    · {{ item.product.name }}
                  </span>
                </td>
                <td class="col-contact">{{ item.email || '—' }}</td>
                <td class="col-time">
                  {{ formatDateTime(item.createdAt).date }}<br />
                  <span class="time-sub">{{ formatDateTime(item.createdAt).time }}</span>
                </td>
                <td class="col-status">
                  <span :class="['status-pill', inquiryStatusClass(item.status)]">
                    {{ inquiryStatusLabel(item.status) }}
                  </span>
                </td>
                <td class="col-actions">
                  <button
                    type="button"
                    class="action-btn"
                    title="Xem chi tiết"
                    @click="openDetail(item)"
                  >
                    <i class="fa-regular fa-eye" />
                  </button>
                  <div class="action-menu-wrap">
                    <button
                      type="button"
                      class="action-btn"
                      title="Thêm thao tác"
                      @click.stop="toggleMenu(item.id)"
                    >
                      <i class="fa-solid fa-ellipsis-vertical" />
                    </button>
                    <div v-if="openMenuId === item.id" class="action-menu">
                      <button type="button" @click="setStatus(item, 'contacted')">
                        Đánh dấu đang xử lý
                      </button>
                      <button type="button" @click="setStatus(item, 'done')">
                        Đánh dấu đã xử lý
                      </button>
                      <a :href="phoneTelHref(item.phone)" class="menu-link" @click="closeMenu">
                        Gọi điện
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <div>
            Hiển thị {{ rangeStart }}–{{ rangeEnd }} của {{ total }} yêu cầu
          </div>
          <div class="footer-controls">
            <div class="limit-select-wrap">
              <select
                class="limit-select"
                :value="limit"
                @change="onLimitChange(Number(($event.target as HTMLSelectElement).value))"
              >
                <option v-for="size in pageSizeOptions" :key="size" :value="size">
                  {{ size }} / trang
                </option>
              </select>
              <i class="fa-solid fa-chevron-down limit-select-icon" />
            </div>
            <div class="pagination">
              <button
                type="button"
                class="page-btn"
                :disabled="page <= 1"
                @click="goToPage(page - 1)"
              >
                <i class="fa-solid fa-chevron-left" />
              </button>
              <template v-for="(item, idx) in paginationItems" :key="`${item}-${idx}`">
                <span v-if="item === 'ellipsis'" class="page-ellipsis">…</span>
                <button
                  v-else
                  type="button"
                  class="page-btn"
                  :class="{ 'page-btn--active': item === page }"
                  @click="goToPage(item)"
                >
                  {{ item }}
                </button>
              </template>
              <button
                type="button"
                class="page-btn"
                :disabled="page >= totalPages"
                @click="goToPage(page + 1)"
              >
                <i class="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-if="detailItem" class="modal-overlay" @click.self="closeDetail">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="inquiry-detail-title">
        <div class="modal-head">
          <h2 id="inquiry-detail-title">Chi tiết yêu cầu</h2>
          <button type="button" class="modal-close" aria-label="Đóng" @click="closeDetail">
            <i class="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="modal-body">
          <dl class="detail-list">
            <div><dt>Khách hàng</dt><dd>{{ detailItem.name }}</dd></div>
            <div><dt>Điện thoại</dt><dd>{{ formatPhoneDisplay(detailItem.phone) }}</dd></div>
            <div><dt>Email</dt><dd>{{ detailItem.email || '—' }}</dd></div>
            <div><dt>Nội dung</dt><dd>{{ detailItem.message }}</dd></div>
            <div v-if="detailItem.product?.name">
              <dt>Sản phẩm</dt><dd>{{ detailItem.product.name }}</dd>
            </div>
            <div><dt>Nguồn</dt><dd>{{ sourceLabel(detailItem.source) }}</dd></div>
            <div>
              <dt>Thời gian</dt>
              <dd>
                {{ formatDateTime(detailItem.createdAt).date }}
                {{ formatDateTime(detailItem.createdAt).time }}
              </dd>
            </div>
          </dl>
          <label class="status-field">
            <span>Trạng thái</span>
            <select
              :value="detailItem.status"
              class="status-select"
              @change="onDetailStatusChange"
            >
              <option value="new">Mới</option>
              <option value="contacted">Đang xử lý</option>
              <option value="done">Đã xử lý</option>
            </select>
          </label>
        </div>
        <div class="modal-foot">
          <a :href="phoneTelHref(detailItem.phone)" class="btn-call">
            <i class="fa-solid fa-phone" /> Gọi khách hàng
          </a>
          <button type="button" class="btn-close-modal" @click="closeDetail">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { AdminInquiry } from '@/services/api/inquiries'
import { useAdminInquiries } from '@/composables/admin/useAdminInquiries'
import {
  inquiryStatusLabel,
  inquiryStatusClass,
} from '@/constants/inquiry-status'
import { formatPhoneDisplay, phoneTelHref } from '@/constants/site'
import { logger } from '@/utils/logger'

const {
  items,
  total,
  loading,
  error,
  search,
  statusFilter,
  dateFrom,
  dateTo,
  page,
  limit,
  totalPages,
  rangeStart,
  rangeEnd,
  paginationItems,
  pageSizeOptions,
  updateStatus,
  exportCsv,
  formatDateTime,
  goToPage,
  onLimitChange,
} = useAdminInquiries()

const exporting = ref(false)
const detailItem = ref<AdminInquiry | null>(null)
const openMenuId = ref<number | null>(null)

function rowNumber(index: number): number {
  return (page.value - 1) * limit.value + index + 1
}

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    product: 'Từ sản phẩm',
    contact: 'Từ trang liên hệ',
    facebook: 'Facebook',
    zalo: 'Zalo',
  }
  return labels[source] ?? source
}

function openDetail(item: AdminInquiry) {
  detailItem.value = item
  closeMenu()
}

function closeDetail() {
  detailItem.value = null
}

function toggleMenu(id: number) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function closeMenu() {
  openMenuId.value = null
}

async function setStatus(item: AdminInquiry, status: string) {
  closeMenu()
  try {
    await updateStatus(item.id, status)
  } catch {
    alert('Cập nhật trạng thái thất bại.')
  }
}

async function onDetailStatusChange(event: Event) {
  if (!detailItem.value) return
  const status = (event.target as HTMLSelectElement).value
  try {
    await updateStatus(detailItem.value.id, status)
    detailItem.value = { ...detailItem.value, status }
  } catch {
    alert('Cập nhật trạng thái thất bại.')
  }
}

async function handleExport() {
  exporting.value = true
  try {
    await exportCsv()
  } catch (e) {
    logger.error(e)
    alert('Xuất danh sách thất bại.')
  } finally {
    exporting.value = false
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.action-menu-wrap')) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.inquiries-page {
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

.toolbar {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #fff;
  padding: 1rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  font-size: var(--fs-body-sm);
}

@media (min-width: 1024px) {
  .toolbar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.toolbar-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 1024px) {
  .toolbar-filters {
    width: auto;
    flex: 1;
  }
}

.field-search {
  position: relative;
  flex: 1 1 16rem;
  min-width: 12rem;
}

.field-dates {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex: 1 1 14rem;
}

.field-date {
  flex: 1;
  min-width: 0;
}

.date-sep {
  color: #9ca3af;
  font-size: var(--fs-body-sm);
}

.field-select-wrap {
  position: relative;
  flex: 0 1 10rem;
  min-width: 9rem;
}

.field-input {
  width: 100%;
  background: rgba(249, 250, 251, 0.5);
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: var(--fs-body-sm);
  color: #4b5563;
}

.field-input:focus {
  outline: none;
  border-color: #92400e;
}

.field-icon {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--fs-body-sm);
  color: #9ca3af;
  pointer-events: none;
}

.field-select {
  appearance: none;
  cursor: pointer;
  padding-right: 1.75rem;
}

.field-select-icon {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--fs-caption);
  color: #9ca3af;
  pointer-events: none;
}

.btn-export {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-weight: 600;
  font-size: var(--fs-body-sm);
  padding: 0.375rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: background 0.2s;
  width: 100%;
}

.btn-export:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-export:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-export i {
  color: #78350f;
  font-size: var(--fs-body-sm);
}

@media (min-width: 640px) {
  .btn-export {
    width: auto;
  }
}

.table-panel {
  margin-top: 1.5rem;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.state-box {
  padding: 2.5rem 1rem;
  text-align: center;
  font-size: var(--fs-body-sm);
  color: #6b7280;
}

.state-error {
  color: #b91c1c;
}

.table-scroll {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-body-sm);
}

.data-table thead tr {
  border-bottom: 1px solid #f3f4f6;
  background: rgba(249, 250, 251, 0.4);
  color: #9ca3af;
  font-size: var(--fs-body-sm);
  font-weight: 600;
}

.data-table th,
.data-table td {
  padding: 0.875rem 1rem;
  text-align: left;
  vertical-align: top;
}

.data-table tbody tr {
  border-bottom: 1px solid #f9fafb;
  color: #374151;
  font-weight: 500;
  transition: background 0.15s;
}

.data-table tbody tr:hover {
  background: rgba(249, 250, 251, 0.5);
}

.col-index {
  width: 3rem;
  text-align: center;
  color: #9ca3af;
  font-size: var(--fs-body-sm);
}

.col-customer {
  width: 12rem;
}

.col-contact {
  width: 12rem;
  font-size: var(--fs-body-sm);
  color: #4b5563;
}

.col-time {
  width: 8rem;
  font-size: var(--fs-body-sm);
  line-height: 1.35;
}

.time-sub {
  color: #9ca3af;
  font-size: var(--fs-caption);
}

.col-status {
  width: 7rem;
}

.col-actions {
  width: 6rem;
  text-align: center;
}

.customer-name {
  font-weight: 700;
  color: #111827;
}

.customer-phone {
  margin-top: 0.125rem;
  font-size: var(--fs-caption);
  color: #9ca3af;
}

.col-message {
  max-width: 20rem;
}

.message-text {
  color: #6b7280;
  line-height: 1.45;
}

.message-product {
  color: #4b5563;
}

.status-pill {
  font-size: var(--fs-caption);
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
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

.col-actions {
  white-space: nowrap;
}

.action-btn {
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  font-size: var(--fs-body-sm);
  vertical-align: middle;
}

.action-btn:hover {
  color: #78350f;
}

.action-menu-wrap {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  margin-left: 0.25rem;
}

.action-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.25rem;
  min-width: 11rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  overflow: hidden;
}

.action-menu button,
.action-menu .menu-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: var(--fs-body-sm);
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.action-menu button:hover,
.action-menu .menu-link:hover {
  background: #f9fafb;
}

.table-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: var(--fs-body-sm);
  color: #6b7280;
  font-weight: 500;
}

@media (min-width: 640px) {
  .table-footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.footer-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.limit-select-wrap {
  position: relative;
}

.limit-select {
  appearance: none;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.25rem 1.5rem 0.25rem 0.5rem;
  font-size: var(--fs-body-sm);
  color: #4b5563;
  cursor: pointer;
}

.limit-select:focus {
  outline: none;
}

.limit-select-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--fs-caption);
  color: #9ca3af;
  pointer-events: none;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--fs-body-sm);
}

.page-btn {
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-btn--active {
  background: #78350f;
  border-color: #78350f;
  color: #fff;
  font-weight: 700;
}

.page-ellipsis {
  padding: 0 0.25rem;
  color: #9ca3af;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: #fff;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  font-size: var(--fs-body-sm);
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-head h2 {
  margin: 0;
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: #111827;
}

.modal-close {
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: var(--fs-body);
}

.modal-body {
  padding: 1.25rem;
}

.detail-list {
  margin: 0;
}

.detail-list > div {
  margin-bottom: 0.75rem;
}

.detail-list dt {
  font-size: var(--fs-caption);
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.detail-list dd {
  margin: 0.25rem 0 0;
  color: #374151;
  line-height: 1.45;
}

.status-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 1rem;
}

.status-field span {
  font-weight: 600;
  color: #374151;
}

.status-select {
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: var(--fs-body-sm);
}

.modal-foot {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f3f4f6;
}

.btn-call {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #78350f;
  color: #fff;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: 600;
  font-size: var(--fs-body-sm);
}

.btn-close-modal {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: var(--fs-body-sm);
  color: #374151;
}
</style>
