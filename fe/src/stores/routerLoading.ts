import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouterLoadingStore = defineStore('routerLoading', () => {
  const isLoading = ref(false)
  const loadingMessage = ref<string | null>(null)
  const activeRequests = ref(0)
  let showTimer: ReturnType<typeof setTimeout> | null = null
  let hideTimer: ReturnType<typeof setTimeout> | null = null
  let shownAt = 0

  const SHOW_DELAY_MS = 120
  const MIN_VISIBLE_MS = 240

  function clearShowTimer() {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }
  }

  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  function start(message?: string) {
    activeRequests.value += 1
    loadingMessage.value = message || loadingMessage.value
    clearHideTimer()

    if (isLoading.value) return
    if (showTimer) return

    showTimer = setTimeout(() => {
      showTimer = null
      if (activeRequests.value > 0) {
        isLoading.value = true
        shownAt = Date.now()
      }
    }, SHOW_DELAY_MS)
  }

  function stop() {
    activeRequests.value = Math.max(0, activeRequests.value - 1)
    if (activeRequests.value > 0) return

    clearShowTimer()
    loadingMessage.value = null

    if (!isLoading.value) return

    const elapsed = Date.now() - shownAt
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed)
    clearHideTimer()
    hideTimer = setTimeout(() => {
      hideTimer = null
      if (activeRequests.value === 0) {
        isLoading.value = false
      }
    }, remaining)
  }

  return {
    isLoading,
    loadingMessage,
    activeRequests,
    start,
    stop,
  }
})
