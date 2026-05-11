<template>
  <div class="account-info">
    <div class="page-header">
      <h1>Thông tin tài khoản</h1>
    </div>

    <div v-if="loading" class="loading-state">Đang tải...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else class="account-content">
      <!-- Profile Information Section -->
      <section class="info-section">
        <h2 class="section-title">Thông tin cá nhân</h2>
        <form @submit.prevent="updateProfile" class="form-container">
          <FormField label="Tên đăng nhập">
            <UiInput v-model="form.username" :disabled="true" />
            <p class="form-hint">Tên đăng nhập không thể thay đổi</p>
          </FormField>

          <FormField label="Email" :required="true">
            <UiInput v-model="form.email" type="email" placeholder="Nhập email" :required="true" />
          </FormField>

          <FormField label="Họ và tên" optional>
            <UiInput v-model="form.fullname" placeholder="Nhập họ và tên" />
          </FormField>

          <FormField label="Vai trò">
            <UiInput v-model="roleLabel" :disabled="true" />
            <p class="form-hint">Vai trò không thể thay đổi</p>
          </FormField>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Đang lưu...' : 'Cập nhật thông tin' }}
            </button>
            <button type="button" class="btn btn-outline" @click="handleChangePassword">
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </section>

      <!-- Change Password Section -->
      <section v-if="showPasswordForm" class="info-section">
        <h2 class="section-title">Đổi mật khẩu</h2>
        <form @submit.prevent="changePassword" class="form-container">
          <FormField label="Mật khẩu hiện tại" :required="true">
            <UiInput
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              :required="true"
            />
          </FormField>

          <FormField label="Mật khẩu mới" :required="true">
            <UiInput
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              :required="true"
            />
          </FormField>

          <FormField label="Xác nhận mật khẩu mới" :required="true">
            <UiInput
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              :required="true"
            />
          </FormField>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="changingPassword">
              {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
            </button>
            <button type="button" class="btn btn-outline" @click="cancelChangePassword">
              Hủy
            </button>
          </div>
        </form>
      </section>

      <!-- Account Statistics -->
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

const authStore = useAdminAuthStore()
const { admin } = storeToRefs(authStore)

const loading = ref(true)
const saving = ref(false)
const changingPassword = ref(false)
const error = ref('')
const showPasswordForm = ref(false)

const form = reactive({
  username: '',
  email: '',
  fullname: '',
  role: '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

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

async function loadAccountInfo() {
  loading.value = true
  error.value = ''
  try {
    // Fetch fresh data from API
    const data = await authStore.fetchMe()
    if (data) {
      form.username = data.username || ''
      form.email = data.email || ''
      form.fullname = data.fullName || ''
      form.role = data.role || 'admin'
      // @ts-ignore - last_login_at might be in the response
      lastLoginAt.value = data.last_login_at || data.lastLoginAt || null
    }
  } catch (e: any) {
    error.value = e?.message || 'Không thể tải thông tin tài khoản.'
    // Fallback to store data
    if (admin.value) {
      form.username = admin.value.username || ''
      form.email = admin.value.email || ''
      form.fullname = admin.value.fullName || ''
      form.role = admin.value.role || 'admin'
    }
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  saving.value = true
  error.value = ''
  try {
    await apiClient.patch('/auth/profile', {
      email: form.email,
      fullname: form.fullname,
    })
    // Update store
    if (admin.value) {
      admin.value.email = form.email
      admin.value.fullName = form.fullname
    }
    // Reload account info to get latest data
    await loadAccountInfo()
    alert('Cập nhật thông tin thành công!')
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Cập nhật thông tin thất bại.'
    alert(error.value)
  } finally {
    saving.value = false
  }
}

function handleChangePassword() {
  showPasswordForm.value = true
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

function cancelChangePassword() {
  showPasswordForm.value = false
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

async function changePassword() {
  if (passwordForm.newPassword.length < 6) {
    alert('Mật khẩu mới phải có ít nhất 6 ký tự.')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('Mật khẩu mới và xác nhận không khớp.')
    return
  }

  changingPassword.value = true
  error.value = ''
  try {
    await apiClient.patch('/auth/change-password', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    alert('Đổi mật khẩu thành công!')
    cancelChangePassword()
  } catch (e: any) {
    const errorMessage = e?.response?.data?.message || e?.message || 'Đổi mật khẩu thất bại.'
    error.value = errorMessage
    alert(errorMessage)
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  loadAccountInfo()
})
</script>

<style scoped>
.account-info {
  max-width: 800px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
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
  font-size: 1.25rem;
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
  font-size: 0.875rem;
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
  font-size: 0.75rem;
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
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
}

.info-value.status-active {
  color: #16a34a;
}
</style>
