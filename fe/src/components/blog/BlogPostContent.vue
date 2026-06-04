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
      <span v-if="post.category" class="post-category">{{
        post.category
      }}</span>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <span v-if="post.author">{{ post.author }}</span>
        <span v-if="post.publishedAt">{{
          formatBlogDate(post.publishedAt)
        }}</span>
      </div>
    </header>

    <RichHtmlContent class="post-content" :html="post.content" />
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { BlogPost } from "@/services/api/blog";
import { formatBlogDate } from "@/utils/format";
import RichHtmlContent from "@/components/common/RichHtmlContent.vue";

interface Props {
  post: BlogPost;
}

defineProps<Props>();
</script>

<style scoped>
.breadcrumb {
  font-size: var(--fs-body-sm);
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
  font-size: var(--fs-body-sm);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
}
.post-title {
  font-size: var(--fs-page-title);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
  color: #1a1a1a;
}
.post-meta {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
