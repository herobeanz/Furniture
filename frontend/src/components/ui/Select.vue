<template>
  <div class="ui-select-wrapper">
    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      class="ui-select"
      :class="{ 'ui-select-error': error, 'ui-select-disabled': disabled }"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <slot />
    </select>
    <svg
      class="ui-select-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    placeholder?: string
    error?: boolean
    disabled?: boolean
    required?: boolean
    selectId?: string
  }>(),
  { disabled: false, required: false, error: false }
)
defineEmits<{ 'update:modelValue': [value: string] }>()

const selectId = computed(() => props.selectId || 'select-' + Math.random().toString(36).slice(2))
</script>

<style scoped>
.ui-select-wrapper {
  position: relative;
  width: 100%;
}

.ui-select {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-family: inherit;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.ui-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ui-select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.ui-select-error {
  border-color: #dc2626;
  background: #fef2f2;
}

.ui-select-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.ui-select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
}

.ui-select-disabled + .ui-select-icon {
  color: #9ca3af;
}
</style>
