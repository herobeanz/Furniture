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
  padding: 4rem 0;
  background: linear-gradient(180deg, #fff 0%, var(--color-bg-alt) 100%);
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.value-item {
  text-align: center;
  padding: 2rem 1.5rem;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-slow);
  position: relative;
  overflow: hidden;
}

.value-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.value-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-light);
}

.value-item:hover::before {
  transform: scaleX(1);
}

.value-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
  transition: transform var(--transition-base);
}

.value-item:hover .value-icon {
  transform: scale(1.15) rotate(5deg);
}

.value-item h3 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.value-item p {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .home-value-props-section {
    padding: 3.5rem 0;
  }
  
  .value-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }
  
  .value-item {
    padding: 1.75rem 1.25rem;
  }
}

@media (max-width: 768px) {
  .home-value-props-section {
    padding: 3rem 0;
  }
  
  .value-grid {
    gap: 1.5rem;
  }
  
  .value-item {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }
  
  .value-icon {
    font-size: 2.25rem;
    margin-bottom: 0.875rem;
  }
  
  .value-item h3 {
    font-size: 1.0625rem;
  }
  
  .value-item p {
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .home-value-props-section {
    padding: 2.5rem 0;
  }
  
  .value-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .value-item {
    padding: 1.25rem 1rem;
  }
  
  .value-icon {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .home-value-props-section {
    padding: 2rem 0;
  }
  
  .value-grid {
    gap: 1rem;
  }
  
  .value-item {
    padding: 1rem 0.875rem;
    border-radius: 10px;
  }
  
  .value-icon {
    font-size: 1.875rem;
    margin-bottom: 0.75rem;
  }
  
  .value-item h3 {
    font-size: 1rem;
    margin-bottom: 0.375rem;
  }
  
  .value-item p {
    font-size: 0.8125rem;
  }
}
</style>
