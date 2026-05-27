<template>
  <div class="category-form-page">
    <div class="page-top">
      <RouterLink to="/admin/products" class="back-btn" title="Quay lại">
        <i class="fa-solid fa-arrow-left" />
      </RouterLink>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Sửa loại sản phẩm' : 'Thêm loại sản phẩm' }}</h1>
        <p class="page-breadcrumb">
          <RouterLink to="/admin/products">Quản lý sản phẩm</RouterLink>
          <i class="fa-solid fa-chevron-right" />
          <RouterLink to="/admin/products">Loại sản phẩm</RouterLink>
          <i class="fa-solid fa-chevron-right" />
          <span>{{ isEdit ? 'Sửa loại sản phẩm' : 'Thêm loại sản phẩm' }}</span>
        </p>
      </div>
    </div>

    <div v-if="loading" class="form-loading">Đang tải...</div>

    <form v-else class="form-card" @submit.prevent="save">
      <h2 class="section-heading">Thông tin loại sản phẩm</h2>

      <div class="field-grid field-grid--2">
        <div class="field">
          <label class="field-label">
            Tên loại sản phẩm <span class="required">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            class="field-input"
            placeholder="Nhập tên loại"
            required
          />
        </div>
        <div class="field">
          <label class="field-label">
            Slug <span class="required">*</span>
          </label>
          <input
            v-model="form.slug"
            type="text"
            class="field-input"
            placeholder="vd: phong-khach"
            :required="!isEdit"
            @input="slugTouched = true"
          />
          <p class="field-hint">
            Slug là đường dẫn ngắn gọn, chỉ chứa chữ thường, số và dấu gạch ngang.
          </p>
        </div>
      </div>

      <div class="field">
        <label class="field-label">Mô tả</label>
        <div class="field-counter-wrap">
          <textarea
            v-model="form.description"
            rows="3"
            class="field-input field-textarea"
            placeholder="Mô tả ngắn về loại sản phẩm..."
            :maxlength="DESC_MAX"
          />
          <span class="field-counter">{{ descriptionCount }}/{{ DESC_MAX }}</span>
        </div>
      </div>

      <div class="field-grid field-grid--2 field-grid--visibility">
        <div class="visibility-block">
          <div class="visibility-copy">
            <label class="field-label">
              Hiển thị <span class="required">*</span>
            </label>
            <p class="field-hint">Bật để loại sản phẩm được hiển thị trên website.</p>
          </div>
          <label class="toggle" :title="form.isActive ? 'Đang hiển thị' : 'Đang ẩn'">
            <input v-model="form.isActive" type="checkbox" class="toggle-input" />
            <span class="toggle-track" />
          </label>
        </div>

        <div class="field">
          <label class="field-label">
            Thứ tự hiển thị <span class="required">*</span>
          </label>
          <div class="order-stepper">
            <input
              v-model.number="form.orderIndex"
              type="number"
              min="0"
              class="order-input"
              required
            />
            <div class="order-arrows">
              <button type="button" class="order-arrow" @click="bumpOrder(-1)">
                <i class="fa-solid fa-chevron-up" />
              </button>
              <button type="button" class="order-arrow" @click="bumpOrder(1)">
                <i class="fa-solid fa-chevron-down" />
              </button>
            </div>
          </div>
          <p class="field-hint">
            Thứ tự càng nhỏ, loại sản phẩm càng hiển thị ở vị trí cao hơn.
          </p>
        </div>
      </div>

      <div class="field-grid field-grid--2">
        <div class="field">
          <label class="field-label">SEO title</label>
          <div class="field-counter-wrap">
            <input
              v-model="form.seoTitle"
              type="text"
              class="field-input field-input--counter"
              placeholder="Tiêu đề SEO"
              :maxlength="SEO_TITLE_MAX"
            />
            <span class="field-counter field-counter--input">
              {{ seoTitleCount }}/{{ SEO_TITLE_MAX }}
            </span>
          </div>
          <p class="field-hint">Tiêu đề trang xuất hiện trên kết quả tìm kiếm Google.</p>
        </div>
        <div class="field">
          <label class="field-label">SEO description</label>
          <div class="field-counter-wrap">
            <textarea
              v-model="form.seoDescription"
              rows="2"
              class="field-input field-textarea field-input--counter"
              placeholder="Mô tả SEO"
              :maxlength="SEO_DESC_MAX"
            />
            <span class="field-counter">{{ seoDescCount }}/{{ SEO_DESC_MAX }}</span>
          </div>
          <p class="field-hint">Mô tả trang xuất hiện trên kết quả tìm kiếm Google.</p>
        </div>
      </div>

      <ImageUploadField v-model="form.thumbnail" :show-preview="true" />

      <div class="form-footer">
        <RouterLink to="/admin/products" class="btn-cancel">Hủy</RouterLink>
        <button
          v-if="form.slug && form.name"
          type="button"
          class="btn-preview"
          @click="handlePreview"
        >
          Xem trước
        </button>
        <button type="submit" class="btn-save" :disabled="saving">
          {{ saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo loại sản phẩm' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { categoryApi } from '@/services/api/categories'
import { slugify } from '@/utils/slugify'
import { savePreviewData } from '@/utils/preview'
import ImageUploadField from '@/components/admin/ImageUploadField.vue'
import { useAdminFormDraft } from '@/composables/useAdminFormDraft'

const DESC_MAX = 200
const SEO_TITLE_MAX = 60
const SEO_DESC_MAX = 160

const route = useRoute()
const router = useRouter()

const categoryId = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value || value === 'new') return null
  const id = Number(value)
  return Number.isFinite(id) ? id : null
})

