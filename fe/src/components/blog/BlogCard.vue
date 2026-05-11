<template>
  <article class="blog-card" @click="$emit('click')">
    <div
      v-if="post.thumbnail"
      class="blog-image"
      :style="{ backgroundImage: `url(${post.thumbnail})` }"
    ></div>
    <div v-else class="blog-image placeholder"></div>
    <div class="blog-content">
      <span v-if="post.category" class="blog-cat">{{ post.category }}</span>
      <h3 class="blog-title">{{ post.title }}</h3>
      <p v-if="post.excerpt" class="blog-excerpt">{{ post.excerpt }}</p>
      <p class="blog-meta">
        <span v-if="post.author">{{ post.author }}</span>
        <span v-if="post.publishedAt">{{ formatBlogDate(post.publishedAt) }}</span>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPost } from '@/services/api/blog'
import { formatBlogDate } from '@/utils/format'

interface Props {
  post: BlogPost
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.blog-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.blog-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-color: var(--color-bg-alt);
}
.blog-image.placeholder {
  background: linear-gradient(135deg, #e8e8e8, #f5f5f5);
}
.blog-content {
  padding: 1.5rem;
}
.blog-cat {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}
.blog-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  color: #1a1a1a;
}
.blog-excerpt {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.blog-meta {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
