/** Resolve absolute Cloudinary (or other) URL for <img src>. */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed
  return trimmed
}
