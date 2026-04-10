<template>
  <div class="error-state">
    <p>{{ message }}</p>
    <RouterLink to="/" class="btn btn-primary">Về trang chủ</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  message: string
}>()
</script>

<style scoped>
.error-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.error-state .btn {
  margin-top: 1rem;
}
</style>
