<template>
  <div class="collection-form-page">
    <div class="page-header">
      <div class="page-header-left">
        <RouterLink to="/admin/collections" class="back-btn" title="Quay lại">
          <i class="fa-solid fa-arrow-left" />
        </RouterLink>
        <div>
          <h1 class="page-title">{{ isEdit ? 'Sửa bộ sưu tập' : 'Thêm bộ sưu tập' }}</h1>
          <p class="page-breadcrumb">
            <RouterLink to="/admin/collections">Trang chủ</RouterLink>
            <i class="fa-solid fa-chevron-right" />
            <RouterLink to="/admin/collections">Bộ sưu tập</RouterLink>
            <i class="fa-solid fa-chevron-right" />
            <span>{{ isEdit ? 'Sửa bộ sưu tập' : 'Thêm bộ sưu tập' }}</span>
          </p>
        </div>
      </div>
      <div class="page-header-actions">
        <RouterLink to="/admin/collections" class="btn btn-outline">Hủy</RouterLink>
        <button
          type="button"
          class="btn btn-outline"
          :disabled="!canPreview"
          @click="handlePreview"
        >
          Xem trước
          <i class="fa-regular fa-eye" />
        </button>
        <button type="button" class="btn btn-primary" :disabled="saving" @click="save">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="form-loading">Đang tải...</div>

    <form v-else class="form-layout" @submit.prevent="save">
      <div class="form-grid">
        <div class="form-col form-col--main">
          <section class="form-card">
            <h2 class="section-heading">Thông tin bộ sưu tập</h2>

            <div class="field-grid field-grid--2">
              <div class="field">
                <label class="field-label">
                  Tên bộ sưu tập <span class="required">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  class="field-input"
                  placeholder="Nhập tên bộ sưu tập"
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
                  placeholder="duong-dan-bo-suu-tap"
                  :required="!isEdit"
                  @input="slugTouched = true"
                />
                <p class="field-hint">Slug sẽ được tạo tự động từ tên. Có thể chỉnh sửa.</p>
              </div>
            </div>

            <div class="field-grid field-grid--2">
              <div class="field">
                <label class="field-label">
                  Thứ tự hiển thị <span class="required">*</span>
                </label>
                <input
                  v-model.number="form.orderIndex"
                  type="number"
                  min="0"
                  class="field-input field-input--bold"
                  required
                />
                <p class="field-hint">Số nhỏ hiển thị trước</p>
              </div>
              <div class="field">
                <label class="field-label">
                  Mô tả ngắn <span class="required">*</span>
                </label>
                <div class="field-counter-wrap">
                  <textarea
                    v-model="form.shortDescription"
                    rows="2"
                    class="field-input field-textarea"
                    placeholder="Nhập mô tả ngắn gọn về bộ sưu tập (tối đa 200 ký tự)"
                    :maxlength="SHORT_DESC_MAX"
                    required
                  />
                  <span class="field-counter">{{ shortDescCount }}/{{ SHORT_DESC_MAX }}</span>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="field-label">Mô tả chi tiết</label>
              <div class="editor-shell">
                <div class="field-counter-wrap editor-body">
                  <textarea
                    v-model="form.detailedDescription"
                    rows="4"
                    class="field-input field-textarea editor-textarea"
                    placeholder="Nhập mô tả chi tiết về bộ sưu tập..."
                    :maxlength="DETAIL_DESC_MAX"
                  />
                  <span class="field-counter">{{ detailDescCount }}/{{ DETAIL_DESC_MAX }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="form-card">
            <h3 class="section-heading">SEO</h3>
            <div class="field-grid field-grid--2">
              <div class="field">
                <label class="field-label">
                  SEO title
                </label>
                <div class="field-counter-wrap">
                  <input
                    v-model="form.seoTitle"
                    type="text"
                    class="field-input field-input--counter"
                    placeholder="Nhập SEO title (tối đa 60 ký tự)"
                    :maxlength="SEO_TITLE_MAX"
                  />
                  <span class="field-counter field-counter--input">
                    {{ seoTitleCount }}/{{ SEO_TITLE_MAX }}
                  </span>
                </div>
                <p class="field-hint">Tiêu đề trang xuất hiện trên kết quả tìm kiếm Google.</p>
              </div>
              <div class="field">
                <label class="field-label">
                  SEO description
                </label>
                <div class="field-counter-wrap">
                  <textarea
                    v-model="form.seoDescription"
                    rows="2"
                    class="field-input field-textarea"
                    placeholder="Nhập SEO description (tối đa 160 ký tự)"
                    :maxlength="SEO_DESC_MAX"
                  />
                  <span class="field-counter">{{ seoDescCount }}/{{ SEO_DESC_MAX }}</span>
                </div>
                <p class="field-hint">Mô tả trang xuất hiện trên kết quả tìm kiếm Google.</p>
              </div>
            </div>
          </section>

          <section class="form-card products-picker-card">
            <div class="products-picker-head">
              <div>
                <h3 class="products-picker-title">Sản phẩm trong bộ sưu tập</h3>
                <p class="products-picker-hint">Chọn các sản phẩm thuộc bộ sưu tập này</p>
              </div>
              <button
                type="button"
                class="btn btn-outline btn-sm"
                :disabled="!isEdit"
                @click="onChooseProducts"
              >
                <i class="fa-solid fa-plus" />
                Chọn sản phẩm
              </button>
            </div>
            <p v-if="!isEdit" class="products-save-first">
              Lưu bộ sưu tập trước, sau đó thêm và sắp xếp sản phẩm.
            </p>
          </section>

          <section v-if="isEdit" class="form-card products-table-card">
            <p v-if="reorderingProducts" class="reorder-hint">
              <i class="fa-solid fa-spinner fa-spin" />
              Đang lưu thứ tự sản phẩm...
            </p>

            <div v-if="loadingProducts" class="inline-loading">Đang tải sản phẩm...</div>
            <div v-else-if="collectionProducts.length === 0" class="inline-empty">
              Chưa có sản phẩm. Nhấn &quot;Chọn sản phẩm&quot; để thêm.
            </div>
            <div v-else class="table-scroll">
              <table class="products-table">
                <thead>
                  <tr>
                    <th class="col-drag" aria-label="Sắp xếp" />
                    <th>Sản phẩm</th>
                    <th class="col-price">Giá</th>
                    <th class="col-actions">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in collectionProducts"
                    :key="item.id"
                    class="data-row"
                    :class="{
                      'row-dragging': productDragFrom === index,
                      'row-drag-over': productDragOver === index && productDragFrom !== index,
                    }"
                    @dragover.prevent="onProductDragOver(index, $event)"
                    @dragenter.prevent="onProductDragOver(index, $event)"
                    @drop.prevent="onProductDrop(index, $event)"
                  >
                    <td class="col-drag">
                      <span
                        class="drag-handle"
                        draggable="true"
                        title="Kéo để sắp xếp"
                        @dragstart.stop="onProductDragStart(index, $event)"
                        @dragend="onProductDragEnd"
                      >
                        <i class="fa-solid fa-bars" />
                      </span>
                    </td>
                    <td class="col-product">
                      <div class="product-cell">
                        <RouterLink
                          :to="getProductPath(item)"
                          class="product-thumb-link"
                          target="_blank"
                        >
                          <img
                            v-if="item.thumbnail"
                            :src="resolveMediaUrl(item.thumbnail)"
                            :alt="item.name"
                            class="product-thumb"
                          />
                          <span v-else class="product-thumb placeholder">📦</span>
                        </RouterLink>
                        <RouterLink
                          :to="getProductPath(item)"
                          class="product-name"
                          target="_blank"
                        >
                          {{ item.name }}
                        </RouterLink>
                      </div>
                    </td>
                    <td class="col-price">{{ formatPrice(item.price) }}</td>
                    <td class="col-actions">
                      <button
                        type="button"
                        class="btn-remove"
                        title="Xóa khỏi bộ sưu tập"
                        @mousedown.stop
                        @click="removeProduct(item.id)"
                      >
                        <i class="fa-solid fa-xmark" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="collectionProducts.length" class="table-hint">Kéo thả để sắp xếp thứ tự hiển thị</p>
          </section>
        </div>

        <div class="form-col form-col--side">
          <section class="form-card">
            <label class="field-label section-label">
              Ảnh đại diện <span class="required">*</span>
            </label>
            <p class="field-hint thumb-intro">
              Ảnh đại diện sẽ hiển thị trên trang danh sách bộ sưu tập
            </p>
            <ImageUploadField
              v-model="form.thumbnail"
              :show-preview="false"
              hint="Định dạng: JPG, PNG, WEBP. Tối đa 5MB. Tỷ lệ khuyến nghị: 16:9"
            />
            <label class="preview-block-label">Xem trước ảnh</label>
            <div class="preview-block">
              <img
                v-if="form.thumbnail"
                :src="resolveMediaUrl(form.thumbnail)"
                alt="Xem trước ảnh đại diện"
                class="preview-block-img"
              />
              <div v-else class="preview-block-empty">
                <i class="fa-regular fa-image" />
              </div>
            </div>
          </section>

          <section class="form-card">
            <label class="field-label section-label">Trạng thái</label>

            <label
              class="status-option"
              :class="{ 'status-option--active': form.isActive }"
            >
              <span class="status-option-main">
                <input v-model="form.isActive" type="radio" :value="true" class="radio-input" />
                <span class="status-option-label">Hiển thị</span>
              </span>
              <span class="status-badge status-badge--on">Hiển thị trên website</span>
            </label>

            <label
              class="status-option"
              :class="{ 'status-option--active': !form.isActive }"
            >
              <span class="status-option-main">
                <input v-model="form.isActive" type="radio" :value="false" class="radio-input" />
                <span class="status-option-label">Ẩn</span>
              </span>
              <span class="status-badge status-badge--off">Không hiển thị trên website</span>
            </label>
          </section>
        </div>
      </div>

      <div class="form-footer">
        <RouterLink to="/admin/collections" class="btn btn-outline">Hủy</RouterLink>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </form>

    <div v-if="showAddProductModal" class="modal-overlay" @click="showAddProductModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chọn sản phẩm</h3>
          <button type="button" class="btn-close" @click="showAddProductModal = false">
            <i class="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="modal-body">
          <div class="search-box">
            <input
              v-model="productSearch"
              type="text"
              class="field-input"
              placeholder="Tìm kiếm sản phẩm..."
              @input="searchProducts"
            />
          </div>
          <div v-if="loadingSearch" class="inline-loading">Đang tìm...</div>
          <div v-else-if="searchResults.length === 0" class="inline-empty">
            Nhập ít nhất 2 ký tự để tìm sản phẩm.
          </div>
          <div v-else class="search-results">
            <div
              v-for="product in searchResults"
              :key="product.id"
              class="search-result-item"
              :class="{ disabled: isProductInCollection(product.id) }"
              @click="addProduct(product)"
            >
              <img
                v-if="product.thumbnail"
                :src="resolveMediaUrl(product.thumbnail)"
                :alt="product.name"
                class="result-thumb"
              />
              <div v-else class="result-thumb placeholder">📦</div>
              <div class="result-info">
                <div class="result-name">{{ product.name }}</div>
                <div class="result-price">{{ formatPrice(product.price) }}</div>
              </div>
              <span v-if="isProductInCollection(product.id)" class="badge-added">Đã thêm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  collectionApi,
  type Collection,
  type CollectionProduct,
} from '@/services/api/collections'
import { productApi, type Product } from '@/services/api/products'
import { formatPrice } from '@/utils/format'
import { slugify } from '@/utils/slugify'
import { savePreviewData } from '@/utils/preview'
import { getProductPath } from '@/utils/navigation'
import ImageUploadField from '@/components/admin/ImageUploadField.vue'
import { resolveMediaUrl } from '@/utils/mediaUrl'
import { useAdminFormDraft } from '@/composables/useAdminFormDraft'

