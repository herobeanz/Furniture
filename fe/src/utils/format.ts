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

import { resolveRichContentHtml } from '@/utils/richText'

/**
 * Rich HTML from TinyMCE, or plain text with line breaks (legacy).
 */
export function formatRichContent(content: string): string {
  if (!content) return ''
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return resolveRichContentHtml(content)
  }
  return content.replace(/\n/g, '<br>')
}

/** @deprecated Use formatRichContent */
export function formatBlogContent(content: string): string {
  return formatRichContent(content)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
