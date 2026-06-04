<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div>
        <div class="sidebar-brand">
          <img
            :src="SITE.brand.logoMarkSrc"
            :alt="SITE.brand.name"
            class="brand-mark"
            width="32"
            height="32"
          />
          <div class="brand-text">
            <span class="brand-line-sm">{{ SITE.brand.logoLineSm }}</span>
            <span class="brand-line-lg">{{ SITE.brand.logoLineLg }}</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <RouterLink
            v-for="item in ADMIN_NAV_ITEMS"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ active: isNavActive(item) }"
          >
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>

      <div class="sidebar-footer">
        © {{ copyrightYear }} {{ SITE.brand.name }}.
      </div>
    </aside>

    <div class="admin-shell">
      <header class="admin-header">
        <div
          class="user-dropdown"
          :class="{ open: showUserMenu }"
          @click="toggleUserMenu"
        >
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-meta">
            <h4 class="user-title">{{ admin?.username || 'Admin' }}</h4>
            <p class="user-role">
              Quản trị viên
              <i class="fa-solid fa-chevron-down" />
            </p>
          </div>

          <div v-if="showUserMenu" class="user-menu" @click.stop>
            <button type="button" class="menu-item" @click="handleAccountInfo">
              <i class="fa-regular fa-user" />
              <span>Thông tin tài khoản</span>
            </button>
            <button type="button" class="menu-item" @click="handleChangePassword">
              <i class="fa-solid fa-key" />
              <span>Đổi mật khẩu</span>
            </button>
            <hr class="menu-divider" />
            <button type="button" class="menu-item menu-item-danger" @click="logout">
              <i class="fa-solid fa-arrow-right-from-bracket" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main class="admin-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAdminAuthStore } from '@/stores/adminAuth'
import { SITE } from '@/constants/site'
import { ADMIN_NAV_ITEMS, type AdminNavItem } from '@/constants/admin-nav'

const router = useRouter()
const route = useRoute()
const authStore = useAdminAuthStore()
const { admin } = storeToRefs(authStore)

const showUserMenu = ref(false)
const copyrightYear = new Date().getFullYear()

const userInitials = computed(() => {
  const name = admin.value?.username?.trim()
  if (!name) return 'AD'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

function isNavActive(item: AdminNavItem): boolean {
  if (item.match) return item.match(route.path)
  return route.path === item.to
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function handleAccountInfo() {
  showUserMenu.value = false
  router.push('/admin/account')
}

function handleChangePassword() {
  showUserMenu.value = false
  router.push('/admin/account/password')
}

function logout() {
  showUserMenu.value = false
  authStore.logout()
  router.push('/admin/login')
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.user-dropdown')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #faf9f6;
  color: #1f2937;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.admin-sidebar {
  width: 16rem;
  background: #fff;
  border-right: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 30;
}

.sidebar-brand {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f9fafb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-mark {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.brand-text {
  line-height: 1.2;
}

.brand-line-sm {
  display: block;
  font-weight: 700;
  font-size: var(--fs-body-sm);
  letter-spacing: 0.12em;
  color: #78350f;
}

.brand-line-lg {
  display: block;
  font-weight: 700;
  font-size: var(--fs-body-sm);
  color: #92400e;
}

.sidebar-nav {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-size: var(--fs-body-sm);
  font-weight: 600;
  color: #4b5563;
  transition: background 0.2s, color 0.2s;
}

.nav-item i {
  font-size: var(--fs-body-sm);
  width: 1rem;
  text-align: center;
}

.nav-item:hover {
  background: #f9fafb;
  color: #78350f;
}

.nav-item.active {
  background: #f5f2eb;
  color: #78350f;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #f9fafb;
  text-align: center;
  font-size: var(--fs-caption);
  color: #9ca3af;
}

.admin-shell {
  flex: 1;
  margin-left: 16rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-header {
  background: #fff;
  border-bottom: 1px solid #f3f4f6;
  height: 4rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 20;
}

.user-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 0;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: #78350f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--fs-body-sm);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.user-meta {
  text-align: left;
  display: none;
}

.user-title {
  margin: 0;
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: #111827;
}

.user-role {
  margin: 0;
  font-size: var(--fs-caption);
  color: #9ca3af;
}

.user-role i {
  font-size: var(--fs-caption);
  margin-left: 0.125rem;
}

.user-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.25rem;
  width: 12rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: #4b5563;
  z-index: 40;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.menu-item:hover {
  background: #f9fafb;
}

.menu-item i {
  color: #9ca3af;
  width: 0.875rem;
}

.menu-item-danger {
  color: #dc2626;
}

.menu-item-danger i {
  color: #dc2626;
}

.menu-divider {
  border: none;
  border-top: 1px solid #f3f4f6;
  margin: 0;
}

.admin-main {
  flex: 1;
}

@media (min-width: 640px) {
  .user-meta {
    display: block;
  }
}

@media (max-width: 1023px) {
  .admin-layout {
    flex-direction: column;
  }

  .admin-sidebar {
    position: static;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #f3f4f6;
  }

  .admin-shell {
    margin-left: 0;
  }
}
</style>
