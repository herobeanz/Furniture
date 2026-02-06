<template>
  <section class="home-sale-banner-section">
    <div class="container">
      <p class="sale-banner-text">{{ text }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: 'GIẢM SỐC TOÀN BỘ SẢN PHẨM LÊN ĐẾN 50%',
  }
)
</script>

<style scoped>
.home-sale-banner-section {
  background: var(--color-primary);
  color: #fff;
  padding: 1rem;
  text-align: center;
}
.sale-banner-text {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  margin: 0;
}
</style>
