<template>
  <div class="blog-form">
    <h1>{{ isEdit ? 'Sửa bài viết' : 'Thêm bài viết' }}</h1>
    <div v-if="loading">Đang tải...</div>
    <form v-else @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="title">Tiêu đề *</label>
        <input id="title" v-model="form.title" required />
      </div>
      <div class="form-group">
        <label for="slug">Slug *</label>
        <input id="slug" v-model="form.slug" required />
        <small class="hint" v-if="form.slug">URL: <code>/blog/{{ form.slug }}</code></small>
      </div>
      <div class="form-group">
        <label for="excerpt">Tóm tắt</label>
        <textarea id="excerpt" v-model="form.excerpt" rows="3" placeholder="Mô tả ngắn về bài viết..."></textarea>
      </div>
      <div class="form-group">
        <label for="content">Nội dung *</label>
        <textarea id="content" v-model="form.content" rows="15" required></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="category">Danh mục</label>
          <input id="category" v-model="form.category" placeholder="VD: PHÒNG KHÁCH, TIPS, ..." />
        </div>
        <div class="form-group">
          <label for="author">Tác giả</label>
          <input id="author" v-model="form.author" />
        </div>
      </div>
      <div class="form-group">
        <label for="thumbnail">Ảnh đại diện (URL)</label>
        <input id="thumbnail" v-model="form.thumbnail" type="url" />
        <div v-if="form.thumbnail" class="thumbnail-preview">
          <img :src="form.thumbnail" alt="Preview" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>
            <input v-model="form.isActive" type="checkbox" />
            Kích hoạt
          </label>
          <small class="hint warning" v-if="!form.isActive">
            ⚠️ Bài viết sẽ không hiển thị trên frontend nếu không được kích hoạt
          </small>
        </div>
        <div class="form-group">
          <label>
            <input v-model="form.isFeatured" type="checkbox" />
            Nổi bật (Featured)
          </label>
          <small class="hint">Bài viết nổi bật sẽ hiển thị trên trang chủ</small>
        </div>
      </div>
      <div class="form-group">
        <label for="publishedAt">Ngày xuất bản</label>
        <input
          id="publishedAt"
          v-model="form.publishedAt"
          type="datetime-local"
        />
        <small class="hint">Để trống để xuất bản ngay</small>
        <small class="hint warning" v-if="form.publishedAt && new Date(form.publishedAt) > new Date()">
          ⚠️ Bài viết sẽ không hiển thị cho đến khi đến ngày xuất bản
        </small>
      </div>
      <div class="form-group">
        <label for="seoTitle">SEO Title</label>
        <input id="seoTitle" v-model="form.seoTitle" />
      </div>
      <div class="form-group">
        <label for="seoDescription">SEO Description</label>
        <textarea id="seoDescription" v-model="form.seoDescription" rows="2"></textarea>
      </div>
      <div v-if="form.slug && isEdit" class="form-group preview-link">
        <label>Xem trước</label>
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
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <RouterLink to="/admin/blog" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { blogService, type BlogPost } from '@/services/blog.service'

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
    await blogService.getPostPreview(form.slug)
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
    const post = await blogService.getAdminPost(id)
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
    console.error('Failed to load blog post:', e)
  } finally {
    loading.value = false
  }
})

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
      await blogService.updatePost(id, payload)
    } else {
      await blogService.createPost(payload)
    }
    router.push('/admin/blog')
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Lưu thất bại.'
    console.error('Failed to save blog post:', e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.blog-form {
  max-width: 900px;
}
.blog-form h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1.25rem;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="datetime-local"],
.form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}
.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}
.form-group textarea {
  font-family: inherit;
  resize: vertical;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #666;
}
.hint.warning {
  color: #d32f2f;
  font-weight: 500;
}
.hint code {
  background: #f0f0f0;
  padding: 0.15rem 0.3rem;
  border-radius: 3px;
  font-size: 0.85rem;
}
.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.thumbnail-preview {
  margin-top: 0.5rem;
}
.thumbnail-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.preview-link {
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 6px;
}
.error {
  color: #d32f2f;
  padding: 0.75rem;
  background: #ffebee;
  border-radius: 6px;
  margin-bottom: 1rem;
}
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}
.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.btn-primary {
  background: var(--color-primary, #1976d2);
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background: #1565c0;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-outline {
  background: #fff;
  color: #333;
  border-color: #ddd;
}
.btn-outline:hover {
  border-color: #999;
}
.btn-warning {
  background: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}
.btn-warning:hover {
  background: #ffe69c;
  border-color: #ffb300;
}
.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}
</style>
