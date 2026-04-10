<template>
  <div class="blog-post-page">
    <div class="container">
      <LoadingState v-if="loading" />
      <ErrorState v-else-if="error" :message="error" />
      <BlogPostContent v-else-if="post" :post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BlogPostContent from '@/components/blog/BlogPostContent.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useBlogPostData } from '@/composables/blog/useBlogData'

// Container component: orchestrates data and logic
const { post, loading, error } = useBlogPostData()
</script>

<style scoped>
.blog-post-page {
  padding: 2rem 0 3rem;
}
</style>
