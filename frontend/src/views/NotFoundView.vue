<template>
  <div class="not-found container">
    <h1>404</h1>
    <p>Trang bạn tìm không tồn tại.</p>
    <RouterLink to="/" class="btn btn-primary">Về trang chủ</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found {
  padding: 4rem 1.5rem;
  text-align: center;
}
.not-found h1 {
  font-size: 4rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-muted);
}
.not-found p {
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
}
</style>
