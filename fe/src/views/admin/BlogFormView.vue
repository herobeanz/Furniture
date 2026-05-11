<template>
  <div class="blog-form">
    <h1>{{ isEdit ? 'Sửa bài viết' : 'Thêm bài viết' }}</h1>
    <div v-if="loading">Đang tải...</div>
    <form v-else @submit.prevent="onSubmit" class="form-container">
      <FormField label="Tiêu đề" :required="true">
        <UiInput v-model="form.title" placeholder="Enter title" :required="true" />
      </FormField>

      <FormField label="Slug" :required="true" :hint="form.slug ? `URL: /blog/${form.slug}` : ''">
        <UiInput v-model="form.slug" placeholder="Enter slug" :required="true" />
      </FormField>

      <FormField label="Tóm tắt" optional>
        <UiTextarea v-model="form.excerpt" :rows="3" placeholder="Mô tả ngắn về bài viết..." />
      </FormField>

      <FormField label="Nội dung" :required="true">
        <UiTextarea v-model="form.content" :rows="15" placeholder="Enter content" :required="true" />
      </FormField>

      <div class="form-row">
        <FormField label="Danh mục" optional>
          <UiInput v-model="form.category" placeholder="VD: PHÒNG KHÁCH, TIPS, ..." />
        </FormField>
        <FormField label="Tác giả" optional>
          <UiInput v-model="form.author" placeholder="Enter author" />
        </FormField>
      </div>

      <FormField label="Ảnh đại diện (URL)" optional>
        <UiInput v-model="form.thumbnail" type="url" placeholder="Enter image URL" />
        <div v-if="form.thumbnail" class="thumbnail-preview">
          <img :src="form.thumbnail" alt="Preview" />
        </div>
      </FormField>

      <div class="form-row">
        <FormField>
          <UiCheckbox v-model="form.isActive" label="Kích hoạt" />
          <p v-if="!form.isActive" class="form-hint warning">
            ⚠️ Bài viết sẽ không hiển thị trên frontend nếu không được kích hoạt
          </p>
        </FormField>
        <FormField>
          <UiCheckbox v-model="form.isFeatured" label="Nổi bật (Featured)" />
          <p class="form-hint">Bài viết nổi bật sẽ hiển thị trên trang chủ</p>
        </FormField>
      </div>

      <FormField label="Ngày xuất bản" optional>
        <UiInput v-model="form.publishedAt" type="datetime-local" />
        <p class="form-hint">Để trống để xuất bản ngay</p>
        <p v-if="form.publishedAt && new Date(form.publishedAt) > new Date()" class="form-hint warning">
          ⚠️ Bài viết sẽ không hiển thị cho đến khi đến ngày xuất bản
        </p>
      </FormField>

      <FormField label="SEO Title" optional>
        <UiInput v-model="form.seoTitle" placeholder="Enter SEO title" />
      </FormField>

      <FormField label="SEO Description" optional>
        <UiTextarea v-model="form.seoDescription" :rows="2" placeholder="Enter SEO description" />
      </FormField>

      <div v-if="form.slug && isEdit" class="form-group preview-link">
        <FormField label="Xem trước">
          <div class="preview-actions">
            <a
              v-if="canPreview"
              :href="postUrl(form.slug)"
              target="_blank"
              rel="noopener"
              class="btn btn-outline btn-sm"
            >
              Mở bài viết (Public) →
            </a>
            <a
              href="#"
              class="btn btn-outline btn-sm"
              :class="{ 'btn-warning': !canPreview }"
              @click.prevent="openPreview"
            >
              {{ canPreview ? 'Xem trước (Admin)' : 'Xem trước (Admin - Chưa public)' }}
            </a>
            <small class="hint" v-if="!canPreview">
              ⚠️ Bài viết chưa hiển thị trên frontend do:
              <span v-if="!form.isActive">• Chưa được kích hoạt</span>
              <span v-if="form.publishedAt && new Date(form.publishedAt) > new Date()">
                • Chưa đến ngày xuất bản
              </span>
            </small>
          </div>
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
        <RouterLink to="/admin/blog" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { blogApi, type BlogPost } from '@/services/api/blog'
