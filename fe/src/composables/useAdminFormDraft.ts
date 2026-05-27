import { useRoute } from 'vue-router'
import {
  clearAdminFormDraft,
  getAdminFormDraft,
  saveAdminFormDraft,
} from '@/utils/adminFormDraft'

/** Save/restore admin form state when navigating to public preview routes. */
export function useAdminFormDraft() {
  const route = useRoute()

  function saveDraft<T>(data: T): void {
    saveAdminFormDraft(route.fullPath, data)
  }

  function restoreDraft<T>(): T | null {
    return getAdminFormDraft<T>(route.fullPath)
  }

  function clearDraft(): void {
    clearAdminFormDraft(route.fullPath)
  }

  return { saveDraft, restoreDraft, clearDraft }
}
