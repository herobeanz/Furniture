/**
 * Extract error message from error object
 */
export function extractErrorMessage(e: any, defaultMessage = 'Đã xảy ra lỗi.'): string {
  return e?.response?.data?.message || e?.response?.data?.details?.[0] || e?.message || defaultMessage
}

/**
 * Check if error is a 404 Not Found
 */
export function isNotFoundError(e: any, patterns: string[] = ['not found']): boolean {
  const statusCode = e?.response?.status
  const errorMessage = e?.response?.data?.message || e?.message || ''
  
  if (statusCode === 404) return true
  
  return patterns.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  )
}
