<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      type="button"
      class="btn-page"
      :disabled="currentPage <= 1"
      @click="$emit('goPage', currentPage - 1)"
    >
      Trước
    </button>
    <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
    <button
      type="button"
      class="btn-page"
      :disabled="currentPage >= totalPages"
      @click="$emit('goPage', currentPage + 1)"
    >
      Sau
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
}

defineProps<Props>()

defineEmits<{
  goPage: [page: number]
}>()
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-page:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-info {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .pagination {
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn-page {
    padding: 0.45rem 0.875rem;
    font-size: var(--fs-body-sm);
  }

  .page-info {
    font-size: var(--fs-body-sm);
  }
}

@media (max-width: 480px) {
  .pagination {
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .btn-page {
    padding: 0.4rem 0.75rem;
    font-size: var(--fs-body-sm);
    min-width: 60px;
  }

  .page-info {
    font-size: var(--fs-body-sm);
  }
}
</style>
