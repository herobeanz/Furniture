import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient, { getAdminToken, setAdminToken, clearAdminToken } from '@/services/api/client'
import { unwrapResponseData } from '@/services/api/response'

interface Admin {
  id: string
  username: string
  email?: string
  fullName?: string
  role?: string
}

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref<string | null>(getAdminToken())
  const admin = ref<Admin | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/auth/login', { username, password })
      const data = unwrapResponseData<{ accessToken: string; admin: Admin }>(response)
      token.value = data.accessToken
      admin.value = data.admin
      setAdminToken(data.accessToken)
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Đăng nhập thất bại'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    error.value = null
    try {
      const response = await apiClient.get('/auth/me')
      const data = unwrapResponseData<Admin>(response)
      admin.value = data
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Không thể tải thông tin'
      throw err
    }
  }

  function logout() {
    token.value = null
    admin.value = null
    error.value = null
    clearAdminToken()
  }

  return {
    token,
    admin,
    error,
    isLoading,
    isAuthenticated,
    login,
    fetchMe,
    logout,
  }
})
