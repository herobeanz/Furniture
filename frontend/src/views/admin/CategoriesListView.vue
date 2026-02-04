<template>
  <div class="categories-list">
    <div class="page-header">
      <h1>Danh mục</h1>
      <button type="button" class="btn btn-primary" @click="editId = ''; showForm = true">
        Thêm danh mục
      </button>
    </div>
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="items.length === 0">Chưa có danh mục.</div>
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Tên</th>
          <th>Slug</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in items" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.slug }}</td>
          <td>
            <button type="button" class="btn-link" @click="editId = c.id; showForm = true">Sửa</button>
            <button type="button" class="btn-link danger" @click="remove(c.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal">
        <h3>{{ editId ? 'Sửa danh mục' : 'Thêm danh mục' }}</h3>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Tên *</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Slug</label>
            <input v-model="form.slug" />
          </div>
          <div class="form-group">
            <label>Mô tả</label>
            <textarea v-model="form.description" rows="2"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Lưu</button>
            <button type="button" class="btn btn-outline" @click="showForm = false">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import apiClient from '@/services/api.client'

const items = ref<any[]>([])
const loading = ref(true)
const showForm = ref(false)
const editId = ref('')

const form = reactive({
  name: '',
  slug: '',
  description: '',
})

async function fetchList() {
  loading.value = true
  try {
    const res = await apiClient.get('/categories/list/all')
    items.value = Array.isArray(res) ? res : []
  } finally {
    loading.value = false
  }
}

watch([editId, showForm], async ([id, show]) => {
  if (!show) return
  if (id) {
    const c = await apiClient.get(`/categories/by-id/${id}`) as any
    form.name = c.name
    form.slug = c.slug
    form.description = c.description ?? ''
  } else {
    form.name = ''
    form.slug = ''
    form.description = ''
  }
})

async function saveCategory() {
  try {
    if (editId.value) {
      await apiClient.patch(`/categories/${editId.value}`, form)
    } else {
      await apiClient.post('/categories', form)
    }
    showForm.value = false
    editId.value = ''
    fetchList()
  } catch (e) {
    console.error(e)
  }
}

async function remove(id: string) {
  if (!confirm('Xóa danh mục này?')) return
  try {
    await apiClient.delete(`/categories/${id}`)
    items.value = items.value.filter((x) => x.id !== id)
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchList)
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
.btn-link {
  margin-right: 0.75rem;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.btn-link.danger {
  color: var(--color-primary);
}
.btn-link:hover,
.btn-link.danger:hover {
  text-decoration: underline;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  min-width: 320px;
}
.modal h3 {
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 0.75rem;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}
.form-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>
