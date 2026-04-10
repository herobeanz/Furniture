<template>
  <textarea
    :id="textareaId"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :rows="rows"
    class="ui-textarea"
    :class="{ 'ui-textarea-error': error, 'ui-textarea-disabled': disabled }"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    error?: boolean
    disabled?: boolean
    required?: boolean
    rows?: number
    textareaId?: string
  }>(),
  { disabled: false, required: false, rows: 3, error: false }
)
defineEmits<{ 'update:modelValue': [value: string] }>()

const textareaId = computed(() => props.textareaId || 'textarea-' + Math.random().toString(36).slice(2))
</script>

<style scoped>
.ui-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.ui-textarea::placeholder {
  color: #9ca3af;
}

.ui-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ui-textarea:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.ui-textarea-error {
  border-color: #dc2626;
  background: #fef2f2;
}

.ui-textarea-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
</style>
