<template>
  <div class="product-detail-skeleton">
    <div class="skeleton-gallery">
      <UiSkeleton :width="'100%'" :height="'100%'" class="skeleton-main-image" />
      <div class="skeleton-thumbs">
        <UiSkeleton
          v-for="i in 4"
          :key="i"
          :width="64"
          :height="64"
          class="skeleton-thumb"
        />
      </div>
    </div>
    <div class="skeleton-info">
      <UiSkeleton :width="'80%'" :height="32" class="skeleton-title" />
      <UiSkeleton :width="'40%'" :height="28" class="skeleton-price" />
      <div class="skeleton-details">
        <UiSkeleton :width="'100%'" :height="16" />
        <UiSkeleton :width="'90%'" :height="16" />
        <UiSkeleton :width="'85%'" :height="16" />
      </div>
      <UiSkeleton :width="'100%'" :height="120" class="skeleton-description" />
      <div class="skeleton-form">
        <UiSkeleton :width="100" :height="40" />
        <UiSkeleton :width="200" :height="48" />
        <UiSkeleton :width="150" :height="48" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiSkeleton from '@/components/ui/Skeleton.vue'
</script>

<style scoped>
.product-detail-skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.skeleton-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-main-image {
  aspect-ratio: 1;
  border-radius: 8px;
}

.skeleton-thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.skeleton-thumb {
  border-radius: 6px;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-title {
  margin-bottom: 0.5rem;
}

.skeleton-price {
  margin-bottom: 0.5rem;
}

.skeleton-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-bg-alt);
  border-radius: 8px;
}

.skeleton-description {
  margin-bottom: 1.5rem;
  border-radius: 6px;
}

.skeleton-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 900px) {
  .product-detail-skeleton {
    grid-template-columns: 1fr;
  }
}
</style>
