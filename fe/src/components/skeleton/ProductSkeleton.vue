<template>
  <div class="product-skeleton">
    <UiSkeleton :width="'100%'" :height="'100%'" class="skeleton-image" />
    <div class="skeleton-info">
      <UiSkeleton :width="'80%'" :height="20" class="skeleton-title" />
      <UiSkeleton :width="'60%'" :height="16" class="skeleton-price" />
      <div class="skeleton-actions">
        <UiSkeleton :width="'70%'" :height="36" />
        <UiSkeleton :width="36" :height="36" :circle="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiSkeleton from '@/components/ui/Skeleton.vue'
</script>

<style scoped>
.product-skeleton {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.skeleton-image {
  aspect-ratio: 1;
}

.skeleton-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-title {
  margin-bottom: 0.25rem;
}

.skeleton-price {
  margin-bottom: 0.5rem;
}

.skeleton-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
