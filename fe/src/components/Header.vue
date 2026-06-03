<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="logo">
        <img
          :src="SITE.brand.logoMarkSrc"
          :alt="SITE.brand.name"
          class="logo-mark"
          width="36"
          height="36"
        />
        <span class="logo-text-stack">
          <span class="logo-line logo-line--sm">{{ SITE.brand.logoLineSm }}</span>
          <span class="logo-line logo-line--lg">{{ SITE.brand.logoLineLg }}</span>
        </span>
      </RouterLink>
      <nav class="nav-menu">
        <RouterLink
          v-for="item in MAIN_NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="nav-link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="header-actions">
        <button
          type="button"
          class="icon-button search-toggle"
          aria-label="Tìm kiếm"
          @click="openSearch"
        >
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Search overlay -->
    <div
      v-if="showSearchOverlay"
      class="search-overlay"
      @click.self="closeSearch"
    >
      <div class="search-modal">
        <!-- Close Button -->
        <button
          type="button"
          class="close-btn"
          aria-label="Đóng tìm kiếm"
          @click="closeSearch"
        >
          ×
        </button>

        <!-- Title -->
        <h2 class="search-title">Search For Products</h2>

        <!-- Search Box -->
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for products"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button
            type="button"
            class="search-btn"
            aria-label="Tìm kiếm"
            @click="handleSearch"
          >
            🔍
          </button>
        </div>

        <!-- Popular Searches -->
        <div v-if="popularCategories.length" class="popular-searches">
          <span class="label">Popular searches</span>
          <RouterLink
            v-for="item in popularCategories"
            :key="item.path"
            :to="item.path"
            class="popular-btn"
            @click="closeSearch"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useHeader } from "@/composables/common/useHeader";
import { getCategoryPath } from "@/utils/navigation";
import { MAIN_NAV_ITEMS } from "@/constants/main-nav";
import { SITE } from "@/constants/site";

const { searchQuery, navCategories, onSearch } = useHeader();

const showSearchOverlay = ref(false);

function categoryPath(slug: string) {
  return getCategoryPath({ slug });
}

const popularCategories = computed(() =>
  navCategories.value.slice(0, 8).map((cat) => ({
    name: cat.name,
    path: categoryPath(cat.slug),
  }))
);

function openSearch() {
  showSearchOverlay.value = true;
}

function closeSearch() {
  showSearchOverlay.value = false;
}

function handleSearch() {
  if (!searchQuery.value?.trim()) return;
  onSearch();
  closeSearch();
}
</script>

<style scoped>
/* Main header */
.site-header {
  background: #fff;
  border-bottom: 1px solid #f3f4f6;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
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
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
}

