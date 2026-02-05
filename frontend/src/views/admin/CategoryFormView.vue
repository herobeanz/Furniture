<template>
  <div class="category-form">
    <div class="page-header">
      <h1>{{ isEdit ? 'Sửa danh mục' : 'Thêm danh mục' }}</h1>
      <RouterLink to="/admin/categories" class="btn btn-outline">Quay lại</RouterLink>
    </div>
    <form @submit.prevent="save" class="form">
      <div class="form-group">
        <label>Phòng *</label>
        <select v-model.number="form.roomId" required>
          <option value="">Chọn phòng</option>
          <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Tên danh mục *</label>
        <input v-model="form.name" required />
      </div>
      <div class="form-group">
        <label>Slug *</label>
        <input v-model="form.slug" required />
        <small>URL-friendly name, ví dụ: sofa</small>
      </div>
      <div class="form-group">
        <label>Mô tả</label>
        <textarea v-model="form.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Ảnh đại diện (URL)</label>
        <input v-model="form.thumbnail" type="url" />
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input v-model.number="form.orderIndex" type="number" min="0" />
      </div>
      <div class="form-group">
        <label>
          <input v-model="form.isActive" type="checkbox" />
          Hiển thị
        </label>
      </div>
      <div class="form-group">
        <label>SEO Title</label>
        <input v-model="form.seoTitle" />
      </div>
      <div class="form-group">
        <label>SEO Description</label>
        <textarea v-model="form.seoDescription" rows="2"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <RouterLink to="/admin/categories" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import apiClient from '@/services/api.client'

const route = useRoute()
const id = computed(() => route.params.id as string)
const isEdit = computed(() => !!id.value)
const saving = ref(false)
const rooms = ref<any[]>([])

const form = reactive({
  roomId: 0,
  name: '',
  slug: '',
  description: '',
  thumbnail: '',
  orderIndex: 0,
  isActive: true,
  seoTitle: '',
  seoDescription: '',
})

onMounted(async () => {
  // Load rooms
  try {
    const roomsRes = await apiClient.get('/rooms')
    rooms.value = Array.isArray(roomsRes) ? roomsRes : []
  } catch (e) {
    console.error(e)
  }

  // Load category if editing
  if (isEdit.value) {
    try {
      const c = await apiClient.get(`/categories/by-id/${id.value}`) as any
      form.roomId = c.roomId || 0
      form.name = c.name || ''
      form.slug = c.slug || ''
      form.description = c.description || ''
      form.thumbnail = c.thumbnail || ''
      form.orderIndex = c.orderIndex || 0
      form.isActive = c.isActive ?? true
      form.seoTitle = c.seoTitle || ''
      form.seoDescription = c.seoDescription || ''
    } catch (e) {
      console.error(e)
    }
  }
})

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await apiClient.patch(`/categories/${id.value}`, form)
    } else {
      await apiClient.post('/categories', form)
    }
    // Redirect to list
    window.location.href = '/admin/categories'
  } catch (e) {
    console.error(e)
    alert('Lưu thất bại.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.page-header h1 {
  font-size: 1.5rem;
  margin: 0;
}
.form {
  max-width: 600px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}
.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
}
.form-group small {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #666;
}
.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
}
</style>
