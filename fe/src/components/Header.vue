<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="logo">
        <span v-if="logoUrl" class="logo-mark">
          <img :src="logoUrl" :alt="BRAND_NAME" class="logo-img" />
        </span>
        <span class="logo-text">{{ BRAND_NAME }}</span>
      </RouterLink>
      <nav class="nav-menu">
        <RouterLink to="/">Trang chủ</RouterLink>
        <RouterLink to="/blog">Blog</RouterLink>
        <div class="nav-dropdown">
          <span class="nav-dropdown-trigger">
            Sản phẩm
            <span class="nav-arrow">▾</span>
          </span>
          <div class="nav-dropdown-menu nav-dropdown-menu-products">
            <template v-for="node in categoryTree" :key="node.id">
              <RouterLink :to="'/' + node.slug" class="nav-dropdown-item">{{ node.name }}</RouterLink>
              <template v-for="child in node.children" :key="child.id">
                <RouterLink :to="'/' + node.slug + '/' + child.slug" class="nav-dropdown-item sub">{{ child.name }}</RouterLink>
              </template>
            </template>
          </div>
        </div>
        <div class="nav-dropdown" v-if="collections.length > 0">
          <span class="nav-dropdown-trigger">
            Bộ sưu tập
            <span class="nav-arrow">▾</span>
          </span>
          <div class="nav-dropdown-menu nav-dropdown-menu-collections">
            <RouterLink
              v-for="collection in collections"
              :key="collection.id"
              :to="'/bo-suu-tap/' + collection.slug"
              class="nav-dropdown-item"
            >
              {{ collection.name }}
            </RouterLink>
          </div>
        </div>
        <div class="nav-dropdown">
          <span class="nav-dropdown-trigger">
            Trang
            <span class="nav-arrow">▾</span>
          </span>
          <div class="nav-dropdown-menu nav-dropdown-menu-pages">
            <RouterLink to="/page/lien-he" class="nav-dropdown-item">Liên hệ</RouterLink>
            <RouterLink
              v-for="page in cmsPages"
              :key="page.id"
              :to="'/page/' + page.slug"
              class="nav-dropdown-item"
            >
              {{ page.title }}
            </RouterLink>
          </div>
        </div>
      </nav>
      <div class="header-actions">
        <button type="button" class="icon-button search-toggle" aria-label="Tìm kiếm" @click="openSearch">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search overlay -->
    <div v-if="showSearchOverlay" class="search-overlay">
      <div class="search-overlay-inner container">
        <button type="button" class="overlay-close" aria-label="Đóng tìm kiếm" @click="closeSearch">
          ×
        </button>

        <h2 class="search-overlay-title">Search For Products</h2>

        <div class="search-overlay-input-wrap">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for products"
            class="search-overlay-input"
            @keyup.enter="handleSearch"
          />
          <button type="button" class="search-overlay-btn" aria-label="Tìm kiếm" @click="handleSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        <div v-if="popularCategories.length" class="search-overlay-popular">
          <p class="popular-label">Popular searches</p>
          <div class="popular-chips">
            <RouterLink
              v-for="item in popularCategories"
              :key="item.path"
              :to="item.path"
              class="popular-chip"
              @click="closeSearch"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useHeader } from '@/composables/common/useHeader'
import { BRAND_NAME } from '@/constants/brand'
import BrandLogo from '@/assets/Logo.jpg'

// Presentational component: uses composable for logic
const { searchQuery, categoryTree, collections, cmsPages, onSearch } = useHeader()

// Dùng trực tiếp file logo trong src/assets/Logo.jpg
const logoUrl = BrandLogo

const showSearchOverlay = ref(false)

const popularCategories = computed(() => {
  const items: { name: string; path: string }[] = []

  const source = (categoryTree as unknown as { value?: any[] }).value ?? categoryTree ?? []

  for (const node of source as any[]) {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        items.push({
          name: child.name,
          path: `/${node.slug}/${child.slug}`,
        })
      }
    } else {
      items.push({
        name: node.name,
        path: `/${node.slug}`,
      })
    }
  }

  return items.slice(0, 8)
})

