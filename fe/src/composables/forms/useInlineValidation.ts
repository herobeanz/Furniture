import { computed, ref } from 'vue'
import type { ValidationResult } from '@/utils/inputValidation'

export function useInlineValidation(
  validator: (value: string) => ValidationResult,
) {
  const touched = ref(false)
  const error = ref('')

  function validate(value: string): boolean {
    const result = validator(value)
    error.value = result.valid ? '' : result.message || 'Giá trị không hợp lệ'
    return result.valid
  }

  function onBlur(value: string): boolean {
    touched.value = true
    return validate(value)
  }

  function clear() {
    touched.value = false
    error.value = ''
  }

  const showError = computed(() => touched.value && !!error.value)

  return {
    touched,
    error,
    showError,
    validate,
    onBlur,
    clear,
  }
}
