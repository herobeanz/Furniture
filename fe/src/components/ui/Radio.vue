<template>
  <div class="ui-radio-wrapper">
    <input
      :id="radioId"
      type="radio"
      :name="name"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :required="required"
      class="ui-radio"
      @change="$emit('update:modelValue', value)"
    />
    <label v-if="label" :for="radioId" class="ui-radio-label">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    value: string | number
    name?: string
    label?: string
    checked?: boolean
    disabled?: boolean
    required?: boolean
    radioId?: string
  }>(),
  { disabled: false, required: false }
)
defineEmits<{ 'update:modelValue': [value: string | number] }>()

const radioId = computed(() => props.radioId || 'radio-' + Math.random().toString(36).slice(2))

const checked = computed(() => {
  if (props.checked !== undefined) return props.checked
  return props.modelValue === props.value
})
</script>

<style scoped>
.ui-radio-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ui-radio {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: #3b82f6;
  flex-shrink: 0;
}

.ui-radio:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ui-radio-label {
  font-size: var(--fs-body-sm);
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.ui-radio:disabled + .ui-radio-label {
  cursor: not-allowed;
  color: #9ca3af;
}
</style>
