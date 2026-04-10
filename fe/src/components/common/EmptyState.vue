<template>
  <div class="empty-state">
    <p>{{ message }}</p>
    <RouterLink v-if="actionLink" :to="actionLink" class="btn btn-primary">
      {{ actionText }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(defineProps<{
  message: string
  actionText?: string
  actionLink?: string
}>(), {
  actionText: 'Về trang chủ',
  actionLink: '/',
})
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
}
.empty-state p {
  margin-bottom: 1rem;
}
</style>
