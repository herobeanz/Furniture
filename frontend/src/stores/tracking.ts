import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'furniture-anonymous-id'

function getOrCreateAnonymousId(): string {
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36)
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export const useTrackingStore = defineStore('tracking', () => {
  const anonymousId = ref(getOrCreateAnonymousId())

  function trackPageView(path: string, name?: string) {
    if (typeof window === 'undefined') return
    // Có thể gửi lên analytics sau: { anonymousId: anonymousId.value, path, name, timestamp }
    console.debug('[tracking] pageView', { path, name })
  }

  function getAnonymousId(): string {
    return anonymousId.value
  }

  return {
    anonymousId,
    trackPageView,
    getAnonymousId,
  }
})
