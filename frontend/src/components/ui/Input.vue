<template>
  <div class="ui-input-wrap">
    <label v-if="label" class="ui-input-label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="ui-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="ui-input-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    type?: string
    label?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
  }>(),
  { type: 'text', disabled: false, required: false }
)
defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = computed(() => 'input-' + Math.random().toString(36).slice(2))
</script>

<style scoped>
.ui-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.ui-input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}
.ui-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: #fff;
  font-family: inherit;
}
.ui-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.15);
}
.ui-input:disabled {
  background: var(--color-bg-alt);
  cursor: not-allowed;
}
.ui-input-error {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-primary);
}
</style>
