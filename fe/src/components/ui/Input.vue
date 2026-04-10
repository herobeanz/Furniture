<template>
  <input
    :id="inputId"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    class="ui-input"
    :class="{ 'ui-input-error': error, 'ui-input-disabled': disabled }"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    placeholder?: string
    error?: boolean
    disabled?: boolean
    required?: boolean
    inputId?: string
  }>(),
  { type: 'text', disabled: false, required: false, error: false }
)
defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = computed(() => props.inputId || 'input-' + Math.random().toString(36).slice(2))
</script>

<style scoped>
.ui-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.ui-input::placeholder {
  color: #9ca3af;
}

.ui-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ui-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.ui-input-error {
  border-color: #dc2626;
  background: #fef2f2;
}

.ui-input-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
</style>
