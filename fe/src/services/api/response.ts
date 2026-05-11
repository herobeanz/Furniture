import type { AxiosResponse } from 'axios'

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
}

/**
 * Unwrap standardized { success, data, message } response envelope.
 * Use this in all API service methods.
 */
export function unwrapResponseData<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
  const body = response.data
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return body.data
  }
  // Fallback: return raw data if not wrapped
  return body as unknown as T
}
