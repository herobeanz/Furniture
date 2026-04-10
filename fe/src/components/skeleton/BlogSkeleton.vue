<template>
  <article class="blog-skeleton">
    <UiSkeleton :width="'100%'" :height="200" class="skeleton-image" />
    <div class="skeleton-content">
      <UiSkeleton :width="'60%'" :height="20" class="skeleton-category" />
      <UiSkeleton :width="'90%'" :height="24" class="skeleton-title" />
      <UiSkeleton :width="'100%'" :height="16" class="skeleton-excerpt" />
      <UiSkeleton :width="'100%'" :height="16" class="skeleton-excerpt" />
      <UiSkeleton :width="'70%'" :height="16" class="skeleton-excerpt" />
      <div class="skeleton-meta">
        <UiSkeleton :width="100" :height="14" />
        <UiSkeleton :width="80" :height="14" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import UiSkeleton from '@/components/ui/Skeleton.vue'
</script>

<style scoped>
.blog-skeleton {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.skeleton-image {
  width: 100%;
}

.skeleton-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-category {
  margin-bottom: 0.25rem;
}

.skeleton-title {
  margin-bottom: 0.5rem;
}

.skeleton-excerpt {
  margin-bottom: 0.25rem;
}

.skeleton-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
</style>
