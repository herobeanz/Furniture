/**
 * Persists in-progress admin form state across preview navigation.
 * Preview routes unmount admin views; restoring from sessionStorage avoids data loss.
 */
import { logger } from '@/utils/logger'

const PREFIX = 'admin_form_draft_'
const TTL_MS = 2 * 60 * 60 * 1000

interface StoredDraft<T> {
  data: T
  savedAt: number
}

function storageKey(routePath: string): string {
  return `${PREFIX}${routePath}`
}

export function saveAdminFormDraft<T>(routePath: string, data: T): void {
  const key = storageKey(routePath)
  try {
    const payload: StoredDraft<T> = { data, savedAt: Date.now() }
    sessionStorage.setItem(key, JSON.stringify(payload))
  } catch (e) {
    logger.error('Failed to save admin form draft:', e)
  }
}

export function getAdminFormDraft<T>(routePath: string): T | null {
  const key = storageKey(routePath)
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredDraft<T>
    if (Date.now() - parsed.savedAt > TTL_MS) {
      sessionStorage.removeItem(key)
      return null
    }
    return parsed.data
  } catch (e) {
    logger.error('Failed to read admin form draft:', e)
    return null
  }
}

export function clearAdminFormDraft(routePath: string): void {
  try {
    sessionStorage.removeItem(storageKey(routePath))
  } catch (e) {
    logger.error('Failed to clear admin form draft:', e)
  }
}
