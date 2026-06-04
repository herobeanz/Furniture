<template>
  <div class="blog-page">
    <!-- Hero -->
    <section class="blog-hero">
      <div class="container blog-hero-inner">
        <div class="blog-hero-copy">
          <span class="eyebrow">Cẩm nang</span>
          <h1 class="blog-hero-title">Cảm hứng<br />từ không gian sống</h1>
          <p class="blog-hero-text">
            Những bài viết chia sẻ kiến thức, xu hướng nội thất và cảm hứng giúp
            bạn kiến tạo không gian sống hoàn hảo.
          </p>
        </div>
        <div class="blog-hero-visual">
          <img
            :src="BLOG_HERO_IMAGE"
            alt="Không gian sống đẹp"
            class="blog-hero-image"
            loading="eager"
          />
        </div>
      </div>
    </section>

    <!-- Filters + search -->
    <section class="blog-toolbar">
      <div class="container blog-toolbar-inner">
        <div class="blog-filters">
          <button
            v-for="tab in categoryTabs"
            :key="tab.id || 'all'"
            type="button"
            class="blog-filter-btn"
            :class="{ active: activeCategory === tab.id }"
            @click="setCategory(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="blog-search">
          <input
            v-model="searchQuery"
            type="search"
            class="blog-search-input"
            placeholder="Tìm kiếm bài viết..."
            aria-label="Tìm kiếm bài viết"
            @input="onSearchInput"
          />
          <i
            class="fa-solid fa-magnifying-glass blog-search-icon"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section class="blog-list section-shell">
      <div class="container">
        <div v-if="loading" class="blog-grid">
          <BlogSkeleton v-for="i in BLOG_PAGE_SIZE" :key="i" />
        </div>
        <ErrorState v-else-if="error" :message="error" />
        <EmptyState
          v-else-if="filteredPosts.length === 0"
          :message="emptyMessage"
        />
        <div v-else class="blog-grid">
          <BlogCard
            v-for="post in paginatedPosts"
            :key="post.id"
            :post="post"
          />
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <nav
      v-if="!loading && !error && filteredPosts.length > 0 && totalPages > 1"
      class="blog-pagination"
      aria-label="Phân trang blog"
    >
      <button
        type="button"
        class="blog-page-btn"
        :disabled="currentPage <= 1"
        aria-label="Trang trước"
        @click="goToPage(currentPage - 1)"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      <template v-for="(item, index) in paginationItems" :key="'p-' + index">
        <span v-if="item === 'ellipsis'" class="blog-page-ellipsis">…</span>
        <button
          v-else
          type="button"
          class="blog-page-btn"
          :class="{ active: item === currentPage }"
          @click="goToPage(item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        type="button"
        class="blog-page-btn"
        :disabled="currentPage >= totalPages"
        aria-label="Trang sau"
        @click="goToPage(currentPage + 1)"
      >
        <i class="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BlogView' })

import { computed, ref, watch } from "vue";
import BlogCard from "@/components/blog/BlogCard.vue";
import BlogSkeleton from "@/components/skeleton/BlogSkeleton.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { useBlogListData } from "@/composables/blog/useBlogData";
import {
  BLOG_FILTER_TABS,
  BLOG_HERO_IMAGE,
  BLOG_PAGE_SIZE,
  type BlogFilterTab,
} from "@/constants/blog";
import type { BlogPost } from "@/services/api/blog";

const { posts, loading, error } = useBlogListData();

const activeCategory = ref("");
const searchQuery = ref("");
const currentPage = ref(1);

const categoryTabs = computed((): BlogFilterTab[] => {
  const tabs: BlogFilterTab[] = [...BLOG_FILTER_TABS];
  const knownIds = new Set(tabs.map((t) => t.id).filter(Boolean));

  for (const post of posts.value) {
    const raw = post.category?.trim();
    if (!raw || knownIds.has(raw)) continue;
    tabs.push({ id: raw, label: raw });
    knownIds.add(raw);
  }

  return tabs;
});

