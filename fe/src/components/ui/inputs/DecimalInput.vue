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
  </div>
</template>

<script setup lang="ts">
import { formatDecimal2, sanitizeCurrencyInput } from '@/utils/inputValidation'

withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    disabled?: boolean
  }>(),
  { placeholder: 'Số thập phân', disabled: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(event: Event) {
  const value = sanitizeCurrencyInput((event.target as HTMLInputElement).value).slice(0, 15)
  emit('update:modelValue', value)
}

function onBlur(event: Event) {
  emit('update:modelValue', formatDecimal2((event.target as HTMLInputElement).value))
}
</script>

<style scoped>
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
</style>
