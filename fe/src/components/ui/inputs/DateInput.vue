<template>
  <div class="field-wrap">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="mode === 'date' ? 10 : 7"
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
import { formatDateInput, isValidDate, sanitizeDateInput } from '@/utils/inputValidation'

const props = withDefaults(
  defineProps<{
    modelValue: string
    mode?: 'date' | 'month'
    placeholder?: string
    disabled?: boolean
  }>(),
  { mode: 'date', placeholder: 'dd/MM/yyyy', disabled: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const error = computed(() =>
  props.modelValue && !isValidDate(props.modelValue, props.mode)
    ? 'Ngày không hợp lệ, vui lòng kiểm tra định dạng'
    : '',
)
const showError = computed(() => !!error.value)

function onInput(event: Event) {
  emit('update:modelValue', sanitizeDateInput((event.target as HTMLInputElement).value))
}

function onBlur(event: Event) {
  emit('update:modelValue', formatDateInput((event.target as HTMLInputElement).value, props.mode))
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
  font-size: var(--fs-body-sm);
  color: var(--color-heading);
}
.field-input:focus { outline: none; border-color: var(--color-primary); }
.field-input--error { border-color: #dc2626; }
.field-error { margin: 0; font-size: var(--fs-body-sm); color: #dc2626; }
</style>
