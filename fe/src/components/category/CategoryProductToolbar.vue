<template>
  <div class="category-toolbar">
    <label class="category-sort-wrap">
      <span class="category-toolbar-label">Sắp xếp:</span>
      <span class="visually-hidden">Sắp xếp sản phẩm</span>
      <select
        class="category-sort-select"
        :value="sortKey"
        @change="onSortChange"
      >
        <option
          v-for="opt in CATEGORY_SORT_OPTIONS"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <i
        class="fa-solid fa-chevron-down category-sort-chevron"
        aria-hidden="true"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import {
  CATEGORY_SORT_OPTIONS,
  type ProductsPageSortKey,
} from '@/constants/category-page'

defineProps<{
  sortKey: ProductsPageSortKey
}>()

const emit = defineEmits<{
  'update:sortKey': [value: ProductsPageSortKey]
}>()

function onSortChange(e: Event) {
  emit(
    'update:sortKey',
    (e.target as HTMLSelectElement).value as ProductsPageSortKey,
  )
}
</script>

<style scoped>
.category-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 1rem;
}

.category-sort-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--fs-body-sm);
}

.category-toolbar-label {
  font-weight: 500;
  color: var(--color-text-light);
  white-space: nowrap;
}

.category-sort-select {
  width: 9rem;
  padding: 0.375rem 1.75rem 0.375rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  background: #fff;
  appearance: none;
  cursor: pointer;
}

.category-sort-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.category-sort-chevron {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--fs-caption);
  color: var(--color-text-light);
  pointer-events: none;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
