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
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
  color: var(--color-primary);
  text-decoration: none;
  transition: transform var(--transition-base);
}

.logo:hover {
  transform: scale(1.02);
  color: var(--color-primary-hover);
}

.logo-mark {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%);
  transition: all var(--transition-base);
}

.logo:hover .logo-mark {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-md);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-text {
  white-space: nowrap;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-menu > a,
.nav-dropdown {
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--color-text);
  text-decoration: none;
  position: relative;
  transition: color var(--transition-fast);
}

.nav-menu > a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.nav-menu > a:hover::after,
.nav-menu > a.router-link-active::after {
  width: 100%;
}

.nav-menu > a:hover,
.nav-menu > a.router-link-active {
  color: var(--color-primary);
}

.nav-dropdown {
  position: relative;
}

.nav-dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  font: inherit;
  padding: 0.5rem 0;
  transition: color var(--transition-fast);
}

.nav-dropdown-trigger:hover,
.nav-dropdown-trigger.router-link-active {
  color: var(--color-primary);
}

.nav-arrow {
  font-size: 0.75rem;
  opacity: 0.7;
  transition: transform var(--transition-fast);
}

.nav-dropdown:hover .nav-arrow {
  transform: rotate(180deg);
}

.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  min-width: 220px;
  padding: 0.75rem 0;
  background: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  box-shadow: var(--shadow-xl);
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-base);
  z-index: 50;
}

.nav-dropdown:hover .nav-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.nav-dropdown-menu-products {
  min-width: 240px;
  max-height: 70vh;
  overflow-y: auto;
}

.nav-dropdown-menu-products::-webkit-scrollbar {
  width: 6px;
}

.nav-dropdown-menu-products::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.nav-dropdown-item {
  display: block;
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-dropdown-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--color-primary);
  transition: height var(--transition-fast);
  border-radius: 0 3px 3px 0;
}

.nav-dropdown-item:hover::before {
  height: 60%;
}

.nav-dropdown-item.sub {
  padding-left: 2rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.nav-dropdown-item:hover {
  background: var(--color-bg-alt);
  color: var(--color-primary);
  padding-left: 1.5rem;
}

.nav-dropdown-item.sub:hover {
  padding-left: 2.25rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-button {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.625rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
  position: relative;
}

.icon-button::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-bg-alt);
  transform: scale(0);
  transition: transform var(--transition-fast);
  z-index: -1;
}

.icon-button:hover::before {
  transform: scale(1);
}

.icon-button:hover {
  color: var(--color-primary);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .nav-menu {
    gap: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .header-inner {
    gap: 2rem;
  }
  
  .nav-menu {
    gap: 1.25rem;
    font-size: 0.875rem;
  }
  
  .logo {
    font-size: 1.35rem;
  }
  
  .logo-mark {
    width: 42px;
    height: 42px;
  }
}

@media (max-width: 768px) {
  .site-header {
    padding: 0.875rem 0;
  }
  
  .header-inner {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .logo {
    font-size: 1.25rem;
    order: 1;
  }
  
  .logo-mark {
    width: 38px;
    height: 38px;
  }
  
  .header-actions {
    order: 2;
    margin-left: auto;
  }
  
  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border-light);
  }
  
  .nav-dropdown-menu {
    left: 0;
    transform: translateX(0) translateY(-8px);
  }
  
  .nav-dropdown:hover .nav-dropdown-menu {
    transform: translateX(0) translateY(0);
  }
}

@media (max-width: 640px) {
  .nav-menu {
    gap: 0.75rem;
    font-size: 0.8125rem;
  }
  
  .nav-menu > a,
  .nav-dropdown-trigger {
    padding: 0.375rem 0.5rem;
  }
  
  .nav-dropdown-menu {
    min-width: 180px;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .site-header {
    padding: 0.75rem 0;
  }
  
  .logo {
    font-size: 1.125rem;
  }
  
  .logo-mark {
    width: 36px;
    height: 36px;
  }
  
  .nav-menu {
    gap: 0.5rem;
    font-size: 0.75rem;
  }
  
  .icon-button {
    padding: 0.5rem;
  }
}

/* Search overlay */
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-overlay-inner {
  position: relative;
  max-width: 960px;
  width: 100%;
  animation: slideUp var(--transition-slow);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.overlay-close {
  position: absolute;
  top: -1rem;
  right: 0;
  border: none;
  background: none;
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.overlay-close:hover {
  color: var(--color-primary);
  background: var(--color-bg-alt);
  transform: rotate(90deg);
}

.search-overlay-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.search-overlay-input-wrap {
  display: flex;
  align-items: center;
  border-radius: 16px;
  background: #fff;
  padding: 0.5rem 1rem 0.5rem 2rem;
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.search-overlay-input-wrap:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(139, 115, 85, 0.1), var(--shadow-xl);
}

.search-overlay-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 1rem 0;
  font-size: 1.125rem;
  color: var(--color-text);
  outline: none;
}

.search-overlay-input::placeholder {
  color: var(--color-text-light);
}

.search-overlay-btn {
  border: none;
  background: var(--color-primary);
  cursor: pointer;
  padding: 0.875rem 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 12px;
  transition: all var(--transition-base);
}

.search-overlay-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.search-overlay-btn:active {
  transform: translateY(0);
}

.search-overlay-popular {
  margin-top: 3rem;
}

.popular-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
  font-weight: 600;
}

.popular-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
}

.popular-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--color-border-light);
  background: #fff;
  font-size: 0.9375rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-base);
  font-weight: 500;
}

.popular-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-bg-alt);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .search-overlay-title {
    font-size: 1.875rem;
    margin-bottom: 2rem;
  }

  .search-overlay-inner {
    padding-inline: 1.5rem;
  }
  
  .search-overlay-input {
    font-size: 1rem;
    padding: 0.875rem 0;
  }
  
  .search-overlay-input-wrap {
    padding: 0.375rem 0.75rem 0.375rem 1.5rem;
  }
  
  .search-overlay-btn {
    padding: 0.75rem 1rem;
  }
  
  .search-overlay-popular {
    margin-top: 2rem;
  }
}

@media (max-width: 480px) {
  .search-overlay-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .overlay-close {
    width: 40px;
    height: 40px;
    font-size: 2rem;
  }
  
  .search-overlay-input-wrap {
    border-radius: 12px;
    padding: 0.25rem 0.5rem 0.25rem 1rem;
  }
  
  .search-overlay-input {
    font-size: 0.9375rem;
    padding: 0.75rem 0;
  }
  
  .search-overlay-btn {
    padding: 0.625rem 0.875rem;
  }
  
  .popular-chips {
    gap: 0.625rem;
  }
  
  .popular-chip {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
