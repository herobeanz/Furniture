<template>
  <div class="blog-form-page">
    <div class="page-header">
      <div class="page-header-left">
        <div>
          <h1 class="page-title">{{ isEdit ? 'Sửa bài viết' : 'Thêm bài viết' }}</h1>
          <p class="page-breadcrumb">
            <RouterLink to="/admin/blog">Quản lý Blog</RouterLink>
            <i class="fa-solid fa-chevron-right" />
            <span>{{ isEdit ? 'Sửa bài viết' : 'Thêm bài viết' }}</span>
          </p>
        </div>
      </div>
      <div class="page-header-actions">
        <button
          type="button"
          class="btn btn-outline"
          :disabled="!form.slug?.trim() || !form.title?.trim()"
          @click="handlePreview"
        >
          <i class="fa-regular fa-eye" />
          Xem trước
        </button>
        <RouterLink to="/admin/blog" class="btn btn-outline">Hủy</RouterLink>
        <button type="button" class="btn btn-primary" :disabled="saving" @click="save">
          {{ saving ? 'Đang lưu...' : 'Lưu bài viết' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="form-loading">Đang tải...</div>

    <form v-else class="form-layout" @submit.prevent="save">
      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="form-grid">
        <div class="form-col form-col--main">
          <section class="form-card">
            <h2 class="section-heading">Thông tin bài viết</h2>

            <div class="field">
              <label class="field-label">
                Tiêu đề bài viết <span class="required">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                class="field-input"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>

            <div class="field">
              <label class="field-label">
                Slug (đường dẫn) <span class="required">*</span>
              </label>
              <input
                v-model="form.slug"
                type="text"
                class="field-input"
                placeholder="Nhập slug"
                :required="!isEdit"
                @input="slugTouched = true"
              />
              <p class="field-hint">Slug sẽ được tạo tự động từ tiêu đề. Có thể chỉnh sửa.</p>
            </div>

            <div class="field">
              <label class="field-label">
                Tóm tắt bài viết (Mô tả ngắn) <span class="required">*</span>
              </label>
              <div class="field-counter-wrap">
                <textarea
                  v-model="form.excerpt"
                  rows="3"
                  class="field-input field-textarea"
                  placeholder="Nhập tóm tắt bài viết (tối đa 200 ký tự)"
                  :maxlength="EXCERPT_MAX"
                  required
                />
                <span class="field-counter">{{ excerptCount }}/{{ EXCERPT_MAX }}</span>
              </div>
            </div>

            <div class="field">
              <label class="field-label">
                Nội dung bài viết <span class="required">*</span>
              </label>
              <RichTextEditor
                v-model="form.content"
                :height="480"
                placeholder="Nhập nội dung bài viết..."
              />
            </div>
          </section>
        </div>

        <div class="form-col form-col--side">
          <section class="form-card">
            <label class="field-label section-label">
              Ảnh đại diện <span class="required">*</span>
            </label>
            <p class="field-hint thumb-intro">
              Hiển thị trên thẻ bài viết (danh sách Blog), không chèn vào nội dung bài.
            </p>
            <div class="blog-card-image-wrap blog-card-image-wrap--form">
              <img
                v-if="form.thumbnail"
                :src="thumbnailPreview"
                alt="Ảnh đại diện bài viết"
                class="blog-card-image"
              />
              <div v-else class="blog-card-image-placeholder">
                <i class="fa-regular fa-image" />
                <span>Chưa có ảnh</span>
              </div>
              <button
                v-if="form.thumbnail"
                type="button"
                class="blog-thumb-remove"
                title="Xóa ảnh"
                @click="clearThumbnail"
              >
                <i class="fa-solid fa-xmark" />
              </button>
            </div>
            <ImageUploadField
              v-model="form.thumbnail"
              :show-preview="false"
              :show-inline-preview="false"
              hint="JPG, PNG, WEBP. Khuyến nghị 1200×630px. Tối đa 5MB."
            />
          </section>

          <section class="form-card">
            <label class="field-label section-label">
              Danh mục <span class="required">*</span>
            </label>
            <div class="select-wrap">
              <select
                v-model="form.category"
                class="field-input field-select"
                :class="{ 'field-select--placeholder': !form.category }"
                required
              >
                <option value="" disabled>Chọn danh mục</option>
                <option
                  v-for="cat in blogCategoryOptions"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.label }}
                </option>
              </select>
              <i class="fa-solid fa-chevron-down select-chevron" />
            </div>
          </section>

          <section class="form-card">
            <label class="field-label section-label">Trạng thái</label>

            <label
              class="status-option"
              :class="{ 'status-option--active': form.isActive }"
            >
              <span class="status-option-main">
                <input
                  v-model="form.isActive"
                  type="radio"
                  class="radio-input"
                  :value="true"
                />
                <span class="status-option-label">Hiển thị</span>
              </span>
              <span class="status-badge status-badge--on">Công khai trên website</span>
            </label>

            <label
              class="status-option"
              :class="{ 'status-option--active': !form.isActive }"
            >
              <span class="status-option-main">
                <input
                  v-model="form.isActive"
                  type="radio"
                  class="radio-input"
                  :value="false"
                />
                <span class="status-option-label status-option-label--muted">Ẩn</span>
              </span>
              <span class="status-badge status-badge--muted">Không công khai</span>
            </label>
          </section>

          <section class="form-card">
            <label class="field-label section-label">Nổi bật</label>
            <label class="featured-check">
              <input
                v-model="form.isFeatured"
                type="checkbox"
                class="checkbox-input"
              />
              <span>Đánh dấu là bài viết nổi bật</span>
            </label>
            <p class="field-hint featured-hint">
              Bài viết nổi bật sẽ được hiển thị ở vị trí ưu tiên trên trang Blog.
            </p>
          </section>

          <section class="form-card">
            <label class="field-label section-label">
              Tác giả <span class="required">*</span>
            </label>
            <input
              v-model="form.author"
              type="text"
              class="field-input"
              placeholder="Nhập tên tác giả"
              required
            />
          </section>

          <section class="form-card">
            <label class="field-label section-label">Thời gian</label>
            <div class="field">
              <label class="field-sublabel">
                Ngày đăng <span class="required">*</span>
              </label>
              <input
                v-model="form.publishedAt"
                type="datetime-local"
                class="field-input"
                required
              />
              <p
                v-if="form.publishedAt && new Date(form.publishedAt) > new Date()"
                class="field-hint field-hint--warn"
              >
                Bài viết sẽ không hiển thị trên website cho đến khi đến ngày đăng.
              </p>
            </div>
          </section>

          <section class="form-card">
            <h3 class="section-heading section-heading--seo">SEO (Tùy chọn)</h3>

            <div class="field">
              <label class="field-label">Meta title</label>
              <div class="field-counter-wrap">
                <input
                  v-model="form.seoTitle"
                  type="text"
                  class="field-input field-input--counter"
                  placeholder="Nhập meta title (tối đa 60 ký tự)"
                  :maxlength="SEO_TITLE_MAX"
                />
                <span class="field-counter field-counter--input">
                  {{ seoTitleCount }}/{{ SEO_TITLE_MAX }}
                </span>
              </div>
            </div>

            <div class="field">
              <label class="field-label">Meta description</label>
              <div class="field-counter-wrap">
                <textarea
                  v-model="form.seoDescription"
                  rows="3"
                  class="field-input field-textarea"
                  placeholder="Nhập meta description (tối đa 160 ký tự)"
                  :maxlength="SEO_DESC_MAX"
                />
                <span class="field-counter">{{ seoDescCount }}/{{ SEO_DESC_MAX }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div class="form-footer">
        <RouterLink to="/admin/blog" class="btn btn-outline">Hủy</RouterLink>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu bài viết' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { blogApi, type BlogPost } from '@/services/api/blog'
import { savePreviewData } from '@/utils/preview'
import { slugify } from '@/utils/slugify'
import { resolveMediaUrl } from '@/utils/mediaUrl'
import { BLOG_FILTER_TABS } from '@/constants/blog'
import ImageUploadField from '@/components/admin/ImageUploadField.vue'
import RichTextEditor from '@/components/admin/RichTextEditor.vue'
import { isRichTextEmpty } from '@/utils/richText'
import { useAdminFormDraft } from '@/composables/useAdminFormDraft'

const EXCERPT_MAX = 200
const SEO_TITLE_MAX = 60
const SEO_DESC_MAX = 160

const blogCategoryOptions = BLOG_FILTER_TABS.filter((tab) => tab.id)

const route = useRoute()
const router = useRouter()

const postId = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value || value === 'new') return null
  const id = Number(value)
  return Number.isFinite(id) ? id : null
})