.logo-mark {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.logo-text-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-line {
  font-weight: 700;
  display: block;
}

.logo-line--sm {
  font-size: var(--fs-body-sm);
  letter-spacing: 0.12em;
  color: #78350f;
}

.logo-line--lg {
  font-size: var(--fs-body);
  color: var(--color-primary);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-menu > a,
.nav-link {
  font-weight: 500;
  font-size: var(--fs-body-sm);
  color: #374151;
  text-decoration: none;
  position: relative;
  transition: color var(--transition-fast);
}

.nav-menu > a::after,
.nav-link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.nav-menu > a:hover::after,
.nav-menu > a.router-link-active::after,
.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-menu > a:hover,
.nav-menu > a.router-link-active,
.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
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
  content: "";
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

.icon-button i {
  font-size: var(--icon-size-md);
  line-height: 1;
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
    font-size: var(--fs-body-sm);
  }

  .logo {
    font-size: var(--fs-subtitle);
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
    font-size: var(--fs-card-title);
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

}

@media (max-width: 640px) {
  .nav-menu {
    gap: 0.75rem;
    font-size: var(--fs-body-sm);
  }

  .nav-menu > a,
  .nav-link {
    padding: 0.375rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .site-header {
    padding: 0.75rem 0;
  }

  .logo {
    font-size: var(--fs-body-lg);
  }

  .logo-mark {
    width: 36px;
    height: 36px;
  }

  .nav-menu {
    gap: 0.5rem;
    font-size: var(--fs-body-sm);
  }

  .icon-button {
    padding: 0.5rem;
  }
}

/* Search overlay */
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
  z-index: 9999;
  animation: overlayFadeIn 0.25s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal */
.search-modal {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  padding: 50px 60px;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalSlideDown 0.3s ease-out;
  margin: 0 1rem;
}

@keyframes modalSlideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 20px;
  right: 25px;
  border: none;
  background: transparent;
  font-size: var(--fs-hero-title);
  line-height: 1;
  cursor: pointer;
  color: #999;
  transition: all var(--transition-fast);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  color: #333;
  background: #f5f5f5;
  transform: rotate(90deg);
}

/* Title */
.search-title {
  text-align: center;
  font-size: var(--fs-hero-title);
  margin-bottom: 40px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

/* Search Box */
.search-box {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  height: 58px;
  border: 1px solid #eee;
  border-radius: 999px;
  padding: 0 60px 0 25px;
  font-size: var(--fs-body);
  outline: none;
  background: #f7f7f7;
  transition: all var(--transition-base);
  color: var(--color-text);
}

.search-input:focus {
  background: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--fs-card-title);
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.search-btn:hover {
  background: #f0f0f0;
  transform: translateY(-50%) scale(1.1);
}

/* Popular Searches */
.popular-searches {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.popular-searches .label {
  font-weight: 600;
  color: #222;
  font-size: var(--fs-body);
  margin-right: 4px;
}

.popular-btn {
  border: 1px solid #ddd;
  background: #fff;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--fs-body-sm);
  color: #333;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
}

.popular-btn:hover {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .search-modal {
    max-width: 900px;
    padding: 45px 50px;
  }

  .search-title {
    font-size: var(--fs-hero-title);
    margin-bottom: 35px;
  }
}

@media (max-width: 768px) {
  .search-overlay {
    padding-top: 60px;
  }

  .search-modal {
    max-width: 100%;
    padding: 40px 30px;
    margin: 0 1rem;
    border-radius: 6px;
  }

  .close-btn {
    top: 15px;
    right: 15px;
    font-size: var(--fs-hero-title);
    width: 36px;
    height: 36px;
  }

  .search-title {
    font-size: var(--fs-page-title);
    margin-bottom: 30px;
  }

  .search-box {
    max-width: 100%;
  }

  .search-input {
    height: 52px;
    font-size: var(--fs-body);
    padding: 0 55px 0 20px;
  }

  .search-btn {
    right: 15px;
    font-size: var(--fs-body-lg);
  }

  .popular-searches {
    margin-top: 25px;
    gap: 10px;
  }

  .popular-searches .label {
    width: 100%;
    text-align: center;
    margin-bottom: 5px;
  }
}

@media (max-width: 640px) {
  .search-overlay {
    padding-top: 40px;
  }

  .search-modal {
    padding: 35px 25px;
    margin: 0 0.75rem;
  }

  .search-title {
    font-size: var(--fs-section-title);
    margin-bottom: 25px;
  }

  .search-input {
    height: 48px;
    font-size: var(--fs-body-sm);
  }

  .popular-searches {
    gap: 8px;
  }

  .popular-btn {
    padding: 7px 15px;
    font-size: var(--fs-body-sm);
  }
}

@media (max-width: 480px) {
  .search-overlay {
    padding-top: 30px;
  }

  .search-modal {
    padding: 30px 20px;
    margin: 0 0.5rem;
    border-radius: 4px;
  }

  .close-btn {
    top: 12px;
    right: 12px;
    font-size: var(--fs-page-title);
    width: 32px;
    height: 32px;
  }

  .search-title {
    font-size: var(--fs-subtitle);
    margin-bottom: 20px;
  }

  .search-input {
    height: 46px;
    font-size: var(--fs-body-sm);
    padding: 0 50px 0 18px;
  }

  .search-btn {
    right: 12px;
    font-size: var(--fs-body);
  }

  .popular-searches {
    margin-top: 20px;
    gap: 6px;
  }

  .popular-searches .label {
    font-size: var(--fs-body-sm);
  }

  .popular-btn {
    padding: 6px 12px;
    font-size: var(--fs-caption);
  }
}
</style>
