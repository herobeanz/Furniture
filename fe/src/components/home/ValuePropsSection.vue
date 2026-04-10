<template>
  <section class="home-value-props-section">
    <div class="container">
      <div class="value-grid">
        <div v-for="item in items" :key="item.icon" class="value-item">
          <span class="value-icon">{{ item.icon }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  { icon: '🏷️', title: 'Giá tốt mỗi ngày', description: 'Mức giá phù hợp với túi tiền của bạn' },
  { icon: '🚚', title: 'Giao hàng từ 2 triệu', description: 'Giao nhanh trong 1–2 ngày' },
  { icon: '☎️', title: 'Hỗ trợ 24/7', description: 'Đội ngũ tư vấn sẵn sàng phục vụ' },
  { icon: '🛍️', title: 'Đa dạng sản phẩm', description: 'Nội thất đủ phong cách, một điểm đến' },
]
</script>

<style scoped>
.home-value-props-section {
  padding: 2rem 0;
  background: #fff;
}
.value-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.value-item {
  text-align: center;
  padding: 1rem;
}
.value-icon {
  font-size: 1.75rem;
  display: block;
  margin-bottom: 0.5rem;
}
.value-item h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}
.value-item p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .value-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .value-grid {
    grid-template-columns: 1fr;
  }
}
</style>