const isEdit = computed(() => postId.value !== null)

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  category: '',
  author: 'Admin',
  seoTitle: '',
  seoDescription: '',
  isActive: true,
  isFeatured: false,
  publishedAt: '',
})

const slugTouched = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

type BlogFormDraft = {
  form: typeof form
  slugTouched: boolean
}

const { saveDraft, restoreDraft, clearDraft } = useAdminFormDraft()

const excerptCount = computed(() => form.excerpt.length)
const seoTitleCount = computed(() => form.seoTitle.length)
const seoDescCount = computed(() => form.seoDescription.length)
const thumbnailPreview = computed(() => resolveMediaUrl(form.thumbnail))

function clearThumbnail() {
  form.thumbnail = ''
}

function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function formatDateTime(dateString?: string): string {
  if (!dateString) return ''
  return formatDateTimeLocal(new Date(dateString))
}

function applyFormDraft(draft: BlogFormDraft) {
  Object.assign(form, draft.form)
  slugTouched.value = draft.slugTouched
}

function snapshotFormDraft(): BlogFormDraft {
  return {
    form: { ...form },
    slugTouched: slugTouched.value,
  }
}

function applyPostToForm(post: BlogPost) {
  form.title = post.title || ''
  form.slug = post.slug || ''
  form.excerpt = post.excerpt || ''
  form.content = post.content || ''
  form.thumbnail = post.thumbnail || ''
  form.category = post.category || ''
  form.author = post.author || 'Admin'
  form.seoTitle = post.seoTitle || ''
  form.seoDescription = post.seoDescription || ''
  form.isActive = post.isActive ?? true
  form.isFeatured = post.isFeatured ?? false
  form.publishedAt = post.publishedAt ? formatDateTime(post.publishedAt) : formatDateTimeLocal(new Date())
}

