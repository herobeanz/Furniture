<template>
  <span class="ui-badge" :class="variant">
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'success'
  }>(),
  { variant: 'default' }
)
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
}
.ui-badge-default {
  background: #1a1a1a;
  color: #fff;
}
.ui-badge-primary {
  background: var(--color-primary);
  color: #fff;
}
.ui-badge-success {
  background: #0a0;
  color: #fff;
}
</style>
