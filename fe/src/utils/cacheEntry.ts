/** Thời gian cache client (ms) — dùng chung cho Pinia stores */
export const CACHE_STALE_MS = 5 * 60 * 1000
export const CATEGORY_TREE_STALE_MS = 10 * 60 * 1000

export interface TimedEntry<T> {
  data: T
  fetchedAt: number
}

export function isCacheFresh(
  fetchedAt: number,
  staleMs: number = CACHE_STALE_MS,
): boolean {
  return Date.now() - fetchedAt < staleMs
}
