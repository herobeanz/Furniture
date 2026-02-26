<template>
  <section class="home-sale-banner-section">
    <div class="container">
      <div class="sale-banner">
        <p class="sale-banner-text">{{ text }}</p>
      </div>
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
  padding: 1.25rem 0;
  background: #fff;
}
.sale-banner {
  position: relative;
  background: #b30000;
  color: #fff;
  text-align: center;
  padding: 0.9rem 1rem;
}
.sale-banner::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px dashed rgba(255, 255, 255, 0.7);
  pointer-events: none;
}
.sale-banner-text {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}
</style>