function resetForm() {
  Object.assign(form, {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    category: '',
    author: 'Admin',
    seoTitle: '',
    seoDescription: '',
    isActive: true,
    isFeatured: false,
    publishedAt: formatDateTimeLocal(new Date()),
  })
  slugTouched.value = false
  error.value = ''
}

async function loadPost() {
  if (!isEdit.value || postId.value === null) return
  loading.value = true
  error.value = ''
  try {
    const post = await blogApi.getAdminPost(postId.value)
    applyPostToForm(post)
    slugTouched.value = true
  } catch (e: unknown) {
    error.value = 'Không thể tải bài viết.'
    logger.error('Failed to load blog post:', e)
    router.push('/admin/blog')
  } finally {
    loading.value = false
  }
}

watch(
  () => form.title,
  (title) => {
    if (isEdit.value || slugTouched.value) return
    form.slug = slugify(title)
  },
)

watch(postId, () => {
  slugTouched.value = false
  if (isEdit.value) {
    loadPost()
  } else {
    resetForm()
  }
})

onMounted(() => {
  const draft = restoreDraft<BlogFormDraft>()
  if (draft) {
    applyFormDraft(draft)
    return
  }
  if (isEdit.value) {
    loadPost()
  } else {
    resetForm()
  }
})

function validateForm(): string | null {
  if (!form.title.trim()) return 'Vui lòng nhập tiêu đề bài viết.'
  if (!form.slug.trim() && !form.title.trim()) return 'Vui lòng nhập slug.'
  if (!form.excerpt.trim()) return 'Vui lòng nhập tóm tắt bài viết.'
  if (!form.thumbnail.trim()) return 'Vui lòng tải ảnh đại diện.'
  if (isRichTextEmpty(form.content)) return 'Vui lòng nhập nội dung bài viết.'
  if (!form.category.trim()) return 'Vui lòng chọn danh mục.'
  if (!form.author.trim()) return 'Vui lòng nhập tác giả.'
  if (!form.publishedAt) return 'Vui lòng chọn ngày đăng.'
  return null
}

