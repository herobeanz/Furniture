<template>
  <article class="blog-post">
    <nav class="breadcrumb">
      <RouterLink to="/">Trang chủ</RouterLink>
      <span class="sep">/</span>
      <RouterLink to="/blog">Blog</RouterLink>
      <span class="sep">/</span>
      <span>{{ post.title }}</span>
    </nav>

    <header class="post-header">
      <span v-if="post.category" class="post-category">{{ post.category }}</span>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <span v-if="post.author">{{ post.author }}</span>
        <span v-if="post.publishedAt">{{ formatBlogDate(post.publishedAt) }}</span>
      </div>
    </header>

    <div v-if="post.thumbnail" class="post-image">
      <img :src="post.thumbnail" :alt="post.title" />
    </div>

    <div class="post-content" v-html="formatBlogContent(post.content)"></div>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { BlogPost } from '@/services/blog.service'
import { formatBlogDate, formatBlogContent } from '@/utils/format'

interface Props {
  post: BlogPost
}

defineProps<Props>()
</script>

<style scoped>
.breadcrumb {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}
.breadcrumb .sep {
  margin: 0 0.5rem;
}
.breadcrumb a:hover {
  color: var(--color-primary);
}
.post-header {
  margin-bottom: 2rem;
}
.post-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
}
.post-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
  color: #1a1a1a;
}
.post-meta {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  display: flex;
  gap: 1rem;
  align-items: center;
}
.post-image {
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}
.post-image img {
  width: 100%;
  height: auto;
  display: block;
}
.post-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
}
.post-content :deep(p) {
  margin-bottom: 1.25rem;
}
.post-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}
.post-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}
.post-content :deep(ul),
.post-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 2rem;
}
.post-content :deep(li) {
  margin-bottom: 0.5rem;
}
</style>
