<template>
  <div class="category-tabs">
    <div class="tabs-container">
      <RouterLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/${roomSlug}/${cat.slug}`"
        class="tab-item"
        :class="{ active: activeCategorySlug === cat.slug }"
      >
        {{ cat.name }}
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
  activeCategorySlug?: string
}

withDefaults(defineProps<Props>(), {
  activeCategorySlug: '',
})
</script>

<style scoped>
.category-tabs {
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-border);
}

.tabs-container {
  display: flex;
  gap: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.tabs-container::-webkit-scrollbar {
  height: 4px;
}

.tabs-container::-webkit-scrollbar-track {
  background: transparent;
}

.tabs-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

.tabs-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

.tab-item {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  position: relative;
  top: 2px;
}

.tab-item:hover {
  color: var(--color-primary);
  background: rgba(0, 0, 0, 0.02);
}

.tab-item.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .tab-item {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .category-tabs {
    margin-bottom: 1.5rem;
  }
  .tab-item {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    min-width: fit-content;
  }
}

@media (max-width: 480px) {
  .tab-item {
    padding: 0.625rem 0.875rem;
    font-size: 0.85rem;
  }
}
</style>