import { COLLECTION_DESCRIPTION_SEP as DESCRIPTION_SEP } from '@/utils/collectionDescription'
const SHORT_DESC_MAX = 200
const DETAIL_DESC_MAX = 5000
const SEO_TITLE_MAX = 60
const SEO_DESC_MAX = 160

type ProductRow = {
  id: number
  name: string
  slug: string
  price: number
  thumbnail?: string
  orderIndex: number
  breadcrumb: { name: string; slug: string }[]
}

const route = useRoute()
const router = useRouter()

const collectionId = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value || value === 'new') return null
  const id = Number(value)
  return Number.isFinite(id) ? id : null
})

const isEdit = computed(() => collectionId.value !== null)

const loading = ref(false)
const saving = ref(false)
const slugTouched = ref(false)
const loadingProducts = ref(false)
const reorderingProducts = ref(false)
const showAddProductModal = ref(false)
const productSearch = ref('')
const loadingSearch = ref(false)
const searchResults = ref<Product[]>([])

const productDragFrom = ref<number | null>(null)
const productDragOver = ref<number | null>(null)

const form = reactive({
  name: '',
  slug: '',
  shortDescription: '',
  detailedDescription: '',
  thumbnail: '',
  orderIndex: 0,
  isActive: true,
  seoTitle: '',
  seoDescription: '',
})

