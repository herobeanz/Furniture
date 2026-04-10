/**
 * Utility functions for managing preview data
 * Preview data is stored in localStorage to persist across page navigation
 */

const PREVIEW_PREFIX = 'preview_'

export type PreviewType = 'product' | 'blog' | 'cms' | 'collection' | 'category' | 'room'

export function savePreviewData(type: PreviewType, slug: string, data: any) {
  const key = `${PREVIEW_PREFIX}${type}_${slug}`
  try {
    localStorage.setItem(key, JSON.stringify(data))
    // Set expiration (1 hour)
    localStorage.setItem(`${key}_expires`, String(Date.now() + 60 * 60 * 1000))
  } catch (e) {
    console.error('Failed to save preview data:', e)
  }
}

export function getPreviewData(type: PreviewType, slug: string): any | null {
  const key = `${PREVIEW_PREFIX}${type}_${slug}`
  try {
    const expires = localStorage.getItem(`${key}_expires`)
    if (expires && Number(expires) < Date.now()) {
      // Expired, remove it
      clearPreviewData(type, slug)
      return null
    }
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Failed to get preview data:', e)
    return null
  }
}

export function clearPreviewData(type: PreviewType, slug: string) {
  const key = `${PREVIEW_PREFIX}${type}_${slug}`
  try {
    localStorage.removeItem(key)
    localStorage.removeItem(`${key}_expires`)
  } catch (e) {
    console.error('Failed to clear preview data:', e)
  }
}

export function clearAllPreviewData() {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(PREVIEW_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    console.error('Failed to clear all preview data:', e)
  }
}
