<template>
  <div class="ui-card" :class="{ 'ui-card-padded': padded }">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean
  }>(),
  { padded: true }
)
</script>

<style scoped>
.ui-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.ui-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
.ui-card-padded {
  padding: 1.25rem;
}
</style>
