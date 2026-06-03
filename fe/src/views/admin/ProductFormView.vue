<template>
  <div class="product-form-page">
    <div class="page-header">
      <div class="page-header-left">
        <RouterLink to="/admin/products/list" class="back-btn" title="Quay lại">
          <i class="fa-solid fa-arrow-left" />
        </RouterLink>
        <div>
          <h1 class="page-title">{{ isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm' }}</h1>
          <p class="page-breadcrumb">
            <RouterLink to="/admin/products/list">Sản phẩm</RouterLink>
            <i class="fa-solid fa-chevron-right" />
            <span>{{ isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm' }}</span>
          </p>
        </div>
      </div>
      <div class="page-header-actions">
        <button
          type="button"
          class="btn btn-outline"
          :disabled="!canPreview"
          @click="handlePreview"
        >
          <i class="fa-regular fa-eye" />
          Xem trước
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="saving"
          @click="onSubmit"
        >
          {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="form-loading">Đang tải...</div>

    <form v-else class="form-layout" @submit.prevent="onSubmit">
      <div class="form-grid">
        <div class="form-col form-col--main">
          <section class="form-card">
            <h2 class="section-heading">Thông tin sản phẩm</h2>

            <div class="field">
              <label class="field-label">
                Tên sản phẩm <span class="required">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                class="field-input"
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            <div class="field-grid field-grid--2">
              <div class="field">
                <label class="field-label">
                  SKU (Mã sản phẩm) <span class="required">*</span>
                </label>
                <input
                  v-model="form.sku"
                  type="text"
                  class="field-input"
                  placeholder="VD: SFA-SSN-001"
                  required
                />
                <p class="field-hint">Ví dụ: SFA-SSN-001</p>
              </div>
              <div class="field">
                <label class="field-label">
                  Loại sản phẩm <span class="required">*</span>
                </label>
                <div class="select-wrap">
                  <select v-model.number="form.categoryId" class="field-input field-select" required>
                    <option :value="0" disabled>Chọn loại sản phẩm</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">
                      {{ c.name }}
                    </option>
                  </select>
                  <i class="fa-solid fa-chevron-down select-icon" />
                </div>
              </div>
            </div>

            <div class="field-grid field-grid--3">
              <div class="field">
                <label class="field-label">
                  Giá bán (đ) <span class="required">*</span>
                </label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="1000"
                  class="field-input field-input--bold"
                  :disabled="form.isContactPrice"
                  required
                />
              </div>
              <div class="field">
                <label class="field-label">Giá khuyến mãi (đ)</label>
                <input
                  v-model.number="form.salePrice"
                  type="number"
                  min="0"
                  step="1000"
                  class="field-input field-input--bold"
                  :disabled="form.isContactPrice"
                />
              </div>
              <div class="field field--contact">
                <label class="contact-check">
                  <input v-model="form.isContactPrice" type="checkbox" class="check-input" />
                  <span>Hiển thị giá liên hệ</span>
                </label>
                <i
                  class="fa-solid fa-circle-info contact-info"
                  title="Nếu tích, hệ thống sẽ ẩn giá số và hiển thị chữ 'Liên hệ'"
                />
              </div>
            </div>

            <div class="field-grid field-grid--2">
              <div class="field">
                <label class="field-label">
                  Màu sắc <span class="required">*</span>
                </label>
                <input
                  v-model="form.color"
                  type="text"
                  class="field-input"
                  placeholder="VD: Nâu óc chó"
                  required
                />
              </div>
              <div class="field">
                <label class="field-label">
                  Chất liệu <span class="required">*</span>
                </label>
                <input
                  v-model="form.material"
                  type="text"
                  class="field-input"
                  placeholder="VD: Gỗ sồi Nga tự nhiên 100%"
                  required
                />
              </div>
            </div>

            <div class="field-grid field-grid--3">
              <div class="field">
                <label class="field-label">
                  Kích thước (Dài x Rộng x Cao) <span class="required">*</span>
                </label>
                <input
                  v-model="form.dimensions"
                  type="text"
                  class="field-input"
                  placeholder="VD: 240 x 80 x 85 cm"
                  required
                />
              </div>
              <div class="field">
                <label class="field-label">
                  Bảo hành <span class="required">*</span>
                </label>
                <input
                  v-model="form.warranty"
                  type="text"
                  class="field-input"
                  placeholder="VD: 24 tháng"
                  required
                />
              </div>
              <div class="field">
                <label class="field-label">
                  Trạng thái <span class="required">*</span>
                </label>
                <label class="radio-label">
                  <input v-model="form.isActive" type="radio" :value="true" class="radio-input" />
                  <span>Hiển thị</span>
                </label>
                <label class="radio-label radio-label--muted">
                  <input v-model="form.isActive" type="radio" :value="false" class="radio-input" />
                  <span>Ẩn</span>
                </label>
              </div>
            </div>

            <div class="field">
              <label class="featured-check">
                <input v-model="form.isFeatured" type="checkbox" class="check-input" />
                <span>Hiển thị sản phẩm này ở mục nổi bật trên trang chủ</span>
              </label>
            </div>

            <div class="field">
              <label class="field-label">
                Mô tả ngắn <span class="required">*</span>
              </label>
              <div class="field-counter-wrap">
                <textarea
                  v-model="form.shortDescription"
                  rows="3"
                  class="field-input field-textarea"
                  placeholder="Mô tả ngắn hiển thị trên danh sách sản phẩm..."
                  :maxlength="SHORT_DESC_MAX"
                  required
                />
                <span class="field-counter">{{ shortDescCount }}/{{ SHORT_DESC_MAX }}</span>
              </div>
            </div>
          </section>

          <section class="form-card">
            <label class="field-label section-label">
              Mô tả chi tiết <span class="required">*</span>
            </label>
            <RichTextEditor
              v-model="form.description"
              :height="500"
              placeholder="Mô tả chi tiết sản phẩm..."
            />
          </section>
        </div>

        <div class="form-col form-col--side">
          <section class="form-card">
            <label class="field-label section-label">
              Ảnh đại diện <span class="required">*</span>
            </label>
            <ImageUploadField v-model="form.thumbnail" variant="hero" :show-preview="false" />
          </section>

          <section class="form-card">
            <label class="field-label section-label">
              Ảnh chi tiết
              <span class="label-muted">(Tối đa {{ GALLERY_MAX }} ảnh)</span>
            </label>
            <ImageGalleryUploadField
              v-model="productImageUrls"
              layout="product"
              :max-images="GALLERY_MAX"
              hint="JPG, PNG, WEBP, GIF — tối đa 5MB/ảnh. Có thể chọn hoặc kéo thả nhiều ảnh một lần."
            />
          </section>

          <section class="form-card">
            <h3 class="section-heading section-heading--sm">SEO</h3>
            <div class="field">
              <label class="field-label">SEO title</label>
              <div class="field-counter-wrap">
                <input
                  v-model="form.seoTitle"
                  type="text"
                  class="field-input field-input--counter"
                  placeholder="Tiêu đề hiển thị trên Google"
                  :maxlength="SEO_TITLE_MAX"
                />
                <span class="field-counter field-counter--input">{{ seoTitleCount }}/{{ SEO_TITLE_MAX }}</span>
              </div>
            </div>
            <div class="field">
              <label class="field-label">SEO description</label>
              <div class="field-counter-wrap">
                <textarea
                  v-model="form.seoDescription"
                  rows="3"
                  class="field-input field-textarea"
                  placeholder="Mô tả trang xuất hiện trên kết quả tìm kiếm Google"
                  :maxlength="SEO_DESC_MAX"
                />
                <span class="field-counter">{{ seoDescCount }}/{{ SEO_DESC_MAX }}</span>
              </div>
              <p class="field-hint">Mô tả trang xuất hiện trên kết quả tìm kiếm Google.</p>
            </div>
          </section>
        </div>
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="form-footer">
        <RouterLink to="/admin/products/list" class="btn btn-outline">Hủy</RouterLink>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
import { slugify } from '@/utils/slugify'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { productApi } from '@/services/api/products'
import { categoryApi } from '@/services/api/categories'
import { savePreviewData } from '@/utils/preview'
import ImageUploadField from '@/components/admin/ImageUploadField.vue'
import ImageGalleryUploadField from '@/components/admin/ImageGalleryUploadField.vue'
import RichTextEditor from '@/components/admin/RichTextEditor.vue'
import { isRichTextEmpty } from '@/utils/richText'
import {
  buildProductGalleryList,
  extractGalleryOnlyUrls,
} from '@/utils/productGallery'
import { useAdminFormDraft } from '@/composables/useAdminFormDraft'

const SHORT_DESC_MAX = 200
const SEO_TITLE_MAX = 60
const SEO_DESC_MAX = 160
const GALLERY_MAX = 10

const route = useRoute()
const router = useRouter()

const productId = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value || value === 'new') return null
  const id = Number(value)
  return Number.isFinite(id) ? id : null
})

const isEdit = computed(() => productId.value !== null)

const loading = ref(false)
const categories = ref<{ id: number; name: string; slug: string }[]>([])

const form = reactive({
  categoryId: 0,
  name: '',
  sku: '',
  slug: '',
  shortDescription: '',
  description: '',
  price: 0,
  salePrice: undefined as number | undefined,
  thumbnail: '',
  status: 'available' as 'available' | 'hidden' | 'discontinued',
  material: '',
  dimensions: '',
  color: '',
  warranty: '',
  isActive: true,
  isFeatured: false,
  isContactPrice: false,
  seoTitle: '',
  seoDescription: '',
})

const productImageUrls = ref<string[]>([])
const saving = ref(false)
const error = ref('')

type ProductFormDraft = {
  form: typeof form
  productImageUrls: string[]
}

const { saveDraft, restoreDraft, clearDraft } = useAdminFormDraft()

const shortDescCount = computed(() => form.shortDescription.length)
const seoTitleCount = computed(() => form.seoTitle.length)
const seoDescCount = computed(() => form.seoDescription.length)

const previewSlug = computed(() => {
  const trimmed = form.slug?.trim()
  if (trimmed) return slugify(trimmed)
  if (form.name.trim()) return slugify(form.name)
  return ''
})

const previewCategorySlug = computed(() => {
  const cat = categories.value.find((c) => c.id === form.categoryId)
  return cat?.slug?.trim() || ''
})

const canPreview = computed(
  () =>
    !!previewSlug.value &&
    !!form.name.trim() &&
    !!form.categoryId &&
    !!previewCategorySlug.value,
)

function resolveStatus(): typeof form.status {
  if (form.status === 'discontinued') return 'discontinued'
  return form.isActive ? 'available' : 'hidden'
}

const formPayload = computed(() => {
  const imageUrls = productImageUrls.value.filter(Boolean).slice(0, GALLERY_MAX)

  const images = imageUrls.map((url, index) => ({
    imageUrl: url,
    isPrimary: index === 0,
    altText: form.name,
    orderIndex: index,
  }))

  const normalizedSalePrice =
    form.salePrice === undefined || form.salePrice === null || form.salePrice === 0
      ? null
      : form.salePrice

  return {
    categoryId: form.categoryId,
    name: form.name.trim(),
    sku: form.sku.trim(),
    slug: (() => {
      const trimmed = form.slug?.trim()
      if (trimmed) return slugify(trimmed)
      if (!isEdit.value && form.name.trim()) return slugify(form.name)
      return undefined
    })(),
    shortDescription: form.shortDescription.trim() || undefined,
    description: form.description.trim() || undefined,
    price: form.isContactPrice ? 0 : form.price,
    salePrice: form.isContactPrice ? null : normalizedSalePrice,
    thumbnail: form.thumbnail || undefined,
    status: resolveStatus(),
    material: form.material.trim() || undefined,
    dimensions: form.dimensions.trim() || undefined,
    color: form.color.trim() || undefined,
    warranty: form.warranty.trim() || undefined,
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    isContactPrice: form.isContactPrice,
    seoTitle: form.seoTitle.trim().slice(0, SEO_TITLE_MAX) || undefined,
    seoDescription: form.seoDescription.trim().slice(0, SEO_DESC_MAX) || undefined,
    images,
  }
})

function validateForm(): string | null {
  if (!form.categoryId) return 'Vui lòng chọn loại sản phẩm.'
  if (!form.name.trim()) return 'Vui lòng nhập tên sản phẩm.'
  if (!form.sku.trim()) return 'Vui lòng nhập SKU.'
  if (!form.isContactPrice && (!form.price || form.price <= 0)) {
    return 'Vui lòng nhập giá bán.'
  }
  if (!form.color.trim()) return 'Vui lòng nhập màu sắc.'
  if (!form.material.trim()) return 'Vui lòng nhập chất liệu.'
  if (!form.dimensions.trim()) return 'Vui lòng nhập kích thước.'
  if (!form.warranty.trim()) return 'Vui lòng nhập bảo hành.'
  if (!form.shortDescription.trim()) return 'Vui lòng nhập mô tả ngắn.'
  if (isRichTextEmpty(form.description)) return 'Vui lòng nhập mô tả chi tiết.'
  if (!form.thumbnail.trim()) return 'Vui lòng tải ảnh đại diện.'
  if (productImageUrls.value.length > GALLERY_MAX) {
    return `Tối đa ${GALLERY_MAX} ảnh chi tiết.`
  }
  return null
}

async function fetchCategories() {
  try {
    categories.value = await categoryApi.listAdmin()
  } catch (e) {
    logger.error(e)
  }
}

function applyFormDraft(draft: ProductFormDraft) {
  Object.assign(form, draft.form)
  productImageUrls.value = [...draft.productImageUrls]
}

function snapshotFormDraft(): ProductFormDraft {
  return {
    form: { ...form },
    productImageUrls: [...productImageUrls.value],
  }
}

function applyProductToForm(product: Awaited<ReturnType<typeof productApi.getById>>) {
  form.categoryId = product.categoryId || 0
  form.name = product.name || ''
  form.sku = product.sku || ''
  form.slug = product.slug || ''
  form.shortDescription = product.shortDescription || ''
  form.description = product.description || ''
  form.price = product.price || 0
  form.salePrice = product.salePrice
  form.thumbnail = product.thumbnail || ''
  form.status = (product.status as typeof form.status) || 'available'
  form.material = product.material || ''
  form.dimensions = product.dimensions || ''
  form.color = product.color || ''
  form.warranty = product.warranty || ''
  form.isActive = product.isActive ?? true
  form.isFeatured = product.isFeatured ?? false
  form.isContactPrice = product.isContactPrice ?? false
  form.seoTitle = product.seoTitle || ''
  form.seoDescription = product.seoDescription || ''
  productImageUrls.value = extractGalleryOnlyUrls(
    product.thumbnail,
    product.images ?? [],
  ).slice(0, GALLERY_MAX)
}

async function loadProduct() {
  if (!isEdit.value || productId.value === null) return
  loading.value = true
  try {
    const product = await productApi.getById(productId.value)
    applyProductToForm(product)
  } catch (e) {
    logger.error(e)
    alert('Không thể tải dữ liệu sản phẩm.')
    router.push('/admin/products/list')
  } finally {
    loading.value = false
  }
}

watch(
  () => form.name,
  (name) => {
    if (isEdit.value) return
    form.slug = slugify(name)
  },
)

watch(productId, () => {
  if (isEdit.value) {
    loadProduct()
  }
})

onMounted(async () => {
  await fetchCategories()
  const draft = restoreDraft<ProductFormDraft>()
  if (draft) {
    applyFormDraft(draft)
    return
  }
  if (isEdit.value) {
    await loadProduct()
  }
})

function handlePreview() {
  const slug = previewSlug.value
  const categorySlug = previewCategorySlug.value
  if (!slug || !form.name.trim()) {
    alert('Vui lòng nhập tên sản phẩm để xem trước.')
    return
  }
  if (!categorySlug) {
    alert('Vui lòng chọn loại sản phẩm để xem trước.')
    return
  }

  const category = categories.value.find((c) => c.id === form.categoryId)
  const galleryList = buildProductGalleryList(
    form.thumbnail,
    productImageUrls.value,
  )

  const previewProduct = {
    id: productId.value ?? 999999,
    name: form.name,
    slug,
    sku: form.sku,
    description: form.description || '',
    shortDescription: form.shortDescription || '',
    price: form.price,
    salePrice: form.salePrice,
    thumbnail: form.thumbnail?.trim() || galleryList[0] || '',
    images: galleryList,
    categoryId: form.categoryId,
    status: resolveStatus(),
    material: form.material || '',
    dimensions: form.dimensions || '',
    color: form.color || '',
    warranty: form.warranty || '',
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    isContactPrice: form.isContactPrice,
    seoTitle: form.seoTitle || '',
    seoDescription: form.seoDescription || '',
    breadcrumb: category
      ? [
          { name: category.name, slug: category.slug },
          { name: form.name.trim(), slug },
        ]
      : [],
  }

  savePreviewData('product', slug, previewProduct)
  saveDraft(snapshotFormDraft())
  router.push(`/san-pham/${categorySlug}/${slug}/preview`)
}

async function onSubmit() {
  const validationError = validateForm()
  if (validationError) {
    error.value = validationError
    return
  }

  saving.value = true
  error.value = ''
  try {
    if (isEdit.value && productId.value !== null) {
      await productApi.update(productId.value, formPayload.value)
    } else {
      await productApi.create(formPayload.value)
    }
    clearDraft()
    router.push('/admin/products/list')
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string }
    error.value = err?.response?.data?.message || err?.message || 'Lưu thất bại.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.product-form-page {
  font-size: 0.75rem;
  color: #1f2937;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.page-header-left {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.back-btn {
  width: 2rem;
  height: 2rem;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
  transition: color 0.15s;
}

.back-btn:hover {
  color: #111827;
}

.page-title {
  font-family: var(--font-serif, Georgia, serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: #030712;
  line-height: 1.3;
}

.page-breadcrumb {
  margin-top: 0.125rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #9ca3af;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.page-breadcrumb a {
  color: #6b7280;
  text-decoration: none;
}

.page-breadcrumb a:hover {
  color: var(--color-primary);
}

.page-breadcrumb i {
  font-size: 0.5rem;
}

.page-header-actions {
  display: flex;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .form-grid {
    grid-template-columns: 7fr 5fr;
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
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 0.625rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #f9fafb;
}

.section-heading--sm {
  margin-bottom: 1rem;
}

.section-label {
  display: block;
  margin-bottom: 0.75rem;
}

.label-muted {
  font-weight: 400;
  color: #9ca3af;
  text-transform: none;
  letter-spacing: 0;
}

.field-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.field-grid--2 {
  grid-template-columns: 1fr;
}

.field-grid--3 {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .field-grid--2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .field-grid--3 {
    grid-template-columns: repeat(3, 1fr);
  }
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

.field-input--bold {
  font-weight: 700;
}

.field-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.field-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
}

.field-textarea {
  resize: vertical;
  min-height: 4.5rem;
}

.field-hint {
  font-size: 0.625rem;
  font-weight: 400;
  color: #9ca3af;
}

.select-wrap {
  position: relative;
}

.field-select {
  appearance: none;
  padding-right: 2rem;
  cursor: pointer;
}

.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.5625rem;
  color: #9ca3af;
  pointer-events: none;
}

.field--contact {
  flex-direction: row;
  align-items: center;
  gap: 0.375rem;
  padding-top: 1.5rem;
}

@media (min-width: 640px) {
  .field--contact {
    padding-top: 1.75rem;
  }
}

.contact-check,
.featured-check,
.radio-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.check-input,
.radio-input {
  width: 0.875rem;
  height: 0.875rem;
  accent-color: var(--color-primary);
}

.contact-info {
  font-size: 0.625rem;
  color: #9ca3af;
  cursor: help;
}

.radio-label--muted {
  margin-top: 0.25rem;
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
  padding-right: 3.25rem;
}

.editor-body {
  border: 1px solid var(--color-border);
  border-radius: 0 0 0.25rem 0.25rem;
  background: #fff;
  padding: 0.75rem;
}

.editor-textarea {
  border: none;
  padding: 0;
  min-height: 12rem;
  resize: vertical;
}

.editor-textarea:focus {
  border: none;
  box-shadow: none;
}

.editor-stats {
  text-align: right;
  font-size: 0.625rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}

.form-error {
  color: #dc2626;
  font-weight: 600;
  margin-top: 0.5rem;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
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