const collectionProducts = ref<ProductRow[]>([])

type CollectionFormDraft = {
  form: typeof form
  slugTouched: boolean
  collectionProducts: ProductRow[]
}

const { saveDraft, restoreDraft, clearDraft } = useAdminFormDraft()

const shortDescCount = computed(() => form.shortDescription.length)
const detailDescCount = computed(() => form.detailedDescription.length)
const seoTitleCount = computed(() => form.seoTitle.length)
const seoDescCount = computed(() => form.seoDescription.length)

const canPreview = computed(() => !!form.slug?.trim() && !!form.name?.trim())

function parseDescription(raw: string | undefined | null) {
  const text = (raw ?? '').trim()
  if (!text) {
    return { short: '', detailed: '' }
  }
  if (text.includes(DESCRIPTION_SEP)) {
    const [shortPart, ...rest] = text.split(DESCRIPTION_SEP)
    return {
      short: (shortPart ?? '').trim(),
      detailed: rest.join(DESCRIPTION_SEP).trim(),
    }
  }
  if (text.length <= SHORT_DESC_MAX) {
    return { short: text, detailed: '' }
  }
  return { short: text.slice(0, SHORT_DESC_MAX), detailed: text }
}

function serializeDescription(): string | undefined {
  const short = form.shortDescription.trim()
  const detailed = form.detailedDescription.trim()
  if (detailed) {
    return short ? `${short}${DESCRIPTION_SEP}${detailed}` : detailed
  }
  return short || undefined
}

