import { getApiOrigin, resolveMediaUrl } from '@/utils/mediaUrl'

/** Plain text from HTML (validation, word count). */
export function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isRichTextEmpty(html: string | undefined | null): boolean {
  return !stripHtml(html ?? '')
}

export function countRichTextWords(html: string): number {
  const text = stripHtml(html)
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

/** Resolve /uploads/ paths for TinyMCE preview in admin. */
export function toEditorHtml(html: string): string {
  if (!html) return ''
  return html.replace(
    /src=(["'])(\/uploads\/[^"']+)\1/gi,
    (_match, quote: string, path: string) => `src=${quote}${resolveMediaUrl(path)}${quote}`,
  )
}

/** Prefer relative /uploads/ paths when saving to DB. */
export function fromEditorHtml(html: string): string {
  if (!html) return ''
  const origin = getApiOrigin().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.replace(
    new RegExp(`src=(["'])${origin}(/uploads/[^"']+)\\1`, 'gi'),
    (_match, quote: string, path: string) => `src=${quote}${path}${quote}`,
  )
}

/** Public pages: ensure images in stored HTML render correctly. */
export function resolveRichContentHtml(html: string): string {
  if (!html) return ''
  return html.replace(
    /src=(["'])(\/uploads\/[^"']+)\1/gi,
    (_match, quote: string, path: string) => `src=${quote}${resolveMediaUrl(path)}${quote}`,
  )
}
