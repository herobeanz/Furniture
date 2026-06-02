<template>
  <div class="field-wrap">
    <input
      :value="modelValue"
      type="email"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :maxlength="255"
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
import { validateEmailStrict } from '@/utils/inputValidation'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    placeholder: 'Email',
    required: false,
    disabled: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { error, showError, onBlur: validateOnBlur } = useInlineValidation(validateEmailStrict)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value.slice(0, 255))
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
  font-size: 0.75rem;
  color: var(--color-heading);
}
.field-input:focus { outline: none; border-color: var(--color-primary); }
.field-input--error { border-color: #dc2626; }
.field-error { margin: 0; font-size: 0.6875rem; color: #dc2626; }
</style>
