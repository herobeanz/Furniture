import { defineStore } from 'pinia'
import { collectionApi, type Collection } from '@/services/api/collections'
import { isCacheFresh, type TimedEntry } from '@/utils/cacheEntry'

const LIST_KEY = 'all'

let loadListPromise: Promise<Collection[]> | null = null

export const useCollectionsCacheStore = defineStore('collectionsCache', () => {
  const listCache = new Map<string, TimedEntry<Collection[]>>()
  const detailCache = new Map<string, TimedEntry<Collection>>()

  function peekList(): Collection[] | undefined {
    return listCache.get(LIST_KEY)?.data
  }

  function isListFresh(): boolean {
    const entry = listCache.get(LIST_KEY)
    return !!entry && isCacheFresh(entry.fetchedAt)
  }

  async function fetchList(options?: { force?: boolean }): Promise<Collection[]> {
    const hit = listCache.get(LIST_KEY)
    if (hit && isCacheFresh(hit.fetchedAt) && !options?.force) {
      return hit.data
    }

    if (loadListPromise && !options?.force) {
      return loadListPromise
    }

    loadListPromise = (async () => {
      try {
        const data = await collectionApi.getCollections()
        listCache.set(LIST_KEY, { data, fetchedAt: Date.now() })
        return data
      } finally {
        loadListPromise = null
      }
    })()

    return loadListPromise
  }

  function peekBySlug(slug: string): Collection | undefined {
    return detailCache.get(slug)?.data
  }

  function isDetailFresh(slug: string): boolean {
    const entry = detailCache.get(slug)
    return !!entry && isCacheFresh(entry.fetchedAt)
  }

  async function fetchBySlug(
    slug: string,
    options?: { force?: boolean },
  ): Promise<Collection> {
    const hit = detailCache.get(slug)
    if (hit && isCacheFresh(hit.fetchedAt) && !options?.force) {
      return hit.data
    }
    const data = await collectionApi.getCollectionBySlug(slug)
    detailCache.set(slug, { data, fetchedAt: Date.now() })
    return data
  }

  function invalidateAll(): void {
    listCache.clear()
    detailCache.clear()
  }

  return {
    peekList,
    isListFresh,
    fetchList,
    peekBySlug,
    isDetailFresh,
    fetchBySlug,
    invalidateAll,
  }
})
