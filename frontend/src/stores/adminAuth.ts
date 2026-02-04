import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/api.client'
import { getAdminToken, setAdminToken, clearAdminToken } from '@/services/api.client'

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref<string | null>(getAdminToken())
  const admin = ref<{ id: string; username: string; email?: string; fullName?: string; role?: string } | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const data = await apiClient.post('/auth/login', { username, password }) as {
      accessToken: string
      admin: { id: string; username: string; email?: string; fullName?: string; role?: string }
    }
    token.value = data.accessToken
    admin.value = data.admin
    setAdminToken(data.accessToken)
    return data
  }

  async function fetchMe() {
    if (!token.value) return
    const data = await apiClient.get('/auth/me') as { id: string; username: string; email?: string; fullName?: string; role?: string }
    admin.value = data
    return data
  }

  function logout() {
    token.value = null
    admin.value = null
    clearAdminToken()
  }

  return {
    token,
    admin,
    isAuthenticated,
    login,
    fetchMe,
    logout,
  }
})
