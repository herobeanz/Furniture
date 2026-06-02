<template>
  <div class="field-wrap">
    <input
      :value="modelValue"
      type="text"
      maxlength="4"
      :placeholder="placeholder"
      :disabled="disabled"
      class="field-input"
      :class="{ 'field-input--error': showError }"
      @input="onInput"
      @blur="onBlur"
    />
    <p v-if="showError" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sanitizeNumericInput, validateYear } from '@/utils/inputValidation'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    disabled?: boolean
  }>(),
  { placeholder: 'YYYY', disabled: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const error = computed(() => {
  if (!props.modelValue) return ''
  const result = validateYear(props.modelValue)
  return result.valid ? '' : result.message || 'Năm không hợp lệ'
})
const showError = computed(() => !!error.value)

function onInput(event: Event) {
  emit('update:modelValue', sanitizeNumericInput((event.target as HTMLInputElement).value).slice(0, 4))
}

function onBlur() {
  emit('update:modelValue', props.modelValue.slice(0, 4))
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
.field-input--error { border-color: #dc2626; }
.field-error { margin: 0; font-size: 0.6875rem; color: #dc2626; }
</style>