function sortProducts(list: ProductRow[]): ProductRow[] {
  return [...list].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0) || a.id - b.id,
  )
}

function mapProductToRow(p: CollectionProduct): ProductRow {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug || '',
    price: p.price,
    thumbnail: p.thumbnail,
    orderIndex: p.orderIndex ?? 0,
    breadcrumb: p.breadcrumb?.length ? p.breadcrumb : [],
  }
}

function applyFormDraft(draft: CollectionFormDraft) {
  Object.assign(form, draft.form)
  slugTouched.value = draft.slugTouched
  collectionProducts.value = draft.collectionProducts.map((p) => ({ ...p }))
}

function snapshotFormDraft(): CollectionFormDraft {
  return {
    form: { ...form },
    slugTouched: slugTouched.value,
    collectionProducts: collectionProducts.value.map((p) => ({ ...p })),
  }
}

function applyCollectionToForm(c: Collection) {
  form.name = c.name || ''
  form.slug = c.slug || ''
  const parsed = parseDescription(c.description)
  form.shortDescription = parsed.short
  form.detailedDescription = parsed.detailed
  form.thumbnail = c.thumbnail || ''
  form.orderIndex = c.orderIndex ?? 0
  form.isActive = c.isActive ?? true
  form.seoTitle = c.seoTitle || ''
  form.seoDescription = c.seoDescription || ''
  collectionProducts.value = sortProducts((c.products ?? []).map(mapProductToRow))
}

