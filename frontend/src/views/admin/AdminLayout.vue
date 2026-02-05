<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-brand">Admin</div>
      <nav class="sidebar-nav">
        <RouterLink to="/admin/dashboard">Tổng quan</RouterLink>
        <RouterLink to="/admin/inquiries">Yêu cầu</RouterLink>
        <RouterLink to="/admin/products">Sản phẩm</RouterLink>
        <RouterLink to="/admin/categories">Danh mục</RouterLink>
        <RouterLink to="/admin/rooms">Phòng</RouterLink>
        <RouterLink to="/admin/cms-pages">CMS</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <RouterLink to="/">← Về site</RouterLink>
        <button type="button" class="btn-logout" @click="logout">Đăng xuất</button>
      </div>
    </aside>
    <main class="admin-main">
      <header class="admin-header">
        <span class="admin-user">{{ admin?.username }}</span>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAdminAuthStore } from '@/stores/adminAuth'

const router = useRouter()
const authStore = useAdminAuthStore()
const { admin } = storeToRefs(authStore)

function logout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.admin-sidebar {
  width: 220px;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  flex-direction: column;
}
.sidebar-brand {
  padding: 1.25rem 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-bottom: 1px solid #333;
}
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}
.sidebar-nav a {
  display: block;
  padding: 0.6rem 1.5rem;
  color: #ccc;
  text-decoration: none;
}
.sidebar-nav a:hover,
.sidebar-nav a.router-link-active {
  background: #333;
  color: #fff;
}
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #333;
}
.sidebar-footer a {
  display: block;
  color: #888;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}
.sidebar-footer a:hover {
  color: #fff;
}
.btn-logout {
  background: none;
  border: none;
  color: #888;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}
.btn-logout:hover {
  color: #fff;
}
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}
.admin-header {
  background: #fff;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.admin-user {
  font-size: 0.9rem;
  color: #666;
}
.admin-content {
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
}
</style>
