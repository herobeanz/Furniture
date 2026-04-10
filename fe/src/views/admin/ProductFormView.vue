<template>
  <div class="product-form">
    <h1>{{ isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h1>
    <form @submit.prevent="onSubmit" class="form-container">
      <FormField label="Danh mục" :required="true">
        <UiSelect v-model="form.categoryId" placeholder="Chọn danh mục" :required="true">
          <option value="0">Chọn danh mục</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </UiSelect>
      </FormField>

      <FormField label="Tên" :required="true">
        <UiInput v-model="form.name" placeholder="Enter product name" :required="true" />
      </FormField>

      <FormField label="SKU" optional hint="Để trống sẽ tự động tạo mã SKU dựa trên danh mục">
        <UiInput v-model="form.sku" placeholder="Enter SKU (optional)" />
      </FormField>

      <FormField label="Slug" optional hint="Để trống sẽ tự tạo">
        <UiInput v-model="form.slug" placeholder="Enter slug" />
      </FormField>

      <FormField label="Mô tả ngắn" optional>
        <UiTextarea v-model="form.shortDescription" :rows="2" placeholder="Enter short description" />
      </FormField>

      <FormField label="Mô tả đầy đủ" optional>
        <UiTextarea v-model="form.description" :rows="4" placeholder="Enter full description" />
      </FormField>

      <div class="form-row">
        <FormField label="Giá" :required="true">
          <UiInput
            v-model.number="form.price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            :required="true"
            :disabled="form.isContactPrice"
          />
        </FormField>
        <FormField label="Giá khuyến mãi" optional>
          <UiInput
            v-model.number="form.salePrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            :disabled="form.isContactPrice"
          />
        </FormField>
      </div>

      <FormField label="Ảnh đại diện (URL)" optional>
        <UiInput v-model="form.thumbnail" type="url" placeholder="Enter image URL" />
      </FormField>

      <FormField label="Ảnh sản phẩm" optional hint="Mỗi URL một dòng. Ảnh đầu tiên sẽ là ảnh chính">
        <UiTextarea v-model="imagesText" :rows="3" placeholder="https://..." />
      </FormField>

      <FormField label="Trạng thái" optional>
        <UiSelect v-model="form.status">
          <option value="available">available</option>
          <option value="hidden">hidden</option>
          <option value="discontinued">discontinued</option>
        </UiSelect>
      </FormField>

      <div class="form-row">
        <FormField label="Chất liệu" optional>
          <UiInput v-model="form.material" placeholder="Enter material" />
        </FormField>
        <FormField label="Kích thước" optional>
          <UiInput v-model="form.dimensions" placeholder="Enter dimensions" />
        </FormField>
      </div>

      <div class="form-row">
        <FormField label="Màu sắc" optional>
          <UiInput v-model="form.color" placeholder="Enter color" />
        </FormField>
        <FormField label="Bảo hành" optional>
          <UiInput v-model="form.warranty" placeholder="Enter warranty" />
        </FormField>
      </div>

      <div class="form-row">
        <FormField label="Đã bán (số lượng)" optional>
          <UiInput v-model.number="form.soldCount" type="number" min="0" step="1" placeholder="0" />
        </FormField>
        <FormField label="Đánh giá (0 - 5)" optional>
          <UiInput v-model.number="form.rating" type="number" min="0" max="5" step="0.1" placeholder="4.8" />
        </FormField>
      </div>

      <div class="form-row">
        <FormField>
          <UiCheckbox v-model="form.isActive" label="Kích hoạt" />
        </FormField>
        <FormField>
          <UiCheckbox v-model="form.isFeatured" label="Sản phẩm nổi bật" />
        </FormField>
        <FormField>
          <UiCheckbox v-model="form.isHot" label="Sản phẩm hot" />
        </FormField>
        <FormField>
          <UiCheckbox v-model="form.isContactPrice" label="Giá liên hệ (ẩn giá, chỉ hiển thị 'Liên hệ')" />
        </FormField>
      </div>

      <div class="form-row">
        <FormField>
          <UiCheckbox v-model="form.isDailyFlashSale" label="Tham gia Daily Flash Sale" />
        </FormField>
        <FormField label="Thời gian kết thúc Flash Sale" optional>
          <UiInput
            v-model="form.flashSaleEndAt"
            type="datetime-local"
            placeholder="Chọn thời gian kết thúc"
            :disabled="!form.isDailyFlashSale"
          />
        </FormField>
      </div>

      <FormField label="SEO Title" optional>
        <UiInput v-model="form.seoTitle" placeholder="Enter SEO title" />
      </FormField>

      <FormField label="SEO Description" optional>
        <UiTextarea v-model="form.seoDescription" :rows="2" placeholder="Enter SEO description" />
      </FormField>

      <FormField v-if="error" :error="error" />

      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="handlePreview" :disabled="!form.slug || !form.name">
          Xem trước
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <button type="button" class="btn btn-outline" @click="triggerImport">
          Import file
        </button>
        <button type="button" class="btn btn-outline" @click="downloadImportTemplate">
          Tải template
        </button>
        <RouterLink to="/admin/products" class="btn btn-outline">Hủy</RouterLink>
        <input
          ref="importFileInput"
          type="file"
          class="import-file-input"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          @change="onImportFileChange"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - xlsx types may not be available
import * as XLSX from 'xlsx'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import apiClient from '@/services/api.client'
import { savePreviewData } from '@/utils/preview'
import FormField from '@/components/ui/FormField.vue'
import { UiInput, UiTextarea, UiSelect, UiCheckbox } from '@/components/ui'

const route = useRoute()
const router = useRouter()
const idParam = computed(() => route.params.id as string)
const id = computed(() => idParam.value && idParam.value !== 'new' ? Number(idParam.value) : null)
const isEdit = computed(() => !!id.value)

const categories = ref<any[]>([])

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
  soldCount: 0,
  rating: undefined as number | undefined,
  isActive: true,
  isFeatured: false,
  isHot: false,
  isContactPrice: false,
  isDailyFlashSale: false,
  flashSaleEndAt: '',
  seoTitle: '',
  seoDescription: '',
})

