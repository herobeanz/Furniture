<template>
  <section class="blog section-shell">
    <div class="container">
      <div class="section-header-row">
        <h2 class="section-heading">Bài viết nổi bật</h2>
        <RouterLink to="/blog" class="section-link">
          Xem tất cả bài viết
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </RouterLink>
      </div>

      <div v-if="loading" class="blog-loading">Đang tải bài viết…</div>

      <div v-else-if="posts.length" class="blog-grid">
        <RouterLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="blog-card"
        >
          <div class="blog-image">
            <img
              :src="resolveMediaUrl(post.thumbnail) || fallbackImage"
              :alt="post.title"
              loading="lazy"
            />
          </div>
          <p v-if="post.publishedAt" class="blog-date">
            {{ formatBlogDate(post.publishedAt) }}
          </p>
          <h3 class="blog-title">{{ post.title }}</h3>
        </RouterLink>
      </div>

      <p v-else class="blog-empty">Chưa có bài viết nổi bật.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { BlogPost } from "@/services/api/blog";
import { formatBlogDate } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/mediaUrl";

defineProps<{
  posts: BlogPost[];
  loading?: boolean;
}>();

const fallbackImage =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80";
</script>

<style scoped>
.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .blog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.blog-card {
  display: block;
  text-decoration: none;
  color: inherit;
}

.blog-card:hover .blog-title {
  color: var(--color-primary);
}

.blog-image {
  height: 12rem;
  overflow: hidden;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  background: var(--color-border-light);
}

.blog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.blog-card:hover .blog-image img {
  transform: scale(1.05);
}

.blog-date {
  font-size: var(--fs-body-sm);
  color: var(--color-text-light);
  margin: 0 0 0.25rem;
  font-family: var(--font-sans);
}

.blog-title {
  font-family: var(--font-sans);
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.blog-loading,
.blog-empty {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  text-align: center;
  padding: 2rem 0;
}
</style>
