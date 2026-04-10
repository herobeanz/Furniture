import { useToastStore } from '@/stores/toast'
import type { ToastVariant } from '@/stores/toast'

export function useToast() {
  const store = useToastStore()

  function toast(options: {
    title: string
    description?: string
    variant?: ToastVariant
    duration?: number
  }) {
    return store.add(options)
  }

  toast.success = (title: string, description?: string, duration?: number) => {
    return store.add({ title, description, variant: 'success', duration })
  }

  toast.error = (title: string, description?: string, duration?: number) => {
    return store.add({ title, description, variant: 'error', duration })
  }

  toast.warning = (title: string, description?: string, duration?: number) => {
    return store.add({ title, description, variant: 'warning', duration })
  }

  return {
    toast,
    dismiss: store.remove,
    dismissAll: store.clear,
  }
}
