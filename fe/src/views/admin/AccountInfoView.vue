<template>
  <div class="account-page">
    <div class="page-header">
      <h1>Thông tin tài khoản</h1>
    </div>

    <div v-if="loading" class="loading-state">Đang tải...</div>
    <div v-else-if="loadError && !hasFormData" class="error-state">{{ loadError }}</div>

    <div v-else class="account-content">
      <div v-if="actionError" class="action-error" role="alert">{{ actionError }}</div>
      <div v-if="loadError" class="action-error action-error--warning" role="status">
        {{ loadError }}
      </div>

      <section class="info-section">
        <h2 class="section-title">Thông tin cá nhân</h2>
        <form @submit.prevent="updateProfile" class="form-container" novalidate>
          <FormField label="Tên đăng nhập">
            <UiInput v-model="form.username" :disabled="true" />
            <p class="form-hint">Tên đăng nhập không thể thay đổi</p>
          </FormField>

          <FormField label="Email" :required="true">
            <UiInput v-model="form.email" type="email" placeholder="Nhập email" />
          </FormField>

          <FormField label="Vai trò">
            <UiInput :model-value="roleLabel" :disabled="true" />
            <p class="form-hint">Vai trò không thể thay đổi</p>
          </FormField>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Đang lưu...' : 'Cập nhật thông tin' }}
            </button>
          </div>
        </form>
      </section>

      <section class="info-section">
        <h2 class="section-title">Thông tin đăng nhập</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Lần đăng nhập cuối</span>
            <span class="info-value">{{ lastLoginText }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Trạng thái</span>
            <span class="info-value status-active">Đang hoạt động</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminAuthStore } from '@/stores/adminAuth'
import apiClient from '@/services/api/client'
import { FormField, UiInput } from '@/components/ui'
import { useToast } from '@/composables/useToast'
import { apiErrorMessage } from '@/utils/apiErrorMessage'

interface AdminMeResponse {
  username?: string
  email?: string
  role?: string
  last_login_at?: string | null
  lastLoginAt?: string | null
}

const authStore = useAdminAuthStore()
const { admin } = storeToRefs(authStore)
const { toast } = useToast()

const loading = ref(true)
const saving = ref(false)
const loadError = ref('')
const actionError = ref('')

const form = reactive({
  username: '',
  email: '',
  role: '',
})

const hasFormData = computed(() => !!form.username || !!form.email)

const roleLabel = computed(() => {
  const roleMap: Record<string, string> = {
    admin: 'Quản trị viên',
    editor: 'Biên tập viên',
    manager: 'Quản lý nội dung',
  }
  return roleMap[form.role] || form.role
})

const lastLoginAt = ref<string | null>(null)

const lastLoginText = computed(() => {
  if (!lastLoginAt.value) {
    return 'Chưa có thông tin'
  }
  try {
    const date = new Date(lastLoginAt.value)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Chưa có thông tin'
  }
})

function applyAdminToForm(data: AdminMeResponse) {
  form.username = data.username || ''
  form.email = data.email || ''
  form.role = data.role || 'admin'
  lastLoginAt.value = data.last_login_at ?? data.lastLoginAt ?? null
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

async function loadAccountInfo(options: { silent?: boolean } = {}) {
  if (!options.silent) {
    loading.value = true
  }
  loadError.value = ''
  try {
    const data = await authStore.fetchMe()
    if (data) {
      applyAdminToForm(data as AdminMeResponse)
    }
  } catch (error: unknown) {
    loadError.value = apiErrorMessage(error, 'Không thể tải thông tin tài khoản mới nhất.')
    if (admin.value) {
      applyAdminToForm({
        username: admin.value.username,
        email: admin.value.email,
        role: admin.value.role,
      })
    }
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  actionError.value = ''
  const email = form.email.trim()
  if (!email) {
    actionError.value = 'Vui lòng nhập email.'
    toast.error('Cập nhật thất bại', actionError.value)
    return
  }
  if (!isValidEmail(email)) {
    actionError.value = 'Email không hợp lệ.'
    toast.error('Cập nhật thất bại', actionError.value)
    return
  }

  saving.value = true
  try {
    await apiClient.patch('/auth/profile', { email })
    if (admin.value) {
      admin.value.email = email
    }
    form.email = email
    await loadAccountInfo({ silent: true })
    toast.success('Cập nhật thông tin thành công')
  } catch (error: unknown) {
    actionError.value = apiErrorMessage(error, 'Cập nhật thông tin thất bại.')
    toast.error('Cập nhật thất bại', actionError.value)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadAccountInfo()
})
</script>

<style scoped>
.account-page {
  max-width: 800px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: var(--fs-subtitle);
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.loading-state,
.error-state {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.error-state {
  color: #dc2626;
  background: #fee2e2;
  border-radius: 8px;
}

.action-error {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: var(--fs-body-sm);
  color: #b91c1c;
  background: #fee2e2;
}

.action-error--warning {
  color: #92400e;
  background: #fef3c7;
}

.account-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: var(--fs-card-title);
  font-weight: 600;
  margin: 0 0 1.5rem;
  color: #1e293b;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: var(--fs-body-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-outline {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.form-hint {
  margin: 0.25rem 0 0;
  font-size: var(--fs-body-sm);
  color: #6b7280;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
}

.info-label {
  font-size: var(--fs-body-sm);
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: var(--fs-body-sm);
  color: #1e293b;
  font-weight: 600;
}

.info-value.status-active {
  color: #16a34a;
}
</style>
