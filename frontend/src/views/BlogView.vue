<template>
  <div class="blog-page">
    <div class="container">
      <h1 class="blog-title">Blog</h1>
      <p class="blog-desc">Cập nhật xu hướng nội thất, mẹo trang trí và tin tức từ Furniture Store.</p>

      <LoadingState v-if="loading" />
      <ErrorState v-else-if="error" :message="error" />
      <EmptyState v-else-if="posts.length === 0" message="Chưa có bài viết nào." />

      <div v-else class="blog-grid">
        <BlogCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @click="goToPost(post.slug)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BlogCard from '@/components/blog/BlogCard.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useBlogListData } from '@/composables/blog/useBlogData'

// Container component: orchestrates data and logic
const { posts, loading, error } = useBlogListData()
const router = useRouter()

function goToPost(slug: string) {
  router.push(`/blog/${slug}`)
}
</script>

<style scoped>
.blog-page {
  padding: 2rem 0 3rem;
}
.blog-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.blog-desc {
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
</style>
