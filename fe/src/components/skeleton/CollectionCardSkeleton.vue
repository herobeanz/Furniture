<template>
  <article class="collection-card-skeleton">
    <UiSkeleton :width="'100%'" :height="'100%'" class="skeleton-image" />
    <div class="skeleton-footer">
      <div class="skeleton-text">
        <UiSkeleton :width="'70%'" :height="14" />
        <UiSkeleton :width="'45%'" :height="12" />
      </div>
      <UiSkeleton :width="28" :height="28" circle />
    </div>
  </article>
</template>

<script setup lang="ts">
import UiSkeleton from '@/components/ui/Skeleton.vue'
</script>

<style scoped>
.collection-card-skeleton {
  background: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.skeleton-image {
  display: block;
  height: 13rem;
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
}

.skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
}
</style>
