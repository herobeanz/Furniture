<template>
  <div class="blog-page">
    <div class="container">
      <h1 class="blog-title">Blog</h1>
      <p class="blog-desc">Cập nhật xu hướng nội thất, mẹo trang trí và tin tức từ Furniture Store.</p>
      <div class="blog-placeholder">
        <p>Nội dung blog sẽ được cập nhật tại đây.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.blog-page {
  padding: 2rem 0 3rem;
}
.blog-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.blog-desc {
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}
.blog-placeholder {
  padding: 3rem 2rem;
  background: var(--color-bg-alt);
  border-radius: 8px;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
