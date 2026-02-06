<template>
  <div class="blog-list">
    <div class="page-header">
      <h1>Blog Posts</h1>
      <RouterLink to="/admin/blog/new" class="btn btn-primary">Thêm bài viết</RouterLink>
    </div>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="items.length === 0">Chưa có bài viết nào.</div>
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Tiêu đề</th>
          <th>Slug</th>
          <th>Danh mục</th>
          <th>Tác giả</th>
          <th>Nổi bật</th>
          <th>Xuất bản</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in items" :key="post.id">
          <td>{{ post.title }}</td>
          <td>{{ post.slug }}</td>
          <td>{{ post.category || '—' }}</td>
          <td>{{ post.author || '—' }}</td>
          <td>{{ post.isFeatured ? 'Có' : 'Không' }}</td>
          <td>{{ post.isActive ? 'Có' : 'Không' }}</td>
          <td>
            <RouterLink :to="'/admin/blog/' + post.id" class="link">Sửa</RouterLink>
            <a :href="postUrl(post.slug)" target="_blank" rel="noopener" class="link">Xem</a>
            <button type="button" class="link danger" @click="deletePost(post.id, post.title)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { blogService, type BlogPost } from '@/services/blog.service'

const items = ref<BlogPost[]>([])
const loading = ref(true)

function postUrl(slug: string) {
  const base = window.location.origin + import.meta.env.BASE_URL
  return `${base.replace(/\/$/, '')}/blog/${slug}`
}

async function deletePost(id: number, title: string) {
  if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return
  try {
    await blogService.deletePost(id)
    items.value = items.value.filter((p) => p.id !== id)
  } catch (e: any) {
    alert('Xóa thất bại: ' + (e?.response?.data?.message || e?.message || 'Lỗi không xác định'))
  }
}

onMounted(async () => {
  loading.value = true
  try {
    items.value = await blogService.getAdminPosts()
  } catch (e) {
    console.error('Failed to load blog posts:', e)
    items.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.page-header h1 {
  font-size: 1.5rem;
  margin: 0;
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
.link {
  margin-right: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-primary);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.link:hover {
  text-decoration: underline;
}
.link.danger {
  color: #d32f2f;
}
.link.danger:hover {
  color: #b71c1c;
}
</style>
