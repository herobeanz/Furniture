<template>
  <div class="category-form">
    <h1>{{ isEdit ? 'Sửa danh mục' : 'Thêm danh mục' }}</h1>
    <form @submit.prevent="save" class="form-container">
      <FormField label="Phòng" :required="true">
        <UiSelect v-model="form.roomId" placeholder="Chọn phòng" :required="true">
          <option value="0">Chọn phòng</option>
          <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.name }}</option>
        </UiSelect>
      </FormField>

      <FormField label="Tên danh mục" :required="true">
        <UiInput v-model="form.name" placeholder="Enter category name" :required="true" />
      </FormField>

      <FormField label="Slug" :required="true" hint="URL-friendly name, ví dụ: sofa">
        <UiInput v-model="form.slug" placeholder="Enter slug" :required="true" />
      </FormField>

      <FormField label="Mô tả" optional>
        <UiTextarea v-model="form.description" :rows="3" placeholder="Enter description" />
      </FormField>

      <FormField label="Ảnh đại diện (URL)" optional>
        <UiInput v-model="form.thumbnail" type="url" placeholder="Enter image URL" />
      </FormField>

      <FormField label="Thứ tự hiển thị" optional>
        <UiInput v-model.number="form.orderIndex" type="number" min="0" placeholder="0" />
      </FormField>

      <FormField>
        <UiCheckbox v-model="form.isActive" label="Hiển thị" />
      </FormField>

      <FormField label="SEO Title" optional>
        <UiInput v-model="form.seoTitle" placeholder="Enter SEO title" />
      </FormField>

      <FormField label="SEO Description" optional>
        <UiTextarea v-model="form.seoDescription" :rows="2" placeholder="Enter SEO description" />
      </FormField>

      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="handlePreview" :disabled="!form.slug || !form.name || !form.roomId">
          Xem trước
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <RouterLink to="/admin/categories" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import apiClient from '@/services/api/client'
import { savePreviewData } from '@/utils/preview'
import FormField from '@/components/ui/FormField.vue'
import { UiInput, UiTextarea, UiSelect, UiCheckbox } from '@/components/ui'

const route = useRoute()
const router = useRouter()
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
    logger.error(e)
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
      logger.error(e)
    }
  }
})

function handlePreview() {
  if (!form.slug || !form.name || !form.roomId) {
    alert('Vui lòng nhập đầy đủ thông tin (phòng, tên, slug) để xem trước.')
    return
  }
  
  // Find room slug
  const selectedRoom = rooms.value.find(r => r.id === form.roomId)
  if (!selectedRoom) {
    alert('Không tìm thấy phòng đã chọn.')
    return
  }
  
  // Create preview category data
  const previewCategory = {
    id: id.value || 999999,
    roomId: form.roomId,
    name: form.name,
    slug: form.slug,
    description: form.description || '',
    thumbnail: form.thumbnail || '',
    orderIndex: form.orderIndex || 0,
    isActive: form.isActive,
    seoTitle: form.seoTitle || '',
    seoDescription: form.seoDescription || '',
  }
  
  // Save to localStorage
  savePreviewData('category', form.slug, previewCategory)
  
  // Navigate to preview in same app
  router.push(`/${selectedRoom.slug}/${form.slug}/preview`)
}

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await apiClient.patch(`/categories/${id.value}`, form)
    } else {
      await apiClient.post('/categories', form)
    }
    router.push('/admin/categories')
  } catch (e) {
    logger.error(e)
    alert('Lưu thất bại.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.category-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.category-form h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #111827;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>
