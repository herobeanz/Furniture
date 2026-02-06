<template>
  <div class="cms-form">
    <h1>{{ isEdit ? 'Sửa trang CMS' : 'Thêm trang CMS' }}</h1>
    <div v-if="loading">Đang tải...</div>
    <form v-else @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="slug">Slug *</label>
        <input id="slug" v-model="form.slug" required />
        <small class="hint" v-if="form.slug">URL: <code>/page/{{ form.slug }}</code></small>
      </div>
      <div class="form-group">
        <label for="title">Tiêu đề *</label>
        <input id="title" v-model="form.title" required />
      </div>
      <div class="form-group">
        <label for="content">Nội dung *</label>
        <textarea id="content" v-model="form.content" rows="12"></textarea>
      </div>
      <div class="form-group">
        <label>
          <input v-model="form.isActive" type="checkbox" />
          Kích hoạt
        </label>
      </div>
      <div class="form-group">
        <label for="thumbnail">Ảnh đại diện (URL)</label>
        <input id="thumbnail" v-model="form.thumbnail" type="url" />
      </div>
      <div class="form-group">
        <label for="pageType">Loại trang</label>
        <input id="pageType" v-model="form.pageType" />
      </div>
      <div class="form-group">
        <label for="metaKeywords">Meta Keywords</label>
        <input id="metaKeywords" v-model="form.metaKeywords" />
      </div>
      <div class="form-group">
        <label for="publishedAt">Ngày xuất bản</label>
        <input id="publishedAt" v-model="form.publishedAt" type="datetime-local" />
      </div>
      <div class="form-group">
        <label for="seoTitle">SEO Title</label>
        <input id="seoTitle" v-model="form.seoTitle" />
      </div>
      <div class="form-group">
        <label for="seoDescription">SEO Description</label>
        <textarea id="seoDescription" v-model="form.seoDescription" rows="2"></textarea>
      </div>
      <div v-if="form.slug" class="form-group preview-link">
        <label>Xem trước</label>
        <a :href="pageUrl(form.slug)" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
          Mở trang CMS →
        </a>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="form-actions">
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
.cms-form h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
}
.form-group input,
.form-group textarea {
  width: 100%;
  max-width: 600px;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
}
.form-group textarea {
  font-family: inherit;
  resize: vertical;
}
.hint {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}
.hint code {
  background: #f0f0f0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
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
.error {
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
