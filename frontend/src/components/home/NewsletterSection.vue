<template>
  <section class="home-newsletter-section">
    <div class="container newsletter-inner">
      <h2 class="newsletter-title">Đăng ký nhận tin</h2>
      <p>Tham gia nhận cập nhật khuyến mãi và mã giảm giá.</p>
      <form class="newsletter-form" @submit.prevent="handleSubmit">
        <input v-model="email" type="email" placeholder="Email của bạn..." required />
        <button type="submit" class="btn btn-primary">Gửi</button>
      </form>
      <div class="newsletter-social">
        <a href="https://m.me/cuahangdogohungcuong" aria-label="Facebook">FB</a>
        <a href="#" aria-label="Zalo">Zalo</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

function handleSubmit() {
  alert('Cảm ơn bạn đã đăng ký: ' + email.value)
  email.value = ''
}
</script>

<style scoped>
.home-newsletter-section {
  padding: 2.5rem 0;
  background: #1a1a1a;
  color: #fff;
}
.newsletter-inner {
  text-align: center;
  max-width: 520px;
  margin: 0 auto;
}
.newsletter-title {
  font-size: 1.35rem;
  margin-bottom: 0.5rem;
}
.newsletter-inner > p {
  color: #aaa;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
}
.newsletter-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.newsletter-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: none;
}
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}
.btn-primary {
  background: var(--color-primary, #1976d2);
  color: #fff;
}
.btn-primary:hover {
  background: #1565c0;
}
.newsletter-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.newsletter-social a {
  color: #aaa;
  font-size: 0.9rem;
  text-decoration: none;
}
.newsletter-social a:hover {
  color: #fff;
}
</style>