function openSearch() {
  showSearchOverlay.value = true
}

function closeSearch() {
  showSearchOverlay.value = false
}

function handleSearch() {
  if (!searchQuery.value?.trim()) return
  onSearch()
  closeSearch()
}
</script>

<style scoped>
/* Main header */
.site-header {
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem 0;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: 0.05em;
  color: #1a1a1a;
  text-decoration: none;
}
.logo-mark {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}
.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.logo-text {
  white-space: nowrap;
}
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}
.nav-menu > a,
.nav-dropdown {
  font-weight: 500;
  font-size: 0.95rem;
  color: #1a1a1a;
  text-decoration: none;
}
.nav-menu > a.router-link-active,
.nav-dropdown-trigger.router-link-active {
  color: var(--color-primary);
}
.nav-dropdown {
  position: relative;
}
.nav-dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  font: inherit;
}
.nav-dropdown-trigger.router-link-active {
  color: var(--color-primary);
}
a.nav-dropdown-trigger:hover,
.nav-dropdown:hover .nav-dropdown-trigger {
  color: var(--color-primary);
}
.nav-dropdown-menu-products {
  min-width: 220px;
  max-height: 70vh;
  overflow-y: auto;
}
.nav-arrow {
  font-size: 0.7rem;
  opacity: 0.8;
}
.nav-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  margin-top: 0.25rem;
  padding: 0.5rem 0;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, visibility 0.15s;
  z-index: 50;
}
.nav-dropdown:hover .nav-dropdown-menu {
  opacity: 1;
  visibility: visible;
}
.nav-dropdown-item {
  display: block;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  color: #1a1a1a;
  text-decoration: none;
}
.nav-dropdown-item.sub {
  padding-left: 1.5rem;
  font-size: 0.85rem;
  color: #555;
}
.nav-dropdown-item:hover {
  background: var(--color-bg-alt);
  color: var(--color-primary);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.icon-button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}
.icon-button:hover {
  background: var(--color-bg-alt);
  color: var(--color-primary);
}
.header-hotline {
  font-size: 0.9rem;
  color: #111827;
  white-space: nowrap;
}
.header-hotline a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}
.header-hotline a:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .header-inner {
    gap: 1rem;
  }
  .nav-menu {
    gap: 1rem;
    font-size: 0.9rem;
  }
  .search-input {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .header-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .logo {
    font-size: 1.2rem;
    text-align: center;
  }
  .nav-menu {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.85rem;
  }
  .nav-menu > a {
    padding: 0.25rem 0.5rem;
  }
  .nav-dropdown-menu {
    min-width: 180px;
  }
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .site-header {
    padding: 0.5rem 0;
  }
  .nav-menu {
    font-size: 0.8rem;
    gap: 0.5rem;
  }
  .nav-menu > a {
    padding: 0.25rem;
  }
}

/* Search overlay */
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.98);
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-overlay-inner {
  position: relative;
  max-width: 960px;
  width: 100%;
}

.overlay-close {
  position: absolute;
  top: 1.5rem;
  right: 0;
  border: none;
  background: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: #4b5563;
}

.overlay-close:hover {
  color: #111827;
}

.search-overlay-title {
  font-size: 2.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2.5rem;
}

.search-overlay-input-wrap {
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: #f8f8f8;
  padding: 0.35rem 0.75rem 0.35rem 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}

.search-overlay-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.9rem 0;
  font-size: 1rem;
}

.search-overlay-input::placeholder {
  color: #9ca3af;
}

.search-overlay-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
}

.search-overlay-btn:hover {
  color: var(--color-primary);
}

.search-overlay-popular {
  margin-top: 2.5rem;
}

.popular-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #6b7280;
  margin-bottom: 1rem;
}

.popular-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.popular-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 0.9rem;
  color: #111827;
  text-decoration: none;
}

.popular-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .search-overlay-title {
    font-size: 1.6rem;
    margin-bottom: 1.75rem;
  }

  .search-overlay-inner {
    padding-inline: 1rem;
  }
}
</style>
