<template>
  <div class="form-field">
    <label v-if="label" class="form-label" :for="fieldId">
      {{ label }}
      <span v-if="optional" class="form-label-optional">Optional</span>
    </label>
    <slot />
    <p v-if="error" class="form-error">{{ error }}</p>
    <p v-if="hint && !error" class="form-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label?: string
  optional?: boolean
  error?: string
  hint?: string
  fieldId?: string
}>()

const fieldId = computed(() => props.fieldId || 'field-' + Math.random().toString(36).slice(2))
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label-optional {
  font-size: var(--fs-body-sm);
  font-weight: 400;
  color: #9ca3af;
}

.form-error {
  margin: 0;
  font-size: var(--fs-body-sm);
  color: #dc2626;
}

.form-hint {
  margin: 0;
  font-size: var(--fs-body-sm);
  color: #6b7280;
}
</style>
