<template>
  <div class="checkout-page container">
    <h1>Thanh toán</h1>
    <p class="checkout-note">Trang thanh toán đang được phát triển.</p>
    <RouterLink to="/cart" class="btn btn-outline">Quay lại giỏ hàng</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.checkout-page {
  padding: 2rem 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}
.checkout-page h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.checkout-note {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}
</style>