function buildPayload(): Partial<BlogPost> {
  const trimmedSlug = form.slug.trim()
  return {
    title: form.title.trim(),
    slug: trimmedSlug ? slugify(trimmedSlug) : slugify(form.title),
    excerpt: form.excerpt.trim().slice(0, EXCERPT_MAX),
    content: form.content.trim(),
    thumbnail: form.thumbnail.trim() || undefined,
    category: form.category.trim(),
    author: form.author.trim(),
    seoTitle: form.seoTitle.trim().slice(0, SEO_TITLE_MAX) || undefined,
    seoDescription: form.seoDescription.trim().slice(0, SEO_DESC_MAX) || undefined,
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    publishedAt: new Date(form.publishedAt).toISOString(),
  }
}

function handlePreview() {
  if (!form.slug?.trim() || !form.title?.trim()) {
    alert('Vui lòng nhập tiêu đề và slug để xem trước.')
    return
  }

  const slug = slugify(form.slug.trim() || form.title)
  if (!slug) {
    alert('Slug không hợp lệ. Vui lòng nhập tiêu đề hoặc slug hợp lệ (chữ, số, gạch ngang).')
    return
  }

  const previewPost: BlogPost = {
    id: postId.value ?? 999999,
    title: form.title.trim(),
    slug,
    excerpt: form.excerpt.trim().slice(0, EXCERPT_MAX),
    content: form.content.trim(),
    thumbnail: form.thumbnail.trim() || '',
    category: form.category.trim(),
    author: form.author.trim(),
    seoTitle: form.seoTitle.trim() || '',
    seoDescription: form.seoDescription.trim() || '',
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  savePreviewData('blog', slug, previewPost)
  saveDraft(snapshotFormDraft())
  router.push(`/blog/${slug}/preview`)
}

async function save() {
  const validationError = validateForm()
  if (validationError) {
    alert(validationError)
    return
  }

  saving.value = true
  error.value = ''
  try {
    const payload = buildPayload()
    if (isEdit.value && postId.value !== null) {
      await blogApi.updatePost(postId.value, payload)
    } else {
      await blogApi.createPost(payload)
    }
    clearDraft()
    router.push('/admin/blog')
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string }
    error.value = err?.response?.data?.message || err?.message || 'Lưu thất bại.'
    logger.error('Failed to save blog post:', e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.blog-form-page {
  font-size: var(--fs-body-sm);
  color: #1f2937;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.page-title {
  margin: 0;
  font-family: var(--font-serif, Georgia, serif);
  font-size: var(--fs-card-title);
  font-weight: 700;
  color: #030712;
}

.page-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  margin: 0.25rem 0 0;
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: #9ca3af;
}

.page-breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.page-breadcrumb a:hover {
  color: var(--color-primary);
}

.page-breadcrumb span:last-child {
  color: #6b7280;
}

.page-breadcrumb i {
  font-size: var(--fs-caption);
}

.page-header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-self: flex-end;
}

@media (min-width: 640px) {
  .page-header-actions {
    align-self: center;
  }
}

.form-loading {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.form-error {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.25rem;
  color: #b91c1c;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .form-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.form-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-card {
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
}

.section-heading {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 0.5rem;
  margin: 0 0 1.25rem;
  border-bottom: 1px solid #f9fafb;
}

.section-heading--seo {
  margin-bottom: 1rem;
}

.section-label {
  display: block;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-grid {
  display: grid;
  gap: 1rem;
}

.field-grid--2 {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .field-grid--2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.thumb-intro {
  margin-bottom: 0.75rem;
}

.blog-card-image-wrap--form {
  position: relative;
  height: 12rem;
  margin-bottom: 0.75rem;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-light);
  background: var(--color-border-light);
}

.blog-card-image-wrap--form .blog-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.blog-card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  color: #d1d5db;
  font-size: var(--fs-body-sm);
  font-weight: 600;
}

.blog-card-image-placeholder i {
  font-size: var(--fs-section-title);
}

.blog-thumb-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-body-sm);
}

