import axios from 'axios'
import { logger } from '@/utils/logger'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

const ADMIN_TOKEN_KEY = 'admin_token'

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request: attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAdminToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

function shouldForceLogoutOn401(url: string | undefined): boolean {
  if (!url) return true
  // Authenticated account actions may return 401 for business errors on older APIs.
  if (url.includes('/auth/change-password') || url.includes('/auth/profile')) {
    return false
  }
  return true
}

// Response: handle 401 → logout + redirect (session expired / invalid token)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url as string | undefined

    if (status === 401 && shouldForceLogoutOn401(requestUrl)) {
      clearAdminToken()
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    } else if (error.response) {
      logger.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      logger.error('Network Error:', error.message)
    } else {
      logger.error('Request Error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default apiClient