async function loadCollection() {
  if (!isEdit.value || collectionId.value === null) return
  loading.value = true
  loadingProducts.value = true
  try {
    const c = await collectionApi.getById(collectionId.value)
    applyCollectionToForm(c)
    slugTouched.value = true
  } catch (e) {
    logger.error(e)
    alert('Không thể tải dữ liệu bộ sưu tập.')
    router.push('/admin/collections')
  } finally {
    loading.value = false
    loadingProducts.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    name: '',
    slug: '',
    shortDescription: '',
    detailedDescription: '',
    thumbnail: '',
    orderIndex: 0,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
  })
  collectionProducts.value = []
}

watch(
  () => form.name,
  (name) => {
    if (isEdit.value || slugTouched.value) return
    form.slug = slugify(name)
  },
)

watch(collectionId, () => {
  slugTouched.value = false
  if (isEdit.value) {
    loadCollection()
  } else {
    resetForm()
  }
})

onMounted(() => {
  const draft = restoreDraft<CollectionFormDraft>()
  if (draft) {
    applyFormDraft(draft)
    return
  }
  if (isEdit.value) {
    loadCollection()
  }
})

function onChooseProducts() {
  if (!isEdit.value) {
    alert('Vui lòng lưu bộ sưu tập trước khi chọn sản phẩm.')
    return
  }
  showAddProductModal.value = true
}

function onProductDragStart(index: number, e: DragEvent) {
  productDragFrom.value = index
  productDragOver.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    const row = (e.target as HTMLElement).closest('tr')
    if (row) {
      e.dataTransfer.setDragImage(row, 24, 20)
    }
  }
}

function onProductDragOver(index: number, e: DragEvent) {
  if (productDragFrom.value === null) return
  productDragOver.value = index
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

async function onProductDrop(index: number, e: DragEvent) {
  let from = productDragFrom.value
  if (from === null) {
    const raw = e.dataTransfer?.getData('text/plain')
    if (raw !== '') {
      const parsed = Number(raw)
      if (!Number.isNaN(parsed)) from = parsed
    }
  }
  onProductDragEnd()
  if (from === null || from === index || collectionId.value === null) return

  const list = [...collectionProducts.value]
  const [moved] = list.splice(from, 1)
  if (!moved) return
  list.splice(index, 0, moved)
  collectionProducts.value = list.map((p, i) => ({ ...p, orderIndex: i }))

  await persistProductOrder()
}

function onProductDragEnd() {
  productDragFrom.value = null
  productDragOver.value = null
}

async function persistProductOrder() {
  if (collectionId.value === null) return
  reorderingProducts.value = true
  const snapshot = collectionProducts.value.map((p) => ({ ...p }))
  try {
    await collectionApi.updateProductOrder(
      collectionId.value,
      collectionProducts.value.map((p, index) => ({
        productId: p.id,
        orderIndex: index,
      })),
    )
  } catch (e) {
    logger.error(e)
    collectionProducts.value = snapshot
    alert('Không thể lưu thứ tự sản phẩm.')
  } finally {
    reorderingProducts.value = false
  }
}

async function searchProducts() {
  const query = productSearch.value.trim()
  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }

  loadingSearch.value = true
  try {
    const all = await productApi.listAdmin()
    searchResults.value = all
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku?.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 20)
  } catch (e) {
    logger.error(e)
    searchResults.value = []
  } finally {
    loadingSearch.value = false
  }
}

function isProductInCollection(productId: number): boolean {
  return collectionProducts.value.some((p) => p.id === productId)
}