.blog-thumb-remove:hover {
  background: rgba(0, 0, 0, 0.75);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field-label {
  font-weight: 700;
  color: #374151;
}

.field-sublabel {
  font-weight: 600;
  color: #6b7280;
  font-size: var(--fs-body-sm);
}

.required {
  color: #ef4444;
}

.field-input {
  width: 100%;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: #1f2937;
}

.field-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.field-textarea {
  resize: vertical;
  min-height: 4rem;
}

.field-hint {
  font-size: var(--fs-caption);
  color: #9ca3af;
  line-height: 1.4;
  margin: 0;
}

.field-hint--warn {
  color: #b45309;
  font-weight: 600;
}

.field-counter-wrap {
  position: relative;
}

.field-counter {
  position: absolute;
  right: 0.75rem;
  bottom: 0.5rem;
  font-size: var(--fs-caption);
  color: #9ca3af;
  pointer-events: none;
}

.field-counter--input {
  top: 50%;
  bottom: auto;
  transform: translateY(-50%);
}

.field-input--counter {
  padding-right: 3.25rem;
}

.select-wrap {
  position: relative;
}

.field-select {
  appearance: none;
  padding-right: 2rem;
  cursor: pointer;
}

.field-select--placeholder {
  color: #9ca3af;
}

.select-chevron {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--fs-caption);
  color: #9ca3af;
  pointer-events: none;
}

.editor-shell {
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  overflow: hidden;
}

.editor-body--content {
  background: #fff;
  padding: 0.75rem;
  min-height: 10rem;
}

.editor-textarea {
  border: none;
  padding: 0;
  min-height: 9rem;
  resize: vertical;
}

.editor-textarea:focus {
  box-shadow: none;
}

.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: var(--fs-caption);
  color: #9ca3af;
}

.status-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.status-option:last-child {
  margin-bottom: 0;
}

.status-option--active {
  background: rgba(249, 250, 251, 0.8);
  border-color: #d1d5db;
}

.status-option-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-option-label {
  font-weight: 700;
  color: #1f2937;
}

.status-option-label--muted {
  color: #6b7280;
}

.radio-input {
  width: 0.875rem;
  height: 0.875rem;
  accent-color: var(--color-primary);
}

.status-badge {
  font-size: var(--fs-caption);
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 0.125rem;
  white-space: nowrap;
}

.status-badge--on {
  background: #ecfdf5;
  color: #047857;
}

.status-badge--muted {
  background: #f3f4f6;
  color: #6b7280;
}

.featured-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  padding-top: 0.25rem;
}

.checkbox-input {
  width: 0.875rem;
  height: 0.875rem;
  accent-color: var(--color-primary);
  border-radius: 0.125rem;
}

.featured-hint {
  margin-top: 0.5rem;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 700;
  font-size: var(--fs-body-sm);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-outline {
  background: #fff;
  border-color: var(--color-border);
  color: #374151;
  box-shadow: var(--shadow-sm);
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-primary {
  background: #5c3c24;
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background: #492f1b;
}
</style>
