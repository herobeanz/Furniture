<template>
  <div class="room-form">
    <div class="page-header">
      <h1>{{ isEdit ? 'Sửa phòng' : 'Thêm phòng' }}</h1>
      <RouterLink to="/admin/rooms" class="btn btn-outline">Quay lại</RouterLink>
    </div>
    <form @submit.prevent="save" class="form">
      <div class="form-group">
        <label>Tên phòng *</label>
        <input v-model="form.name" required />
      </div>
      <div class="form-group">
        <label>Slug *</label>
        <input v-model="form.slug" required />
        <small>URL-friendly name, ví dụ: phong-khach</small>
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
        <RouterLink to="/admin/rooms" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import apiClient from '@/services/api.client'

const route = useRoute()
const idParam = computed(() => route.params.id as string)
const id = computed(() => idParam.value && idParam.value !== 'new' ? Number(idParam.value) : null)
const isEdit = computed(() => !!id.value)
const saving = ref(false)

const form = reactive({
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
  if (isEdit.value && id.value) {
    try {
      const r = await apiClient.get(`/rooms/by-id/${id.value}`) as any
      form.name = r.name || ''
      form.slug = r.slug || ''
      form.description = r.description || ''
      form.thumbnail = r.thumbnail || ''
      form.orderIndex = r.orderIndex || 0
      form.isActive = r.isActive ?? true
      form.seoTitle = r.seoTitle || ''
      form.seoDescription = r.seoDescription || ''
    } catch (e) {
      console.error(e)
    }
  }
})

async function save() {
  saving.value = true
  try {
    if (isEdit.value && id.value) {
      await apiClient.patch(`/rooms/${id.value}`, form)
    } else {
      await apiClient.post('/rooms', form)
    }
    // Redirect to list
    window.location.href = '/admin/rooms'
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
.form-group textarea {
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
