<template>
  <article class="blog-skeleton">
    <UiSkeleton :width="'100%'" :height="'100%'" class="skeleton-image" />
    <div class="skeleton-content">
      <UiSkeleton :width="'55%'" :height="12" />
      <UiSkeleton :width="'90%'" :height="18" />
      <UiSkeleton :width="'100%'" :height="12" />
      <UiSkeleton :width="'100%'" :height="12" />
      <UiSkeleton :width="'40%'" :height="12" />
    </div>
  </article>
</template>

<script setup lang="ts">
import UiSkeleton from '@/components/ui/Skeleton.vue'
</script>

<style scoped>
.blog-skeleton {
  background: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.skeleton-image {
  display: block;
  height: 12rem;
}

.skeleton-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex-grow: 1;
}
</style>
