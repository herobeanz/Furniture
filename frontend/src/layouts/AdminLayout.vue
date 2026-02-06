<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-brand">Admin</div>
      <nav class="sidebar-nav">
        <RouterLink to="/admin/dashboard">Tổng quan</RouterLink>
        <RouterLink to="/admin/inquiries">Yêu cầu</RouterLink>
        <div class="nav-group">
          <RouterLink to="/admin/rooms" class="nav-parent">Phòng</RouterLink>
          <div class="nav-children">
            <RouterLink to="/admin/categories" class="nav-child">Danh mục</RouterLink>
            <div class="nav-grandchildren">
              <RouterLink to="/admin/products" class="nav-grandchild">Sản phẩm</RouterLink>
            </div>
          </div>
        </div>
        <RouterLink to="/admin/collections">Bộ sưu tập</RouterLink>
        <RouterLink to="/admin/cms-pages">CMS</RouterLink>
        <RouterLink to="/admin/blog">Blog</RouterLink>
        <RouterLink to="/admin/reports">Báo cáo</RouterLink>
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
.sidebar-nav > a {
  display: block;
  padding: 0.6rem 1.5rem;
  color: #ccc;
  text-decoration: none;
}
.sidebar-nav > a:hover,
.sidebar-nav > a.router-link-active {
  background: #333;
  color: #fff;
}
.nav-group {
  margin: 0;
}
.nav-parent {
  display: block;
  padding: 0.6rem 1.5rem;
  color: #ccc;
  text-decoration: none;
}
.nav-parent:hover,
.nav-parent.router-link-active {
  background: #333;
  color: #fff;
}
.nav-children {
  margin-left: 0;
}
.nav-child {
  display: block;
  padding: 0.5rem 1.5rem 0.5rem 2.5rem;
  color: #aaa;
  text-decoration: none;
  font-size: 0.95rem;
}
.nav-child:hover,
.nav-child.router-link-active {
  background: #2a2a2a;
  color: #fff;
}
.nav-grandchildren {
  margin-left: 0;
}
.nav-grandchild {
  display: block;
  padding: 0.5rem 1.5rem 0.5rem 3.5rem;
  color: #999;
  text-decoration: none;
  font-size: 0.9rem;
}
.nav-grandchild:hover,
.nav-grandchild.router-link-active {
  background: #2a2a2a;
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
  text-decoration: none;
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
