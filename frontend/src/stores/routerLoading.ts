import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouterLoadingStore = defineStore('routerLoading', () => {
  const isLoading = ref(false)
  const loadingMessage = ref<string | null>(null)

  function start(message?: string) {
    isLoading.value = true
    loadingMessage.value = message || null
  }

  function stop() {
    isLoading.value = false
    loadingMessage.value = null
  }

  return {
    isLoading,
    loadingMessage,
    start,
    stop,
  }
})