const imagesText = ref('')
const saving = ref(false)
const error = ref('')
const importFileInput = ref<HTMLInputElement | null>(null)

const formPayload = computed(() => {
  const imageUrls = imagesText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  
  const images = imageUrls.map((url, index) => ({
    imageUrl: url,
    isPrimary: index === 0,
    altText: form.name,
    orderIndex: index,
  }))

  // Chuẩn hóa giá khuyến mãi:
  // - Nếu người dùng để trống hoặc xóa -> null (xóa sale_price)
  // - Nếu nhập số hợp lệ -> số đó
  const normalizedSalePrice =
    form.salePrice === undefined || form.salePrice === null || form.salePrice === 0
      ? null
      : form.salePrice

  return {
    categoryId: form.categoryId,
    name: form.name,
    sku: form.sku?.trim() || undefined, // Send undefined if empty to let backend generate
    slug: form.slug || undefined,
    shortDescription: form.shortDescription || undefined,
    description: form.description || undefined,
    price: form.price,
    salePrice: normalizedSalePrice,
    thumbnail: form.thumbnail || undefined,
    status: form.status,
    material: form.material || undefined,
    dimensions: form.dimensions || undefined,
    color: form.color || undefined,
    warranty: form.warranty || undefined,
    soldCount: form.soldCount || 0,
    rating: form.rating || undefined,
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    isHot: form.isHot,
    isContactPrice: form.isContactPrice,
    isDailyFlashSale: form.isDailyFlashSale,
    flashSaleEndAt: form.isDailyFlashSale && form.flashSaleEndAt ? form.flashSaleEndAt : undefined,
    seoTitle: form.seoTitle || undefined,
    seoDescription: form.seoDescription || undefined,
    images,
  }
})

async function fetchCategories() {
  try {
    const res = await apiClient.get('/categories/list/all')
    categories.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error(e)
  }
}

// Clear flash sale end time when unchecking Daily Flash Sale
watch(
  () => form.isDailyFlashSale,
  (isEnabled) => {
    if (!isEnabled) {
      form.flashSaleEndAt = ''
    }
  }
)

onMounted(async () => {
  await fetchCategories()
  
  if (isEdit.value && id.value) {
    try {
      const product = await apiClient.get(`/products/by-id/${id.value}`) as any
      form.categoryId = product.categoryId || 0
      form.name = product.name || ''
      form.sku = product.sku || ''
      form.slug = product.slug || ''
      form.shortDescription = product.shortDescription || ''
      form.description = product.description || ''
      form.price = product.price || 0
      form.salePrice = product.salePrice
      form.thumbnail = product.thumbnail || ''
      form.status = product.status || 'available'
      form.material = product.material || ''
      form.dimensions = product.dimensions || ''
      form.color = product.color || ''
      form.warranty = product.warranty || ''
      form.soldCount = product.soldCount ?? 0
      form.rating = product.rating ?? undefined
      form.isActive = product.isActive ?? true
      form.isFeatured = product.isFeatured ?? false
      form.isHot = product.isHot ?? false
      form.isContactPrice = product.isContactPrice ?? false
      form.isDailyFlashSale = product.isDailyFlashSale ?? false
      form.flashSaleEndAt = product.flashSaleEndAt || ''
      form.seoTitle = product.seoTitle || ''
      form.seoDescription = product.seoDescription || ''
      imagesText.value = (product.images ?? []).join('\n')
    } catch (e) {
      console.error(e)
    }
  }
})

