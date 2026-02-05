<template>
  <div class="hero-list">
    <div class="page-header">
      <h1>Hero trang chủ</h1>
      <RouterLink to="/admin/hero/new" class="btn btn-primary">Thêm ô Hero</RouterLink>
    </div>
    <p class="page-desc">Các ô hiển thị ở phần Hero trang chủ (tối đa 4 ô dạng 2x2). Link thường trỏ tới danh mục, ví dụ: /category/phong-khach</p>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="items.length === 0">Chưa có ô Hero. Bấm "Thêm ô Hero" để tạo.</div>
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Thứ tự</th>
          <th>Tiêu đề</th>
          <th>Link</th>
          <th>Ảnh</th>
          <th>Hiển thị</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in items" :key="h.id">
          <td>{{ h.orderIndex }}</td>
          <td>{{ h.title }}</td>
          <td><code>{{ h.link }}</code></td>
          <td>
            <img v-if="h.imageUrl" :src="h.imageUrl" alt="" class="thumb" />
            <span v-else class="muted">—</span>
          </td>
          <td>{{ h.isActive ? 'Có' : 'Ẩn' }}</td>
          <td>
            <RouterLink :to="'/admin/hero/' + h.id" class="link">Sửa</RouterLink>
            <button type="button" class="link btn-link" @click="confirmRemove(h)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { heroService, type HeroItem } from '@/services/hero.service'

const items = ref<HeroItem[]>([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    const res = await heroService.getAll()
    items.value = Array.isArray(res) ? res : []
  } finally {
    loading.value = false
  }
})

function confirmRemove(h: HeroItem) {
  if (!confirm(`Xóa ô "${h.title}"?`)) return
  heroService.remove(h.id).then(() => {
    items.value = items.value.filter((x) => x.id !== h.id)
  }).catch((e) => {
    console.error(e)
    alert('Xóa thất bại.')
  })
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.page-header h1 {
  font-size: 1.5rem;
  margin: 0;
}
.page-desc {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.data-table th {
  background: #f8f8f8;
  font-weight: 600;
  font-size: 0.8rem;
}
.thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}
.muted {
  color: #999;
}
.link {
  margin-right: 0.75rem;
  font-size: 0.875rem;
}
.btn-link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: inherit;
  text-decoration: underline;
}
.btn-link:hover {
  color: var(--color-primary);
}
code {
  font-size: 0.8rem;
  background: #f0f0f0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}
</style>
