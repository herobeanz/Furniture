<template>
  <div class="category-groups-section">
    <div v-if="loading" class="loading">Đang tải danh mục...</div>
    <div v-else-if="categories.length === 0" class="empty">
      <p>Chưa có danh mục trong phòng này.</p>
    </div>
    <div v-else class="category-groups-grid">
      <RouterLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/${roomSlug}/${cat.slug}`"
        class="category-group-card"
      >
        <div class="category-group-image" :class="{ placeholder: !cat.thumbnail }">
          <img v-if="cat.thumbnail" :src="cat.thumbnail" :alt="cat.name" />
          <span v-else>📦</span>
        </div>
        <div class="category-group-info">
          <h3 class="category-group-name">{{ cat.name }}</h3>
          <p v-if="cat.description" class="category-group-desc">{{ cat.description }}</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Category } from '@/services/category.service'

interface Props {
  categories: Category[]
  roomSlug: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<style scoped>
.category-groups-section {
  margin-bottom: 3rem;
}
.category-groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
.category-group-card {
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}
.category-group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.category-group-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--color-bg-alt);
}
.category-group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.category-group-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--color-text-muted);
}
.category-group-info {
  padding: 1rem;
}
.category-group-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.category-group-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}
.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
</style>
