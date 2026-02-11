<template>
  <div class="filters-bar">
    <div class="filters-left">
      <span class="product-count">{{ totalProducts }} sản phẩm</span>
    </div>
    <div class="filters-right">
      <select v-model="localSortOption" class="sort-select" @change="$emit('update:sortOption', localSortOption)">
        <option value="createdAt:desc">Mới nhất</option>
        <option value="createdAt:asc">Cũ nhất</option>
        <option value="price:asc">Giá tăng dần</option>
        <option value="price:desc">Giá giảm dần</option>
        <option value="name:asc">Tên A-Z</option>
        <option value="name:desc">Tên Z-A</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  totalProducts: number
  sortOption: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:sortOption': [value: string]
}>()

const localSortOption = ref(props.sortOption)

watch(() => props.sortOption, (newVal) => {
  localSortOption.value = newVal
})
</script>

<style scoped>
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.product-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 150px;
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0;
    margin-bottom: 1rem;
  }

  .filters-left,
  .filters-right {
    width: 100%;
  }

  .product-count {
    font-size: 0.85rem;
  }

  .sort-select {
    width: 100%;
    font-size: 0.85rem;
    padding: 0.625rem 0.875rem;
  }
}

@media (max-width: 480px) {
  .filters-bar {
    padding: 0.5rem 0;
  }

  .product-count {
    font-size: 0.8rem;
  }

  .sort-select {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>
