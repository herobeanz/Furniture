/**
 * Format price for VND
 */
export function formatPrice(value: number, currency = 'VND'): string {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(value)
  // Replace ₫ with đ for Vietnamese currency display
  return formatted.replace('₫', 'đ')
}

/**
 * Format blog date
 */
export function formatBlogDate(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format blog content (convert line breaks to HTML)
 */
export function formatBlogContent(content: string): string {
  return content.replace(/\n/g, '<br>')
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
