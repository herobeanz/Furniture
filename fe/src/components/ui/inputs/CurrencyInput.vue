<template>
  <div class="field-wrap">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      maxlength="15"
      class="field-input"
      @input="onInput"
      @blur="onBlur"
    />
    <p v-if="showError" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatCurrency, sanitizeCurrencyInput, type CurrencyCode } from '@/utils/inputValidation'

const props = withDefaults(
  defineProps<{
    modelValue: string
    currency?: CurrencyCode
    placeholder?: string
    disabled?: boolean
  }>(),
  { currency: 'VND', placeholder: 'Số tiền', disabled: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const error = ref('')
const showError = ref(false)

function onInput(event: Event) {
  const raw = sanitizeCurrencyInput((event.target as HTMLInputElement).value).slice(0, 15)
  emit('update:modelValue', raw)
  showError.value = false
}

function onBlur() {
  const formatted = formatCurrency(props.modelValue, props.currency)
  if (!formatted && props.modelValue.trim()) {
    error.value = 'Số tiền không hợp lệ'
    showError.value = true
    return
  }
  emit('update:modelValue', formatted)
  showError.value = false
}
</script>

<style scoped>
.field-wrap { display: flex; flex-direction: column; gap: 0.25rem; }
.field-input {
  width: 100%;
  background: rgba(249, 250, 251, 0.5);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: var(--color-heading);
}
.field-input:focus { outline: none; border-color: var(--color-primary); }
.field-error { margin: 0; font-size: 0.6875rem; color: #dc2626; }
</style>