function postCategoryDisplay(post: BlogPost): string {
  return post.category?.trim() ?? "";
}

function postMatchesCategory(post: BlogPost, categoryId: string): boolean {
  if (!categoryId) return true;
  const display = postCategoryDisplay(post);
  return display === categoryId || post.category?.trim() === categoryId;
}

const filteredPosts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return posts.value.filter((post) => {
    if (!postMatchesCategory(post, activeCategory.value)) return false;
    if (!q) return true;
    const haystack = [
      post.title,
      post.excerpt,
      postCategoryDisplay(post),
      post.author,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPosts.value.length / BLOG_PAGE_SIZE)),
);

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * BLOG_PAGE_SIZE;
  return filteredPosts.value.slice(start, start + BLOG_PAGE_SIZE);
});

const emptyMessage = computed(() => {
  if (searchQuery.value.trim()) {
    return "Không tìm thấy bài viết phù hợp.";
  }
  if (activeCategory.value) {
    return "Chưa có bài viết trong danh mục này.";
  }
  return "Chưa có bài viết nào.";
});

/** Trang hiển thị: 1 … 4 5 6 … 10 */
const paginationItems = computed((): Array<number | "ellipsis"> => {
  const total = totalPages.value;
  const current = currentPage.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  if (current > 3) items.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) {
    if (!items.includes(p)) items.push(p);
  }

  if (current < total - 2) items.push("ellipsis");
  if (!items.includes(total)) items.push(total);

  return items;
});

function setCategory(id: string) {
  activeCategory.value = id;
  currentPage.value = 1;
}

function onSearchInput() {
  currentPage.value = 1;
}

function goToPage(page: number) {
  const p = Math.min(Math.max(1, page), totalPages.value);
  currentPage.value = p;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

watch(totalPages, (total) => {
  if (currentPage.value > total) {
    currentPage.value = total;
  }
});
</script>

<style scoped>
.blog-page {
  background: #faf9f6;
}

/* Hero */
.blog-hero {
  background: #f5f2eb;
  padding: 4rem 0;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .blog-hero {
    padding: 6rem 0;
  }
}

.blog-hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .blog-hero-inner {
    grid-template-columns: 5fr 7fr;
  }
}

.blog-hero-title {
  font-family: var(--font-serif);
  font-size: var(--fs-page-title);
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.blog-hero-text {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  line-height: 1.7;
  margin: 0;
}

.blog-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.blog-hero-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
}

/* Toolbar */
.blog-toolbar {
  margin-top: 3rem;
}

.blog-toolbar-inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1.5rem;
}

@media (min-width: 1024px) {
  .blog-toolbar-inner {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.blog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.blog-filter-btn {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.125rem;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
  font-family: inherit;
}

.blog-filter-btn:hover {
  background: #f9fafb;
}

.blog-filter-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.blog-search {
  position: relative;
  width: 100%;
}

@media (min-width: 1024px) {
  .blog-search {
    width: 16rem;
    flex-shrink: 0;
  }
}

.blog-search-input {
  width: 100%;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.5rem 2.25rem 0.5rem 0.75rem;
  font-size: var(--fs-body-sm);
  font-family: inherit;
  color: var(--color-heading);
}

.blog-search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.blog-search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
  font-size: var(--icon-size-xs);
  pointer-events: none;
}

/* Grid */
.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Pagination */
.blog-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  padding-bottom: 4rem;
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
}

.blog-page-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
  font-size: var(--fs-body-sm);
  font-weight: 500;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
  font-family: inherit;
}

.blog-page-btn:hover:not(:disabled):not(.active) {
  background: #f9fafb;
}

.blog-page-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.blog-page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.blog-page-btn i {
  font-size: var(--icon-size-xs);
  line-height: 1;
}

.blog-page-ellipsis {
  padding: 0 0.25rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .blog-hero {
    padding-top: 3rem;
  }

  .blog-hero-image {
    height: 240px;
  }

  .blog-toolbar {
    margin-top: 2rem;
  }
}
</style>
