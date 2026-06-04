<template>
  <div class="account-page">
    <div class="page-header">
      <RouterLink to="/admin/account" class="back-link">
        <i class="fa-solid fa-arrow-left" aria-hidden="true" />
        Thông tin tài khoản
      </RouterLink>
      <h1>Đổi mật khẩu</h1>
    </div>

    <div class="account-content">
      <div v-if="actionError" class="action-error" role="alert">{{ actionError }}</div>

      <section class="info-section">
        <p class="section-desc">
          Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật tài khoản của bạn.
        </p>
        <form @submit.prevent="changePassword" class="form-container" novalidate>
          <FormField label="Mật khẩu hiện tại" :required="true">
            <UiInput
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </FormField>

          <FormField label="Mật khẩu mới" :required="true">
            <UiInput
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            />
          </FormField>

          <FormField label="Xác nhận mật khẩu mới" :required="true">
            <UiInput
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
            />
          </FormField>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="changingPassword">
              {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
            </button>
            <RouterLink to="/admin/account" class="btn btn-outline">Hủy</RouterLink>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import apiClient from '@/services/api/client'
import { FormField, UiInput } from '@/components/ui'
import { useToast } from '@/composables/useToast'
import { apiErrorMessage } from '@/utils/apiErrorMessage'

const { toast } = useToast()

const changingPassword = ref(false)
const actionError = ref('')

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

function resetPasswordForm() {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

async function changePassword() {
  actionError.value = ''

  if (!passwordForm.currentPassword) {
    actionError.value = 'Vui lòng nhập mật khẩu hiện tại.'
    toast.error('Đổi mật khẩu thất bại', actionError.value)
    return
  }
  if (passwordForm.newPassword.length < 6) {
    actionError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự.'
    toast.error('Đổi mật khẩu thất bại', actionError.value)
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    actionError.value = 'Mật khẩu mới và xác nhận không khớp.'
    toast.error('Đổi mật khẩu thất bại', actionError.value)
    return
  }

  changingPassword.value = true
  try {
    await apiClient.patch('/auth/change-password', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    toast.success('Đổi mật khẩu thành công')
    resetPasswordForm()
  } catch (error: unknown) {
    actionError.value = apiErrorMessage(error, 'Đổi mật khẩu thất bại.')
    toast.error('Đổi mật khẩu thất bại', actionError.value)
  } finally {
    changingPassword.value = false
  }
}
</script>

<style scoped>
.account-page {
  max-width: 800px;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  font-size: var(--fs-body-sm);
  color: #6b7280;
  text-decoration: none;
}

.back-link:hover {
  color: #1e293b;
}

.page-header h1 {
  font-size: var(--fs-subtitle);
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.action-error {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: var(--fs-body-sm);
  color: #b91c1c;
  background: #fee2e2;
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

.section-desc {
  margin: 0 0 1.5rem;
  font-size: var(--fs-body-sm);
  color: #6b7280;
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
</style>
