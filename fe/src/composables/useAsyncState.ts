import { ref, type Ref } from 'vue'

interface UseAsyncStateOptions {
  /** Run the async function immediately on call. Default: false */
  immediate?: boolean
}

interface UseAsyncStateReturn<T> {
  data: Ref<T | null>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  execute: () => Promise<void>
}

/**
 * Composable for managing async data fetching state.
 * Handles loading, error, and data state automatically.
 *
 * @example
 * const { data, isLoading, error } = useAsyncState(
 *   () => productApi.getProducts(),
 *   { immediate: true }
 * )
 */
export function useAsyncState<T>(
  fn: () => Promise<T>,
  options: UseAsyncStateOptions = {},
): UseAsyncStateReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function execute() {
    isLoading.value = true
    error.value = null
    try {
      data.value = await fn()
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || 'Đã xảy ra lỗi'
    } finally {
      isLoading.value = false
    }
  }

  if (options.immediate) {
    execute()
  }

  return { data, isLoading, error, execute }
}
