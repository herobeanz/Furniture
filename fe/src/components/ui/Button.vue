<template>
  <component
    :is="tag"
    :type="tag === 'button' ? (type as 'button' | 'submit' | 'reset') : undefined"
    :class="['ui-button', variant, { 'ui-button-block': block }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'ghost'
    type?: string
    tag?: 'button' | 'a'
    block?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', tag: 'button', block: false, disabled: false }
)
defineEmits<{ click: [e: MouseEvent] }>()
</script>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: var(--fs-body-sm);
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  font-family: inherit;
}
.ui-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.ui-button-primary {
  background: var(--color-primary);
  color: #fff;
}
.ui-button-primary:hover:not(:disabled) {
  background: var(--color-primary-hover, #a00);
}
.ui-button-outline {
  background: transparent;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
}
.ui-button-outline:hover:not(:disabled) {
  background: #1a1a1a;
  color: #fff;
}
.ui-button-ghost {
  background: transparent;
  color: #1a1a1a;
}
.ui-button-ghost:hover:not(:disabled) {
  background: var(--color-bg-alt);
}
.ui-button-block {
  width: 100%;
}
</style>