async function addProduct(product: Product) {
  if (isProductInCollection(product.id)) return

  if (!isEdit.value || collectionId.value === null) {
    alert('Vui lòng lưu bộ sưu tập trước khi thêm sản phẩm.')
    return
  }

  try {
    const orderIndex = collectionProducts.value.length
    await collectionApi.addProduct(collectionId.value, product.id, orderIndex)

    const breadcrumb: { name: string; slug: string }[] = []
    if (product.breadcrumb?.length) {
      breadcrumb.push(...product.breadcrumb)
    }

    collectionProducts.value.push({
      id: product.id,
      name: product.name,
      slug: product.slug || '',
      price: product.price,
      thumbnail: product.thumbnail,
      orderIndex,
      breadcrumb,
    })

    showAddProductModal.value = false
    productSearch.value = ''
    searchResults.value = []
  } catch (e: unknown) {
    logger.error(e)
    alert('Thêm sản phẩm thất bại.')
  }
}

async function removeProduct(productId: number) {
  if (!confirm('Xóa sản phẩm này khỏi bộ sưu tập?')) return
  if (!isEdit.value || collectionId.value === null) return

  try {
    await collectionApi.removeProduct(collectionId.value, productId)
    collectionProducts.value = collectionProducts.value
      .filter((p) => p.id !== productId)
      .map((p, index) => ({ ...p, orderIndex: index }))
    await persistProductOrder()
  } catch (e: unknown) {
    logger.error(e)
    alert('Xóa sản phẩm thất bại.')
  }
}

function validateForm(): string | null {
  if (!form.name.trim()) return 'Vui lòng nhập tên bộ sưu tập.'
  if (!form.slug.trim() && !form.name.trim()) return 'Vui lòng nhập slug.'
  if (!form.shortDescription.trim()) return 'Vui lòng nhập mô tả ngắn.'
  if (!form.thumbnail.trim()) return 'Vui lòng tải ảnh đại diện.'
  return null
}

function buildPayload() {
  const trimmedSlug = form.slug?.trim()
  return {
    name: form.name.trim(),
    slug: trimmedSlug ? slugify(trimmedSlug) : slugify(form.name),
    description: serializeDescription(),
    thumbnail: form.thumbnail?.trim() || undefined,
    orderIndex: Math.max(0, form.orderIndex ?? 0),
    isActive: form.isActive,
    seoTitle: form.seoTitle?.trim().slice(0, SEO_TITLE_MAX) || undefined,
    seoDescription: form.seoDescription?.trim().slice(0, SEO_DESC_MAX) || undefined,
  }
}

async function handlePreview() {
  if (!canPreview.value) {
    alert('Vui lòng nhập tên và slug để xem trước.')
    return
  }

  const slug = slugify(form.slug.trim() || form.name)

  const previewCollection = {
    collection: {
      id: collectionId.value ?? 999999,
      name: form.name.trim(),
      slug,
      description: serializeDescription() || '',
      thumbnail: form.thumbnail?.trim() || '',
      orderIndex: form.orderIndex || 0,
      isActive: form.isActive,
      seoTitle: form.seoTitle?.trim() || '',
      seoDescription: form.seoDescription?.trim() || '',
    },
    products: collectionProducts.value,
  }

  savePreviewData('collection', slug, previewCollection)
  saveDraft(snapshotFormDraft())
  router.push(`/bo-suu-tap/${slug}/preview`)
}

