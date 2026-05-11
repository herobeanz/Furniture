<template>
  <div class="room-form">
    <h1>{{ isEdit ? 'Sửa phòng' : 'Thêm phòng' }}</h1>
    <form @submit.prevent="save" class="form-container">
      <FormField label="Tên phòng" :required="true">
        <UiInput v-model="form.name" placeholder="Enter room name" :required="true" />
      </FormField>

      <FormField label="Slug" :required="true" hint="URL-friendly name, ví dụ: phong-khach">
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
        <button type="button" class="btn btn-outline" @click="handlePreview" :disabled="!form.slug || !form.name">
          Xem trước
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <RouterLink to="/admin/rooms" class="btn btn-outline">Hủy</RouterLink>
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
import { UiInput, UiTextarea, UiCheckbox } from '@/components/ui'

const route = useRoute()
const router = useRouter()
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
      logger.error(e)
    }
  }
})

function handlePreview() {
  if (!form.slug || !form.name) {
    alert('Vui lòng nhập tên và slug để xem trước.')
    return
  }
  
  // Create preview room data
  const previewRoom = {
    id: id.value || 999999,
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
  savePreviewData('room', form.slug, previewRoom)
  
  // Navigate to preview in same app
  router.push(`/${form.slug}/preview`)
}

async function save() {
  saving.value = true
  try {
    if (isEdit.value && id.value) {
      await apiClient.patch(`/rooms/${id.value}`, form)
    } else {
      await apiClient.post('/rooms', form)
    }
    router.push('/admin/rooms')
  } catch (e) {
    logger.error(e)
    alert('Lưu thất bại.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.room-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.room-form h1 {
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
