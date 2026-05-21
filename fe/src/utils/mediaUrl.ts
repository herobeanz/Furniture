const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

/** Origin without /api/v1 suffix (e.g. http://localhost:3000). */
export function getApiOrigin(): string {
  return API_BASE.replace(/\/api\/v1\/?$/, '')
}

/** Resolve stored path (/uploads/...) or absolute URL for <img src>. */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed
  if (trimmed.startsWith('/uploads/')) {
    return `${getApiOrigin()}${trimmed}`
  }
  if (trimmed.startsWith('uploads/')) {
    return `${getApiOrigin()}/${trimmed}`
  }
  return trimmed
}