import { savePreviewData } from '@/utils/preview'
import FormField from '@/components/ui/FormField.vue'
import { UiInput, UiTextarea, UiCheckbox } from '@/components/ui'

const route = useRoute()
const router = useRouter()
const idParam = route.params.id as string
const id = idParam && idParam !== 'new' ? Number(idParam) : null
const isEdit = !!id

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  category: '',
  author: '',
  seoTitle: '',
  seoDescription: '',
  isActive: true,
  isFeatured: false,
  publishedAt: '',
})

const loading = ref(!!isEdit)
const saving = ref(false)
const error = ref('')

const canPreview = computed(() => {
  if (!form.isActive) return false
  if (form.publishedAt && new Date(form.publishedAt) > new Date()) return false
  return true
})

function postUrl(slug: string) {
  const base = window.location.origin + import.meta.env.BASE_URL
  return `${base.replace(/\/$/, '')}/blog/${slug}`
}

async function openPreview(e: Event) {
  e.preventDefault()
  if (!form.slug) return
  try {
    // Verify post exists via admin preview endpoint
    await blogApi.getPostPreview(form.slug)
    // Open in new tab
    window.open(postUrl(form.slug), '_blank')
  } catch (err: any) {
    alert('Không thể xem trước: ' + (err?.response?.data?.message || err?.message || 'Lỗi không xác định'))
  }
}

function formatDateTime(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

onMounted(async () => {
  if (!isEdit) {
    loading.value = false
    return
  }
  if (!id) return
  loading.value = true
  try {
    const post = await blogApi.getAdminPost(id)
    form.title = post.title || ''
    form.slug = post.slug || ''
    form.excerpt = post.excerpt || ''
    form.content = post.content || ''
    form.thumbnail = post.thumbnail || ''
    form.category = post.category || ''
    form.author = post.author || ''
    form.seoTitle = post.seoTitle || ''
    form.seoDescription = post.seoDescription || ''
    form.isActive = post.isActive ?? true
    form.isFeatured = post.isFeatured ?? false
    form.publishedAt = post.publishedAt ? formatDateTime(post.publishedAt) : ''
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Không thể tải bài viết.'
    logger.error('Failed to load blog post:', e)
  } finally {
    loading.value = false
  }
})

function handlePreview() {
  if (!form.slug || !form.title) {
    alert('Vui lòng nhập tiêu đề và slug để xem trước.')
    return
  }
  
  // Create preview blog post data
  const previewPost: BlogPost = {
    id: id || 999999, // Temporary ID for preview
    title: form.title.trim(),
    slug: form.slug.trim(),
    excerpt: form.excerpt?.trim() || '',
    content: form.content.trim(),
    thumbnail: form.thumbnail?.trim() || '',
    category: form.category?.trim() || '',
    author: form.author?.trim() || '',
    seoTitle: form.seoTitle?.trim() || '',
    seoDescription: form.seoDescription?.trim() || '',
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  // Save to localStorage
  savePreviewData('blog', form.slug, previewPost)
  
  // Navigate to preview in same app
  router.push(`/blog/${form.slug}/preview`)
}

async function onSubmit() {
  saving.value = true
  error.value = ''
  try {
    const payload: Partial<BlogPost> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt?.trim() || undefined,
      content: form.content.trim(),
      thumbnail: form.thumbnail?.trim() || undefined,
      category: form.category?.trim() || undefined,
      author: form.author?.trim() || undefined,
      seoTitle: form.seoTitle?.trim() || undefined,
      seoDescription: form.seoDescription?.trim() || undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
    }

    if (isEdit && id) {
      await blogApi.updatePost(id, payload)
    } else {
      await blogApi.createPost(payload)
    }
    router.push('/admin/blog')
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Lưu thất bại.'
    logger.error('Failed to save blog post:', e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.blog-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.blog-form h1 {
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.thumbnail-preview {
  margin-top: 0.5rem;
}

.thumbnail-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 6px;
  border: 1px solid #eee;
}

.preview-link {
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 6px;
  border: 1px solid #eee;
}

.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.hint {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

:deep(.form-hint.warning) {
  color: #dc2626;
}
</style>