function handlePreview() {
  if (!form.slug || !form.name) {
    alert('Vui lòng nhập tên và slug để xem trước.')
    return
  }
  
  // Create preview product data
  const imageUrls = imagesText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  
  const previewProduct = {
    id: id.value || 999999, // Temporary ID for preview
    name: form.name,
    slug: form.slug,
    sku: form.sku,
    description: form.description || '',
    shortDescription: form.shortDescription || '',
    price: form.price,
    salePrice: form.salePrice,
    thumbnail: form.thumbnail || '',
    images: imageUrls.length > 0 ? imageUrls : (form.thumbnail ? [form.thumbnail] : []),
    categoryId: form.categoryId,
    status: form.status,
    material: form.material || '',
    dimensions: form.dimensions || '',
    color: form.color || '',
    warranty: form.warranty || '',
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    isHot: form.isHot,
    isDailyFlashSale: form.isDailyFlashSale,
    flashSaleEndAt: form.flashSaleEndAt || '',
    soldCount: form.soldCount,
    rating: form.rating,
    seoTitle: form.seoTitle || '',
    seoDescription: form.seoDescription || '',
  }
  
  // Save to localStorage
  savePreviewData('product', form.slug, previewProduct)
  
  // Navigate to preview in same app
  router.push(`/san-pham/${form.slug}/preview`)
}

async function onSubmit() {
  saving.value = true
  error.value = ''
  try {
    if (isEdit.value && id.value) {
      await apiClient.patch(`/products/${id.value}`, formPayload.value)
    } else {
      await apiClient.post('/products', formPayload.value)
    }
    router.push('/admin/products')
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Lưu thất bại.'
  } finally {
    saving.value = false
  }
}

function triggerImport() {
  importFileInput.value?.click()
}

function onImportFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const wb = XLSX.read(reader.result as ArrayBuffer, { type: 'array' })
    const sheetName = wb.SheetNames[0]
    const sheet = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' })
    if (!rows.length) {
      alert('File import không có dữ liệu.')
      return
    }
    const row = rows[0]

    form.name = row.product_name || row.name || form.name
    form.slug = row.slug || form.slug
    form.sku = row.sku || form.sku
    form.shortDescription = row.short_description || row.shortDescription || form.shortDescription
    form.description = row.description || form.description
    form.price = row.price ? Number(row.price) : form.price
    form.salePrice = row.sale_price ? Number(row.sale_price) : form.salePrice
    form.thumbnail = row.thumbnail || form.thumbnail
    form.material = row.material || form.material
    form.dimensions = row.dimensions || form.dimensions
    form.color = row.color || form.color
    form.warranty = row.warranty || form.warranty
    form.isActive = row.is_active ? row.is_active.toLowerCase() !== 'false' : form.isActive
    form.isFeatured = row.is_featured ? row.is_featured.toLowerCase() === 'true' : form.isFeatured
    form.isHot = row.is_hot ? row.is_hot.toLowerCase() === 'true' : form.isHot
    form.isDailyFlashSale = row.is_daily_flash_sale
      ? row.is_daily_flash_sale.toLowerCase() === 'true'
      : form.isDailyFlashSale
    form.flashSaleEndAt = row.flash_sale_end_at || form.flashSaleEndAt
    form.seoTitle = row.seo_title || row.seoTitle || form.seoTitle
    form.seoDescription = row.seo_description || row.seoDescription || form.seoDescription

    if (row.images) {
      imagesText.value = String(row.images)
        .split('|')
        .map((s: string) => s.trim())
        .filter((s: string) => !!s)
        .join('\n')
    }

    alert('Đã import dữ liệu sản phẩm vào form. Vui lòng kiểm tra lại trước khi lưu.')
  }
  reader.readAsArrayBuffer(file)
  input.value = ''
}

function downloadImportTemplate() {
  const headers = [
    'product_name',
    'slug',
    'sku',
    'price',
    'sale_price',
    'thumbnail',
    'images',
    'short_description',
    'description',
    'material',
    'dimensions',
    'color',
    'warranty',
    'is_active',
    'is_featured',
    'is_hot',
    'is_daily_flash_sale',
    'flash_sale_end_at',
  ]

  const example = [
    'Sofa da cao cấp 3 chỗ',
    'sofa-da-cao-cap-3-cho',
    'SOFA-3C-001',
    '18900000',
    '22900000',
    'https://example.com/thumbnail.jpg',
    'https://example.com/img1.jpg|https://example.com/img2.jpg',
    'Sofa da bò Ý, thiết kế hiện đại, êm ái',
    'Mô tả chi tiết sản phẩm...',
    'Da bò Ý, gỗ sồi',
    '220x95x88 cm',
    'Nâu đậm',
    '2 năm',
    'true',
    'false',
    'true',
    'false',
    '',
  ]

  const worksheetData = [headers, example]
  const ws = XLSX.utils.aoa_to_sheet(worksheetData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template')

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `product-import-template-${form.slug || 'new'}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.product-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.product-form h1 {
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

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
.import-file-input {
  display: none;
}
</style>
