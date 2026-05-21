<template>
  <article class="blog-card">
    <RouterLink :to="`/blog/${post.slug}`" class="blog-card-link">
      <div class="blog-card-image-wrap">
        <img
          :src="resolveMediaUrl(post.thumbnail) || BLOG_FALLBACK_THUMBNAIL"
          :alt="post.title"
          class="blog-card-image"
          loading="lazy"
        />
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span v-if="categoryLabel" class="blog-card-category">{{ categoryLabel }}</span>
          <span v-if="post.publishedAt" class="blog-card-date">{{
            formatBlogDate(post.publishedAt)
          }}</span>
        </div>
        <h3 class="blog-card-title">{{ post.title }}</h3>
        <p v-if="excerptText" class="blog-card-excerpt">{{ excerptText }}</p>
        <span class="blog-card-read">
          Đọc thêm
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </span>
      </div>
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { BlogPost } from '@/services/api/blog'
import { formatBlogDate } from '@/utils/format'
import { BLOG_FALLBACK_THUMBNAIL } from '@/constants/blog'
import { resolveMediaUrl } from '@/utils/mediaUrl'

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()

const categoryLabel = computed(() => props.post.category?.trim() ?? '')

const excerptText = computed(() => {
  const text = props.post.excerpt?.trim()
  if (text) return text
  const plain = props.post.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!plain) return ''
  return plain.length > 140 ? `${plain.slice(0, 140)}…` : plain
})
</script>

<style scoped>
.blog-card {
  background: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
  height: 100%;
}

.blog-card:hover {
  box-shadow: var(--shadow-md);
}

.blog-card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.blog-card-image-wrap {
  height: 12rem;
  overflow: hidden;
  background: var(--color-border-light);
}

.blog-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.blog-card:hover .blog-card-image {
  transform: scale(1.03);
}

.blog-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.blog-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.blog-card-category {
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.blog-card-date {
  flex-shrink: 0;
  text-align: right;
}

.blog-card-title {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.4;
  margin: 0 0 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card-excerpt {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  line-height: 1.55;
  margin: 0 0 1rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card-read {
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-heading);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: auto;
  transition: color var(--transition-fast);
}

.blog-card:hover .blog-card-read {
  color: var(--color-primary);
}

.blog-card-read i {
  font-size: 0.5625rem;
  line-height: 1;
}
</style>
