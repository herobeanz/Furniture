export function apiErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string | string[]; details?: string[] } }
    message?: string
  }
  const message = err.response?.data?.message
  if (Array.isArray(message)) return message.join(', ')
  if (typeof message === 'string' && message !== 'Validation failed') return message
  const details = err.response?.data?.details
  if (Array.isArray(details) && details.length > 0) return details.join(', ')
  return err.message || fallback
}
