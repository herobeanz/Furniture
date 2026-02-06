<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="logo">FURNITURE STORE</RouterLink>
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
        <RouterLink to="/page/lien-he">Liên hệ</RouterLink>
      </nav>
      <div class="header-actions">
        <div class="search-wrap">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm sản phẩm..."
            class="search-input"
            @keyup.enter="onSearch"
          />
          <button type="button" class="search-btn" aria-label="Tìm kiếm" @click="onSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </div>
        <RouterLink to="/wishlist" class="icon-link" aria-label="Yêu thích">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span v-if="wishlistCount" class="badge">{{ wishlistCount }}</span>
        </RouterLink>
        <RouterLink to="/cart" class="icon-link" aria-label="Giỏ hàng">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span v-if="cartCount" class="badge badge-red">{{ cartCount }}</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { categoryService, type CategoryTreeNode } from '@/services/category.service'

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const searchQuery = ref('')
const categoryTree = ref<CategoryTreeNode[]>([])

const cartCount = computed(() => cartStore.totalItems)
const wishlistCount = computed(() => wishlistStore.items.length)

onMounted(async () => {
  try {
    categoryTree.value = await categoryService.getCategoryTree()
  } catch {
    categoryTree.value = []
  }
})

function onSearch() {
  const q = searchQuery.value?.trim()
  if (q) router.push({ path: '/', query: { search: q } })
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
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: 0.05em;
  color: #1a1a1a;
  text-decoration: none;
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
.search-wrap {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-bg-alt);
}
.search-input {
  width: 220px;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
}
.search-input::placeholder {
  color: var(--color-text-muted);
}
.search-btn {
  padding: 0.5rem 0.75rem;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-btn:hover {
  color: var(--color-primary);
}
.icon-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  text-decoration: none;
}
.icon-link:hover {
  color: var(--color-primary);
}
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  background: #1a1a1a;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.badge-red {
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .header-inner {
    flex-direction: column;
  }
  .nav-menu {
    justify-content: center;
  }
  .search-wrap {
    width: 100%;
  }
  .search-input {
    width: 100%;
  }
}
</style>
