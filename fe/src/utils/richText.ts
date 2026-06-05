import { optimizeRichContentHtml } from '@/utils/imageUrl'

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

/** TinyMCE preview in admin — images are stored as absolute Cloudinary URLs. */
export function toEditorHtml(html: string): string {
  return html ?? ''
}

/** Persist editor HTML as-is (Cloudinary URLs). */
export function fromEditorHtml(html: string): string {
  return html ?? ''
}

/** Public pages: resolve Cloudinary URLs with delivery transforms. */
export function resolveRichContentHtml(html: string): string {
  return optimizeRichContentHtml(html ?? '')
}
