<template>
  <div class="preview-layout">
    <div class="preview-toolbar">
      <div class="toolbar-left">
        <span class="toolbar-label">🔍 Chế độ xem trước</span>
      </div>
      <div class="toolbar-right">
        <button type="button" class="toolbar-btn" @click="closePreview">
          ✕ Đóng
        </button>
      </div>
    </div>
    <div class="preview-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function closePreview() {
  // Try to go back in history first (if came from admin)
  if (window.history.length > 1) {
    router.back()
  } else {
    // Fallback: redirect based on preview path
    const currentPath = router.currentRoute.value.path
    const adminPath = currentPath.replace(/\/preview$/, '')
    
    if (adminPath.includes('/san-pham/')) {
      router.push('/admin/products')
    } else if (adminPath.includes('/blog/')) {
      router.push('/admin/blog')
    } else if (adminPath.includes('/bo-suu-tap/')) {
      router.push('/admin/collections')
    } else if (adminPath.match(/^\/[^/]+\/[^/]+$/)) {
      router.push('/admin/categories')
    } else {
      router.push('/admin/dashboard')
    }
  }
}
</script>

<style scoped>
.preview-layout {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.preview-toolbar {
  background: #1e293b;
  color: #fff;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10000;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-label {
  font-size: var(--fs-body-sm);
  font-weight: 500;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--fs-body-sm);
  transition: background 0.2s;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.preview-content {
  flex: 1;
  overflow: auto;
  background: #fff;
}
</style>
