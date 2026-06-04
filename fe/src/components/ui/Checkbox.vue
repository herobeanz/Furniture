<template>
  <div class="ui-checkbox-wrapper">
    <input
      :id="checkboxId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :required="required"
      class="ui-checkbox"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label v-if="label" :for="checkboxId" class="ui-checkbox-label">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    disabled?: boolean
    required?: boolean
    checkboxId?: string
  }>(),
  { disabled: false, required: false }
)
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const checkboxId = computed(() => props.checkboxId || 'checkbox-' + Math.random().toString(36).slice(2))
</script>

<style scoped>
.ui-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ui-checkbox {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: #3b82f6;
  flex-shrink: 0;
}

.ui-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ui-checkbox-label {
  font-size: var(--fs-body-sm);
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.ui-checkbox:disabled + .ui-checkbox-label {
  cursor: not-allowed;
  color: #9ca3af;
}
</style>
