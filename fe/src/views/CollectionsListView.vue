<template>
  <div class="collections-page">
    <nav class="container collections-breadcrumb" aria-label="Breadcrumb">
      <RouterLink to="/" class="collections-breadcrumb-link"
        >Trang chủ</RouterLink
      >
      <i
        class="fa-solid fa-chevron-right collections-breadcrumb-sep"
        aria-hidden="true"
      />
      <span class="collections-breadcrumb-current">Bộ sưu tập</span>
    </nav>

    <section class="collections-hero">
      <div class="container collections-hero-inner">
        <div class="collections-hero-copy">
          <h1 class="collections-hero-title">BỘ SƯU TẬP</h1>
          <p class="collections-hero-text">
            Khám phá các bộ sưu tập nội thất gỗ tự nhiên được tuyển chọn dành
            riêng cho không gian sống của bạn.
          </p>
        </div>
        <div class="collections-hero-visual">
          <img
            :src="COLLECTIONS_HERO_IMAGE"
            alt="Bộ sưu tập gỗ cao cấp"
            class="collections-hero-image"
            loading="eager"
          />
        </div>
      </div>
    </section>

    <section class="collections-toolbar">
      <div class="container collections-toolbar-inner">
        <div class="collections-sort">
          <select
            v-model="sortKey"
            class="collections-sort-select"
            aria-label="Sắp xếp bộ sưu tập"
            @change="currentPage = 1"
          >
            <option
              v-for="opt in COLLECTION_SORT_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
          <i
            class="fa-solid fa-chevron-down collections-sort-icon"
            aria-hidden="true"
          />
        </div>
      </div>
      <!-- <p v-if="!loading && !error" class="container collections-result-count">
        Hiển thị {{ formatResultRange() }} bộ sưu tập
      </p> -->
    </section>

    <section class="collections-list">
      <div class="container">
        <div v-if="loading" class="collections-grid">
          <CollectionCardSkeleton v-for="i in COLLECTIONS_PAGE_SIZE" :key="i" />
        </div>
        <ErrorState v-else-if="error" :message="error" />
        <EmptyState
          v-else-if="displayCollections.length === 0"
          message="Chưa có bộ sưu tập nào."
        />
        <div v-else class="collections-grid">
          <CollectionCard
            v-for="item in paginatedCollections"
            :key="item.id"
            :collection="item"
          />
        </div>
      </div>
    </section>

    <nav
      v-if="
        !loading && !error && displayCollections.length > 0 && totalPages > 1
      "
      class="collections-pagination"
      aria-label="Phân trang bộ sưu tập"
    >
      <button
        type="button"
        class="collections-page-btn"
        :disabled="currentPage <= 1"
        aria-label="Trang trước"
        @click="goToPage(currentPage - 1)"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      <template v-for="(item, index) in paginationItems" :key="'p-' + index">
        <span v-if="item === 'ellipsis'" class="collections-page-ellipsis"
          >…</span
        >
        <button
          v-else
          type="button"
          class="collections-page-btn"
          :class="{ active: item === currentPage }"
          @click="goToPage(item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        type="button"
        class="collections-page-btn"
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
defineOptions({ name: 'CollectionsListView' })

import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import CollectionCard from "@/components/collection/CollectionCard.vue";
import CollectionCardSkeleton from "@/components/skeleton/CollectionCardSkeleton.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { useCollectionsListPage } from "@/composables/collection/useCollectionsListPage";
import {
  COLLECTIONS_HERO_IMAGE,
  COLLECTIONS_PAGE_SIZE,
  COLLECTION_SORT_OPTIONS,
  type CollectionSortKey,
} from "@/constants/collections-page";
import type { Collection } from "@/services/api/collections";

const { collections, loading, error } = useCollectionsListPage();

const sortKey = ref<CollectionSortKey>("newest");
const currentPage = ref(1);

function sortCollections(list: Collection[]): Collection[] {
  const copy = [...list];
  switch (sortKey.value) {
    case "popular":
      return copy.sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0));
    case "products-asc":
      return copy.sort((a, b) => (a.productCount ?? 0) - (b.productCount ?? 0));
    case "newest":
    default:
      return copy.sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
  }
}

const displayCollections = computed(() => sortCollections(collections.value));

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(displayCollections.value.length / COLLECTIONS_PAGE_SIZE),
  ),
);

const paginatedCollections = computed(() => {
  const start = (currentPage.value - 1) * COLLECTIONS_PAGE_SIZE;
  return displayCollections.value.slice(start, start + COLLECTIONS_PAGE_SIZE);
});

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
.collections-page {
  background: #faf9f6;
  padding-bottom: 2.5rem;
}

.collections-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1.5rem;
  font-size: 0.6875rem;
  color: var(--color-text-light);
}

.collections-breadcrumb-link {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.collections-breadcrumb-link:hover {
  color: var(--color-primary);
}

.collections-breadcrumb-sep {
  font-size: 0.5rem;
}

.collections-breadcrumb-current {
  color: var(--color-text-muted);
}

.collections-hero {
  background: #f5f2eb;
  padding: 3rem 0;
  overflow: hidden;
  margin-top: 0.5rem;
}

@media (min-width: 1024px) {
  .collections-hero {
    padding: 5rem 0;
  }
}

.collections-hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .collections-hero-inner {
    grid-template-columns: 5fr 7fr;
  }
}

.collections-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2.25rem, 5vw, 3rem);
  letter-spacing: 0.04em;
  color: var(--color-primary);
  margin: 0 0 1rem;
  font-weight: 600;
  line-height: 1.1;
}

.collections-hero-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 20rem;
  margin: 0;
}

.collections-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.collections-hero-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
}

.collections-toolbar {
  margin-top: 3rem;
}

.collections-toolbar-inner {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1.25rem;
}

.collections-sort {
  position: relative;
  width: 100%;
}

@media (min-width: 640px) {
  .collections-sort {
    width: 12rem;
    flex-shrink: 0;
  }
}

.collections-sort-select {
  width: 100%;
  appearance: none;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-family: inherit;
}

.collections-sort-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.collections-sort-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.625rem;
  color: var(--color-text-light);
  pointer-events: none;
}

.collections-result-count {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  margin: 1rem 0 0;
}

.collections-list {
  padding: 1.5rem 0 0;
}

.collections-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .collections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .collections-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.collections-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  padding: 2.5rem 0 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.collections-page-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast);
  font-family: inherit;
}

.collections-page-btn:hover:not(:disabled):not(.active) {
  background: #f9fafb;
}

.collections-page-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.collections-page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.collections-page-btn i {
  font-size: 0.625rem;
}

.collections-page-ellipsis {
  padding: 0 0.25rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .collections-hero-image {
    height: 240px;
  }

  .collections-toolbar {
    margin-top: 2rem;
  }
}
</style>