const isEdit = computed(() => categoryId.value !== null)

const loading = ref(false)
const saving = ref(false)
const slugTouched = ref(false)

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

type CategoryFormDraft = {
  form: typeof form
  slugTouched: boolean
}

const { saveDraft, restoreDraft, clearDraft } = useAdminFormDraft()

const descriptionCount = computed(() => form.description.length)
const seoTitleCount = computed(() => form.seoTitle.length)
const seoDescCount = computed(() => form.seoDescription.length)

function bumpOrder(delta: number) {
  const next = (form.orderIndex ?? 0) + delta
  form.orderIndex = Math.max(0, next)
}

function applyFormDraft(draft: CategoryFormDraft) {
  Object.assign(form, draft.form)
  slugTouched.value = draft.slugTouched
}

function snapshotFormDraft(): CategoryFormDraft {
  return {
    form: { ...form },
    slugTouched: slugTouched.value,
  }
}

function applyCategoryToForm(c: Awaited<ReturnType<typeof categoryApi.getById>>) {
  form.name = c.name || ''
  form.slug = c.slug || ''
  form.description = c.description || ''
  form.thumbnail = c.thumbnail || ''
  form.orderIndex = c.orderIndex ?? 0
  form.isActive = c.isActive ?? true
  form.seoTitle = c.seoTitle || ''
  form.seoDescription = c.seoDescription || ''
}

async function loadCategory() {
  if (!isEdit.value || categoryId.value === null) return
  loading.value = true
  try {
    const c = await categoryApi.getById(categoryId.value)
    applyCategoryToForm(c)
    slugTouched.value = true
  } catch (e) {
    logger.error(e)
    alert('Không thể tải dữ liệu loại sản phẩm.')
    router.push('/admin/products')
  } finally {
    loading.value = false
  }
}

watch(
  () => form.name,
  (name) => {
    if (isEdit.value || slugTouched.value) return
    form.slug = slugify(name)
  },
)

watch(categoryId, () => {
  slugTouched.value = false
  if (isEdit.value) {
    loadCategory()
  } else {
    Object.assign(form, {
      name: '',
      slug: '',
      description: '',
      thumbnail: '',
      orderIndex: 0,
      isActive: true,
      seoTitle: '',
      seoDescription: '',
    })
  }
})

onMounted(() => {
  const draft = restoreDraft<CategoryFormDraft>()
  if (draft) {
    applyFormDraft(draft)
    return
  }
  if (isEdit.value) {
    loadCategory()
  }
})

function handlePreview() {
  if (!form.slug || !form.name) {
    alert('Vui lòng nhập đầy đủ tên và slug để xem trước.')
    return
  }

  const previewCategory = {
    id: categoryId.value ?? 999999,
    name: form.name,
    slug: form.slug,
    description: form.description || '',
    thumbnail: form.thumbnail || '',
    orderIndex: form.orderIndex || 0,
    isActive: form.isActive,
    seoTitle: form.seoTitle || '',
    seoDescription: form.seoDescription || '',
  }

  savePreviewData('category', form.slug, previewCategory)
  saveDraft(snapshotFormDraft())
  router.push(`/san-pham/${form.slug}/preview`)
}

function buildPayload() {
  const trimmedSlug = form.slug?.trim()
  return {
    name: form.name.trim(),
    slug: trimmedSlug ? slugify(trimmedSlug) : slugify(form.name),
    description: form.description?.trim().slice(0, DESC_MAX) || undefined,
    thumbnail: form.thumbnail?.trim() || undefined,
    orderIndex: Math.max(0, form.orderIndex ?? 0),
    isActive: form.isActive,
    seoTitle: form.seoTitle?.trim().slice(0, SEO_TITLE_MAX) || undefined,
    seoDescription: form.seoDescription?.trim().slice(0, SEO_DESC_MAX) || undefined,
  }
}

