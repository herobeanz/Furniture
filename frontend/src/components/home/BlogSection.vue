<template>
  <section class="home-blog-section">
    <div class="container">
      <h2 class="section-title">Bài viết nổi bật</h2>
      <div v-if="loading" class="loading">Đang tải...</div>
      <div v-else-if="posts.length === 0" class="empty">Chưa có bài viết nào.</div>
      <div v-else class="blog-grid">
        <article
          v-for="post in posts"
          :key="post.id"
          class="blog-card"
          @click="$emit('goToPost', post.slug)"
        >
          <div
            v-if="post.thumbnail"
            class="blog-image"
            :style="{ backgroundImage: `url(${post.thumbnail})` }"
          ></div>
          <div v-else class="blog-image" :style="{ background: 'linear-gradient(135deg,#e8e8e8,#f5f5f5)' }"></div>
          <span v-if="post.category" class="blog-cat">{{ post.category }}</span>
          <h3 class="blog-title">{{ post.title }}</h3>
          <p class="blog-meta">
            <span v-if="post.author">{{ post.author }}</span>
            <span v-if="post.publishedAt">{{ formatBlogDate(post.publishedAt) }}</span>
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BlogPost } from '../../services/blog.service'
import { formatBlogDate } from '../../utils/format'

interface Props {
  posts: BlogPost[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

defineEmits<{
  goToPost: [slug: string]
}>()
</script>

<style scoped>
.home-blog-section {
  padding: 2rem 0;
  background: var(--color-bg-alt);
}
.section-title {
  font-size: 1.35rem;
  margin-bottom: 1.25rem;
  text-align: center;
}
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.blog-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.blog-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
.blog-image {
  aspect-ratio: 16/10;
  background-size: cover;
  background-position: center;
}
.blog-cat {
  display: inline-block;
  margin: 0.75rem 1rem 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-primary);
}
.blog-title {
  font-size: 1rem;
  margin: 0.35rem 1rem 0;
  padding-bottom: 0.5rem;
}
.blog-meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0 1rem 1rem;
}
.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
