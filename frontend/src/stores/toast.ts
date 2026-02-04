import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
  duration?: number
  createdAt: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastItem[]>([])

  function add(options: {
    title: string
    description?: string
    variant?: ToastVariant
    duration?: number
  }) {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9)
    const duration = options.duration ?? 5000
    const item: ToastItem = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? 'default',
      duration: duration > 0 ? duration : undefined,
      createdAt: Date.now(),
    }
    toasts.value.push(item)
    return id
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function clear() {
    toasts.value = []
  }

  return {
    toasts,
    add,
    remove,
    clear,
  }
})