async function save() {
  saving.value = true
  try {
    const payload = buildPayload()
    if (isEdit.value && categoryId.value !== null) {
      await categoryApi.update(categoryId.value, payload)
    } else {
      await categoryApi.create(payload)
    }
    clearDraft()
    router.push('/admin/products')
  } catch (e) {
    logger.error(e)
    alert('Lưu thất bại.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.category-form-page {
  max-width: 960px;
  margin: 0 auto;
}

.page-top {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.back-btn {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  color: #6b7280;
  box-shadow: var(--shadow-sm);
  transition: color 0.15s, border-color 0.15s;
  text-decoration: none;
}

.back-btn:hover {
  color: #111827;
  border-color: #d1d5db;
}

.page-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: #030712;
  line-height: 1.3;
}

.page-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.125rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #9ca3af;
}

.page-breadcrumb a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.15s;
}

.page-breadcrumb a:hover {
  color: var(--color-primary);
}

.page-breadcrumb i {
  font-size: 0.5rem;
}

.page-breadcrumb span {
  color: #6b7280;
}

.form-loading {
  padding: 3rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.form-card {
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  font-size: 0.75rem;
}

@media (min-width: 640px) {
  .form-card {
    padding: 2rem;
  }
}

.section-heading {
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f9fafb;
}

.field-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.field-grid--2 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .field-grid--2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.field-grid--visibility {
  align-items: stretch;
  background: rgba(249, 250, 251, 0.8);
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.visibility-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-right: 0;
}

@media (min-width: 768px) {
  .visibility-block {
    padding-right: 1rem;
    border-right: 1px solid #f3f4f6;
  }
}

.visibility-copy .field-hint {
  margin-top: 0.125rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-weight: 700;
  color: #374151;
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
  font-size: 0.75rem;
  font-weight: 500;
  color: #1f2937;
  transition: border-color 0.15s;
}

.field-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.field-textarea {
  resize: none;
  min-height: 4.5rem;
}

.field-hint {
  font-size: 0.625rem;
  font-weight: 400;
  color: #9ca3af;
  line-height: 1.4;
}

.field-counter-wrap {
  position: relative;
}

.field-counter {
  position: absolute;
  right: 0.75rem;
  bottom: 0.5rem;
  font-size: 0.625rem;
  color: #9ca3af;
  pointer-events: none;
}

.field-counter--input {
  top: 50%;
  bottom: auto;
  transform: translateY(-50%);
}

.field-input--counter {
  padding-right: 3.5rem;
}

.toggle {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  cursor: pointer;
}

.toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.toggle-track {
  width: 2.25rem;
  height: 1.25rem;
  background: #e5e7eb;
  border-radius: 9999px;
  transition: background 0.2s;
  position: relative;
}

.toggle-track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1rem;
  height: 1rem;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.toggle-input:checked + .toggle-track {
  background: #10b981;
}

.toggle-input:checked + .toggle-track::after {
  transform: translateX(1rem);
  border-color: #fff;
}

.order-stepper {
  display: flex;
  align-items: stretch;
  width: 6rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: #fff;
  overflow: hidden;
}

.order-input {
  flex: 1;
  min-width: 0;
  border: none;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1f2937;
  padding: 0.375rem 0.25rem;
  appearance: textfield;
  -moz-appearance: textfield;
}

.order-input::-webkit-outer-spin-button,
.order-input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

.order-input:focus {
  outline: none;
}

.order-arrows {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--color-border);
  background: #f9fafb;
  font-size: 0.5rem;
  color: #9ca3af;
}

.order-arrow {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.375rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
}

.order-arrow:first-child {
  border-bottom: 1px solid var(--color-border);
}

.order-arrow:hover {
  background: #f3f4f6;
}

.form-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid #f3f4f6;
}

.btn-cancel,
.btn-preview,
.btn-save {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.5rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: #fff;
  border: 1px solid var(--color-border);
  color: #374151;
  box-shadow: var(--shadow-sm);
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-preview {
  background: #fff;
  border: 1px solid var(--color-border);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.btn-preview:hover:not(:disabled) {
  background: #faf9f6;
  border-color: rgba(146, 64, 14, 0.25);
}

.btn-preview:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-save {
  background: var(--color-primary-dark);
  border: 1px solid var(--color-primary-dark);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.btn-save:hover:not(:disabled) {
  background: #492f1b;
  border-color: #492f1b;
}

.btn-save:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