async function save() {
  const validationError = validateForm()
  if (validationError) {
    alert(validationError)
    return
  }

  saving.value = true
  try {
    const payload = buildPayload()
    if (isEdit.value && collectionId.value !== null) {
      await collectionApi.update(collectionId.value, payload)
      clearDraft()
      router.push('/admin/collections')
    } else {
      const created = await collectionApi.create(payload)
      clearDraft()
      router.push(`/admin/collections/${created.id}`)
    }
  } catch (e: unknown) {
    logger.error(e)
    alert('Lưu thất bại.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.collection-form-page {
  font-size: var(--fs-body-sm);
  color: #1f2937;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
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
}

.back-btn:hover {
  color: #111827;
}

.page-title {
  font-family: var(--font-serif, Georgia, serif);
  font-size: var(--fs-card-title);
  font-weight: 700;
  color: #030712;
}

.page-breadcrumb {
  margin-top: 0.125rem;
  font-size: var(--fs-body-sm);
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
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #f9fafb;
}

.section-label {
  display: block;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.field-grid--2 {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .field-grid--2 {
    grid-template-columns: repeat(2, 1fr);
  }
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
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: #1f2937;
}

.field-input--bold {
  font-weight: 700;
}

.field-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.field-textarea {
  resize: vertical;
  min-height: 3.5rem;
}

.field-hint {
  font-size: var(--fs-caption);
  color: #9ca3af;
  line-height: 1.4;
}

.thumb-intro {
  margin-top: -0.25rem;
  margin-bottom: 0.75rem;
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

.editor-shell {
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  overflow: hidden;
}

.editor-body {
  background: #fff;
  padding: 0.75rem;
}

.editor-textarea {
  border: none;
  padding: 0;
  min-height: 7rem;
}

.editor-textarea:focus {
  box-shadow: none;
}

.products-picker-card {
  padding: 1.25rem 1.5rem;
}

.products-picker-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.products-picker-title {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.products-picker-hint {
  margin: 0.25rem 0 0;
  font-size: var(--fs-body-sm);
  color: #9ca3af;
}

.products-save-first {
  margin: 0.75rem 0 0;
  font-size: var(--fs-body-sm);
  color: #b45309;
  font-weight: 600;
}

.preview-block-label {
  display: block;
  margin-top: 1rem;
  font-size: var(--fs-caption);
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
}

.preview-block {
  margin-top: 0.375rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: #f9fafb;
}

.preview-block-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-block-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  font-size: var(--fs-section-title);
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
  transition: background 0.15s, border-color 0.15s;
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

.status-badge--off {
  background: #fef2f2;
  color: #dc2626;
}

.reorder-hint {
  margin: 0 0 0.75rem;
  font-size: var(--fs-body-sm);
  color: #78350f;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.inline-loading,
.inline-empty {
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
  font-size: var(--fs-body-sm);
}

.table-hint {
  margin: 0.75rem 0 0;
  font-size: var(--fs-caption);
  color: #9ca3af;
}

.table-scroll {
  overflow-x: auto;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-body-sm);
}

.products-table thead tr {
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-size: var(--fs-caption);
  text-transform: uppercase;
}

.products-table th,
.products-table td {
  padding: 0.625rem 0.75rem;
  text-align: left;
  vertical-align: middle;
}

.products-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
}

.data-row.row-dragging {
  opacity: 0.45;
}

.data-row.row-drag-over {
  background: rgba(254, 243, 199, 0.45);
  box-shadow: inset 0 2px 0 #d97706;
}

.col-drag {
  width: 2.5rem;
}

.drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: #9ca3af;
  cursor: grab;
  border-radius: 0.25rem;
}

.drag-handle:hover {
  color: #78350f;
  background: #f3f4f6;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-thumb {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 0.25rem;
  background: #f3f4f6;
}

.product-thumb.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-name {
  font-weight: 600;
  color: #111827;
  text-decoration: none;
}

.product-name:hover {
  color: var(--color-primary);
}

.col-price {
  width: 7rem;
  color: #4b5563;
}

.col-actions {
  width: 3rem;
  text-align: center;
}

.btn-remove {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: #fff;
  color: #dc2626;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #fef2f2;
  border-color: #fca5a5;
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

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: var(--fs-body-sm);
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 36rem;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header h3 {
  margin: 0;
  font-size: var(--fs-body-sm);
  font-weight: 700;
}

.btn-close {
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.25rem;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 1.25rem;
  overflow-y: auto;
}

.search-box {
  margin-bottom: 1rem;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.search-result-item:hover:not(.disabled) {
  background: #f9fafb;
  border-color: var(--color-primary);
}

.search-result-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-thumb {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 0.25rem;
  background: #f3f4f6;
  flex-shrink: 0;
}

.result-thumb.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-weight: 600;
  font-size: var(--fs-body-sm);
}

.result-price {
  font-size: var(--fs-body-sm);
  color: #6b7280;
  margin-top: 0.125rem;
}

.badge-added {
  font-size: var(--fs-caption);
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  background: #ecfdf5;
  color: #047857;
  border-radius: 0.125rem;
}
</style>
