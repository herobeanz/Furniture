<template>
  <div class="field-wrap">
    <input
      :value="modelValue"
      type="tel"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :maxlength="15"
      class="field-input"
      :class="{ 'field-input--error': showError }"
      @input="onInput"
      @blur="onBlur"
    />
    <p v-if="showError" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useInlineValidation } from '@/composables/forms/useInlineValidation'
import { sanitizePhoneInput, validatePhoneVN } from '@/utils/inputValidation'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    placeholder: 'Số điện thoại',
    required: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { error, showError, onBlur: validateOnBlur } = useInlineValidation(validatePhoneVN)

function onInput(event: Event) {
  const value = sanitizePhoneInput((event.target as HTMLInputElement).value)
  emit('update:modelValue', value)
}

function onBlur() {
  validateOnBlur(props.modelValue)
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
