<template>
  <div class="field-wrap">
    <div class="range-grid">
      <input
        :value="modelValue.from"
        type="text"
        maxlength="10"
        :disabled="disabled"
        placeholder="Từ ngày (dd/MM/yyyy)"
        class="field-input"
        @input="onFromInput"
        @blur="onBlur"
      />
      <input
        :value="modelValue.to"
        type="text"
        maxlength="10"
        :disabled="disabled"
        placeholder="Đến ngày (dd/MM/yyyy)"
        class="field-input"
        @input="onToInput"
        @blur="onBlur"
      />
    </div>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDateInput, sanitizeDateInput, validateDateRange } from '@/utils/inputValidation'

const props = withDefaults(
  defineProps<{
    modelValue: { from: string; to: string }
    required?: boolean
    disabled?: boolean
  }>(),
  { required: true, disabled: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: { from: string; to: string }] }>()

const error = computed(() => {
  const result = validateDateRange(props.modelValue.from, props.modelValue.to, props.required)
  return result.valid ? '' : result.message || 'Khoảng ngày không hợp lệ'
})

function onFromInput(event: Event) {
  emit('update:modelValue', {
    ...props.modelValue,
    from: sanitizeDateInput((event.target as HTMLInputElement).value),
  })
}

function onToInput(event: Event) {
  emit('update:modelValue', {
    ...props.modelValue,
    to: sanitizeDateInput((event.target as HTMLInputElement).value),
  })
}

function onBlur() {
  emit('update:modelValue', {
    from: formatDateInput(props.modelValue.from, 'date'),
    to: formatDateInput(props.modelValue.to, 'date'),
  })
}
</script>

<style scoped>
.field-wrap { display: flex; flex-direction: column; gap: 0.25rem; }
.range-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
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
.field-error { margin: 0; font-size: var(--fs-body-sm); color: #dc2626; }
</style>
