<template>
  <div class="cms-form">
    <h1>{{ isEdit ? 'Sửa trang CMS' : 'Thêm trang CMS' }}</h1>
    <div v-if="loading">Đang tải...</div>
    <form v-else @submit.prevent="onSubmit" class="form-container">
      <FormField label="Slug" :required="true" :hint="form.slug ? `URL: /page/${form.slug}` : ''">
        <UiInput v-model="form.slug" placeholder="Enter slug" :required="true" />
      </FormField>

      <FormField label="Tiêu đề" :required="true">
        <UiInput v-model="form.title" placeholder="Enter title" :required="true" />
      </FormField>

      <FormField label="Nội dung" :required="true">
        <UiTextarea v-model="form.content" :rows="12" placeholder="Enter content" :required="true" />
      </FormField>

      <FormField>
        <UiCheckbox v-model="form.isActive" label="Kích hoạt" />
      </FormField>

      <FormField label="Ảnh đại diện (URL)" optional>
        <UiInput v-model="form.thumbnail" type="url" placeholder="Enter image URL" />
      </FormField>

      <FormField label="Loại trang" optional>
        <UiInput v-model="form.pageType" placeholder="Enter page type" />
      </FormField>

      <FormField label="Meta Keywords" optional>
        <UiInput v-model="form.metaKeywords" placeholder="Enter meta keywords" />
      </FormField>

      <FormField label="Ngày xuất bản" optional>
        <UiInput v-model="form.publishedAt" type="datetime-local" />
      </FormField>

      <FormField label="SEO Title" optional>
        <UiInput v-model="form.seoTitle" placeholder="Enter SEO title" />
      </FormField>

      <FormField label="SEO Description" optional>
        <UiTextarea v-model="form.seoDescription" :rows="2" placeholder="Enter SEO description" />
      </FormField>

      <div v-if="form.slug" class="form-group preview-link">
        <FormField label="Xem trước">
          <a :href="pageUrl(form.slug)" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
            Mở trang CMS →
          </a>
        </FormField>
      </div>

      <FormField v-if="error" :error="error" />

      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="handlePreview" :disabled="!form.slug || !form.title">
          Xem trước
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <RouterLink to="/admin/cms-pages" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import apiClient from '@/services/api.client'
import { savePreviewData } from '@/utils/preview'
import FormField from '@/components/ui/FormField.vue'
import { UiInput, UiTextarea, UiCheckbox } from '@/components/ui'

const route = useRoute()
const router = useRouter()
const idParam = route.params.id as string
const id = idParam && idParam !== 'new' ? Number(idParam) : null
const isEdit = !!id

const form = reactive({
  slug: '',
  title: '',
  content: '',
  thumbnail: '',
  isActive: true,
  seoTitle: '',
  seoDescription: '',
  pageType: '',
  metaKeywords: '',
  publishedAt: '',
})

const loading = ref(!!isEdit)
const saving = ref(false)
const error = ref('')

function pageUrl(slug: string) {
  const base = window.location.origin + import.meta.env.BASE_URL
  return `${base.replace(/\/$/, '')}/page/${slug}`
}

function handlePreview() {
  if (!form.slug || !form.title) {
    alert('Vui lòng nhập tiêu đề và slug để xem trước.')
    return
  }
  
  // Create preview CMS page data
  const previewPage = {
    title: form.title.trim(),
    content: form.content.trim(),
  }
  
  // Save to localStorage
  savePreviewData('cms', form.slug, previewPage)
  
  // Navigate to preview in same app
  router.push(`/page/${form.slug}/preview`)
}

onMounted(async () => {
  if (!isEdit) {
    loading.value = false
    return
  }
  try {
    const p = await apiClient.get(`/cms/${id}`) as any
    form.slug = p.slug || ''
    form.title = p.title || ''
    form.content = p.content ?? ''
    form.thumbnail = p.thumbnail || ''
    form.isActive = p.isActive ?? true
    form.seoTitle = p.seoTitle || ''
    form.seoDescription = p.seoDescription || ''
    form.pageType = p.pageType || ''
    form.metaKeywords = p.metaKeywords || ''
    form.publishedAt = p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 16) : ''
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  saving.value = true
  error.value = ''
  try {
    const payload = {
      ...form,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
    }
    if (isEdit && id) {
      await apiClient.put(`/cms/${id}`, payload)
    } else {
      await apiClient.post('/cms', form)
    }
    router.push('/admin/cms-pages')
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Lưu thất bại.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.cms-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.cms-form h1 {
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

.preview-link {
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 6px;
  border: 1px solid #eee;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>
