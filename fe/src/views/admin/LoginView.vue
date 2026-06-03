<template>
  <div class="admin-login">
    <div class="login-card">
      <h1>Đăng nhập Admin</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="username">Tên đăng nhập</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            autocomplete="username"
          />
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
          />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>
      <RouterLink to="/" class="back-link">← Về trang chủ</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/adminAuth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { toast } = useToast()
const authStore = useAdminAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(username.value, password.value)
    router.push('/admin/dashboard')
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || 'Đăng nhập thất bại.'
    error.value = msg
    toast.error('Đăng nhập thất bại', msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 360px;
}
.login-card h1 {
  font-size: var(--fs-card-title);
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-size: var(--fs-body-sm);
  font-weight: 500;
  margin-bottom: 0.35rem;
}
.form-group input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--fs-body);
}
.error {
  color: var(--color-primary);
  font-size: var(--fs-body-sm);
  margin-bottom: 0.75rem;
}
.btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
}
.back-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
}
.back-link:hover {
  color: var(--color-primary);
}
</style>
