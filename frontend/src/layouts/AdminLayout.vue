<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <span class="brand-logo">Furniture Admin</span>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Navigation</div>
          <RouterLink to="/admin/dashboard" class="nav-item">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </RouterLink>
          <RouterLink to="/admin/inquiries" class="nav-item">
            <span class="nav-icon">📋</span>
            <span>Yêu cầu</span>
          </RouterLink>
          <RouterLink to="/admin/reports" class="nav-item">
            <span class="nav-icon">📊</span>
            <span>Báo cáo</span>
          </RouterLink>
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Quản lý</div>
          <RouterLink to="/admin/rooms" class="nav-item">
            <span class="nav-icon">🏠</span>
            <span>Phòng</span>
          </RouterLink>
          <RouterLink to="/admin/categories" class="nav-item">
            <span class="nav-icon">📁</span>
            <span>Danh mục</span>
          </RouterLink>
          <RouterLink to="/admin/products" class="nav-item">
            <span class="nav-icon">🛋️</span>
            <span>Sản phẩm</span>
          </RouterLink>
          <RouterLink to="/admin/collections" class="nav-item">
            <span class="nav-icon">📚</span>
            <span>Bộ sưu tập</span>
          </RouterLink>
          <RouterLink to="/admin/cms-pages" class="nav-item">
            <span class="nav-icon">📄</span>
            <span>CMS</span>
          </RouterLink>
          <RouterLink to="/admin/blog" class="nav-item">
            <span class="nav-icon">✍️</span>
            <span>Blog</span>
          </RouterLink>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="user-profile" @click="toggleUserMenu" :class="{ active: showUserMenu }">
          <div class="user-avatar">{{ admin?.username?.[0]?.toUpperCase() || 'A' }}</div>
          <div class="user-info">
            <span class="user-name">{{ admin?.username || 'Admin' }}</span>
          </div>
          <!-- <span class="user-dropdown-icon">▼</span> -->
        </div>
        <div v-if="showUserMenu" class="user-menu">
          <button type="button" class="menu-item" @click="handleAccountInfo">
            <span class="menu-icon">👤</span>
            <span>Thông tin tài khoản</span>
          </button>
          <button type="button" class="menu-item" @click="logout">
            <span class="menu-icon">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
    <main class="admin-main">
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAdminAuthStore } from '@/stores/adminAuth'

const router = useRouter()
const authStore = useAdminAuthStore()
const { admin } = storeToRefs(authStore)

const showUserMenu = ref(false)

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function handleAccountInfo() {
  showUserMenu.value = false
  router.push('/admin/account')
}

function logout() {
  showUserMenu.value = false
  authStore.logout()
  router.push('/admin/login')
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.sidebar-footer')) {
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
  background: #f5f5f5;
}
.admin-sidebar {
  width: 260px;
  background: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}
.sidebar-brand {
  padding: 1.5rem 1.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.brand-logo {
  color: #fff;
  letter-spacing: 0.5px;
}
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}
.nav-section {
  margin-bottom: 1.5rem;
}
.nav-section-title {
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.5px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.nav-item.router-link-active {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border-left: 3px solid #3b82f6;
}
.nav-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.user-profile:hover {
  background: rgba(255, 255, 255, 0.05);
}
.user-profile.active {
  background: rgba(255, 255, 255, 0.1);
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}
.user-info {
  flex: 1;
  min-width: 0;
}
.user-name {
  font-size: 0.875rem;
  color: #fff;
  font-weight: 500;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-dropdown-icon {
  font-size: 0.7rem;
  color: #94a3b8;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.user-profile.active .user-dropdown-icon {
  transform: rotate(180deg);
}
.user-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin: 0.5rem 0;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}
.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
.menu-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  min-height: 100vh;
}
.admin-content {
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
}
</style>
