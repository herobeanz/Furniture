<template>
  <div class="bulk-import">
    <h1>Import &amp; cập nhật nhiều sản phẩm</h1>

    <section class="import-panel">
      <p class="help-text">
        Tải file Excel (.xlsx) theo đúng template, sau đó upload để xem trước danh sách sản phẩm sẽ
        <strong>tạo mới</strong> hoặc <strong>cập nhật</strong>.
      </p>

      <div class="import-actions">
        <button type="button" class="btn btn-outline" @click="downloadTemplate">
          Tải template XLSX
        </button>
        <button type="button" class="btn btn-outline" @click="exportProducts">
          Export sản phẩm
        </button>

        <label class="btn btn-primary file-label">
          Chọn file XLSX
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            @change="handleFileChange"
          />
        </label>
      </div>

      <p v-if="error" class="error-text">
        {{ error }}
      </p>
    </section>

    <section v-if="rows.length" class="preview-panel">
      <div class="preview-header">
        <h2>Xem trước ({{ rows.length }}) sản phẩm</h2>
        <div class="preview-actions">
          <span class="legend create">Tạo mới</span>
          <span class="legend update">Cập nhật</span>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="applying"
            @click="applyChanges"
          >
            {{ applying ? 'Đang áp dụng...' : 'Áp dụng thay đổi' }}
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="preview-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Hành động</th>
              <th>Category ID</th>
              <th>SKU</th>
              <th>Tên sản phẩm</th>
              <th>Slug</th>
              <th>Giá</th>
              <th>Giá KM</th>
              <th>Kích hoạt</th>
              <th>Hot</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in rows"
              :key="index"
              :class="row.action === 'create' ? 'row-create' : 'row-update'"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <span class="badge" :class="row.action">
                  {{ row.action === 'create' ? 'Tạo mới' : 'Cập nhật' }}
                </span>
              </td>
              <td>{{ row.data.categoryId }}</td>
              <td>{{ row.data.sku }}</td>
              <td>{{ row.data.name }}</td>
              <td>{{ row.data.slug }}</td>
              <td>{{ row.data.price }}</td>
              <td>{{ row.data.salePrice ?? '—' }}</td>
              <td>{{ row.data.isActive ? 'Có' : 'Không' }}</td>
              <td>{{ row.data.isHot ? 'Có' : 'Không' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger'
import { ref, computed, onMounted } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - xlsx types may not be available
import * as XLSX from 'xlsx'
import apiClient from '@/services/api/client'
import { categoryApi, type Category } from '@/services/api/categories'

interface ImportRowPayload {
  categoryId: number
  sku?: string
  name: string
  slug?: string
  shortDescription?: string
  description?: string
  price: number
  salePrice?: number
  thumbnail?: string
  images?: string[]
  material?: string
  dimensions?: string
  color?: string
  warranty?: string
  isActive: boolean
  isFeatured: boolean
  isHot: boolean
  isDailyFlashSale: boolean
  flashSaleEndAt?: string
  seoTitle?: string
  seoDescription?: string
}

type ImportAction = 'create' | 'update'

interface ExistingProductIndex {
  id: number
  slug: string
  sku?: string | null
}

interface RowWithAction {
  action: ImportAction
  data: ImportRowPayload
  targetId?: number
}

const error = ref('')
const applying = ref(false)
const exporting = ref(false)
const existingProducts = ref<ExistingProductIndex[]>([])
const rows = ref<RowWithAction[]>([])
const categories = ref<Category[]>([])

const hasExistingProducts = computed(() => existingProducts.value.length > 0)

onMounted(async () => {
  try {
    const [productsList, categoriesList] = await Promise.all([
      apiClient.get('/products/list/all'),
      categoryApi.getCategories(),
    ])

    if (Array.isArray(productsList)) {
      existingProducts.value = productsList.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        sku: p.sku,
      }))
    }

    if (Array.isArray(categoriesList)) {
      categories.value = categoriesList
    }
  } catch (e) {
    logger.error(e)
  }
})

function downloadTemplate() {
  const headers = [
    'category_id',
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
    '1',
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

  // Sheet hướng dẫn điền dữ liệu
  const helpData = [
    ['Trường', 'Bắt buộc', 'Mô tả', 'Ví dụ'],
    ['category_id*', 'Có', 'ID danh mục (Category ID) của sản phẩm trong hệ thống.', '1'],
    ['product_name*', 'Có', 'Tên sản phẩm hiển thị trên website.', 'Sofa da cao cấp 3 chỗ'],
    ['price*', 'Có', 'Giá bán của sản phẩm (số, đơn vị VND, không có dấu phẩy).', '18900000'],
    [
      'slug',
      'Không',
      'Đường dẫn thân thiện (url). Nếu để trống hệ thống có thể tự sinh dựa trên tên.',
      'sofa-da-cao-cap-3-cho',
    ],
    ['sku', 'Không', 'Mã SKU nội bộ. Nếu để trống có thể được sinh tự động.', 'SOFA-3C-001'],
    ['sale_price', 'Không', 'Giá khuyến mãi (nếu có).', '17900000'],
    ['thumbnail', 'Không', 'URL ảnh đại diện của sản phẩm.', 'https://example.com/thumbnail.jpg'],
    [
      'images',
      'Không',
      'Danh sách URL ảnh, ngăn cách bằng dấu |. Ảnh đầu tiên sẽ là ảnh chính.',
      'https://example.com/img1.jpg|https://example.com/img2.jpg',
    ],
    ['short_description', 'Không', 'Mô tả ngắn.', 'Sofa da bò Ý, thiết kế hiện đại.'],
    ['description', 'Không', 'Mô tả chi tiết sản phẩm (có thể dài).', '...'],
    ['material', 'Không', 'Chất liệu sản phẩm.', 'Da bò Ý, gỗ sồi'],
    ['dimensions', 'Không', 'Kích thước sản phẩm.', '220x95x88 cm'],
    ['color', 'Không', 'Màu sắc.', 'Nâu đậm'],
    ['warranty', 'Không', 'Thời gian bảo hành.', '2 năm'],
    ['is_active', 'Không', 'Kích hoạt hiển thị sản phẩm (true/false). Mặc định: true.', 'true'],
    ['is_featured', 'Không', 'Đánh dấu sản phẩm nổi bật (true/false).', 'false'],
    ['is_hot', 'Không', 'Đánh dấu sản phẩm hot (true/false).', 'true'],
    [
      'is_daily_flash_sale',
      'Không',
      'Đánh dấu tham gia Daily Flash Sale (true/false).',
      'false',
    ],
    [
      'flash_sale_end_at',
      'Không',
      'Thời gian kết thúc Flash Sale (ISO/datetime-local). Chỉ dùng nếu is_daily_flash_sale = true.',
      '2026-02-27T23:59',
    ],
  ]

  const wsHelp = XLSX.utils.aoa_to_sheet(helpData)

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template')
  XLSX.utils.book_append_sheet(wb, wsHelp, 'Huong_dan')

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'product-bulk-import-template.xlsx'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function exportProducts() {
  exporting.value = true
  error.value = ''
  try {
    const list = (await apiClient.get('/products/list/all')) as any[]

    const headers = [
      'category_id',
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

    const rowsData = list.map((p) => {
      const images = Array.isArray(p.images) ? p.images.join('|') : ''
      return [
        p.categoryId ?? '',
        p.name ?? '',
        p.slug ?? '',
        p.sku ?? '',
        p.price ?? '',
        p.salePrice ?? '',
        p.thumbnail ?? '',
        images,
        p.shortDescription ?? '',
        p.description ?? '',
        p.material ?? '',
        p.dimensions ?? '',
        p.color ?? '',
        p.warranty ?? '',
        p.isActive ? 'true' : 'false',
        p.isFeatured ? 'true' : 'false',
        p.isHot ? 'true' : 'false',
        p.isDailyFlashSale ? 'true' : 'false',
        p.flashSaleEndAt ?? '',
      ]
    })

    const worksheetData = [headers, ...rowsData]
    const ws = XLSX.utils.aoa_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const now = new Date()
    const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate(),
    ).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(
      now.getMinutes(),
    ).padStart(2, '0')}`
    a.download = `products-export-${ts}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e: any) {
    logger.error(e)
    error.value = e?.response?.data?.message || e?.message || 'Export sản phẩm thất bại.'
  } finally {
    exporting.value = false
  }
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  error.value = ''
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const wb = XLSX.read(reader.result as ArrayBuffer, { type: 'array' })
      const sheetName = wb.SheetNames[0] as string
      const sheet = wb.Sheets[sheetName]
      if (!sheet) {
        throw new Error('Không tìm thấy sheet dữ liệu trong file.')
      }
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' })
      if (!rawRows.length) {
        error.value = 'File import không có dữ liệu.'
        rows.value = []
        return
      }

      const parsed: RowWithAction[] = rawRows
        .map((r) => mapRowToPayload(r))
        .filter((x): x is RowWithAction => !!x)

      if (!parsed.length) {
        error.value = 'Không có dòng hợp lệ trong file import.'
      }
      rows.value = parsed
    } catch (err: any) {
      logger.error(err)
      error.value = 'Không đọc được file XLSX. Vui lòng kiểm tra lại định dạng.'
      rows.value = []
    }
  }
  reader.readAsArrayBuffer(file)
  input.value = ''
}

function mapRowToPayload(row: Record<string, any>): RowWithAction | null {
  const categoryIdRaw = row.category_id ?? row.categoryId ?? ''
  const categoryIdNum = Number(categoryIdRaw)
  if (!Number.isInteger(categoryIdNum) || categoryIdNum <= 0) {
    // Không có categoryId hợp lệ -> bỏ qua dòng này
    return null
  }

  const name = (row.product_name || row.name || '').toString().trim()
  if (!name) return null

  const slug = (row.slug || '').toString().trim() || undefined
  const sku = (row.sku || '').toString().trim() || undefined

  const priceRaw = row.price ?? ''
  const salePriceRaw = row.sale_price ?? ''
  const price = Number(priceRaw) || 0
  const salePrice = salePriceRaw !== '' ? Number(salePriceRaw) || undefined : undefined

  const shortDescription =
    (row.short_description || row.shortDescription || '').toString().trim() || undefined
  const description = (row.description || '').toString().trim() || undefined
  const thumbnail = (row.thumbnail || '').toString().trim() || undefined
  const material = (row.material || '').toString().trim() || undefined
  const dimensions = (row.dimensions || '').toString().trim() || undefined
  const color = (row.color || '').toString().trim() || undefined
  const warranty = (row.warranty || '').toString().trim() || undefined
  const seoTitle = (row.seo_title || row.seoTitle || '').toString().trim() || undefined
  const seoDescription =
    (row.seo_description || row.seoDescription || '').toString().trim() || undefined

  const imagesField = row.images
  const images = imagesField
    ? String(imagesField)
        .split('|')
        .map((s: string) => s.trim())
        .filter(Boolean)
    : undefined

  const isActiveStr = (row.is_active || '').toString().toLowerCase()
  const isFeaturedStr = (row.is_featured || '').toString().toLowerCase()
  const isHotStr = (row.is_hot || '').toString().toLowerCase()
  const isDailyStr = (row.is_daily_flash_sale || '').toString().toLowerCase()

  const isActive = isActiveStr ? isActiveStr !== 'false' : true
  const isFeatured = isFeaturedStr === 'true'
  const isHot = isHotStr === 'true'
  const isDailyFlashSale = isDailyStr === 'true'

  const flashSaleEndAt = (row.flash_sale_end_at || '').toString().trim() || undefined

  const payload: ImportRowPayload = {
    categoryId: categoryIdNum,
    name,
    slug,
    sku,
    shortDescription,
    description,
    price,
    salePrice,
    thumbnail,
    images,
    material,
    dimensions,
    color,
    warranty,
    isActive,
    isFeatured,
    isHot,
    isDailyFlashSale,
    flashSaleEndAt,
    seoTitle,
    seoDescription,
  }

  let target: ExistingProductIndex | undefined

  if (hasExistingProducts.value) {
    if (sku) {
      target = existingProducts.value.find(
        (p) => p.sku && p.sku.toString().toLowerCase() === sku.toLowerCase(),
      )
    }
    if (!target && slug) {
      target = existingProducts.value.find(
        (p) => p.slug && p.slug.toString().toLowerCase() === slug.toLowerCase(),
      )
    }
  }

  if (target) {
    return {
      action: 'update',
      data: payload,
      targetId: target.id,
    }
  }

  return {
    action: 'create',
    data: payload,
  }
}

async function applyChanges() {
  if (!rows.value.length) return
  if (!confirm(`Áp dụng thay đổi cho ${rows.value.length} sản phẩm?`)) return

  applying.value = true
  error.value = ''
  try {
    const promises = rows.value.map((row) => {
      const body: any = {
        categoryId: row.data.categoryId,
        name: row.data.name,
        sku: row.data.sku,
        slug: row.data.slug,
        shortDescription: row.data.shortDescription,
        description: row.data.description,
        price: row.data.price,
        salePrice: row.data.salePrice,
        thumbnail: row.data.thumbnail,
        material: row.data.material,
        dimensions: row.data.dimensions,
        color: row.data.color,
        warranty: row.data.warranty,
        isActive: row.data.isActive,
        isFeatured: row.data.isFeatured,
        isHot: row.data.isHot,
        isDailyFlashSale: row.data.isDailyFlashSale,
        flashSaleEndAt: row.data.isDailyFlashSale ? row.data.flashSaleEndAt : undefined,
        seoTitle: row.data.seoTitle,
        seoDescription: row.data.seoDescription,
      }

      if (row.data.images && row.data.images.length) {
        body.images = row.data.images.map((url, index) => ({
          imageUrl: url,
          isPrimary: index === 0,
          altText: row.data.name,
          orderIndex: index,
        }))
      }

      if (row.action === 'update' && row.targetId) {
        return apiClient.patch(`/products/${row.targetId}`, body)
      }
      return apiClient.post('/products', body)
    })

    await Promise.all(promises)
    alert('Đã áp dụng thay đổi cho các sản phẩm.')
    rows.value = []
  } catch (e: any) {
    logger.error(e)
    error.value =
      e?.response?.data?.message || e?.message || 'Áp dụng thay đổi thất bại. Vui lòng thử lại.'
  } finally {
    applying.value = false
  }
}
</script>

<style scoped>
.bulk-import {
  max-width: 1040px;
  margin: 0 auto;
  padding: 2rem;
}

.bulk-import h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #111827;
}

.import-panel {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.help-text {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.import-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.file-label {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.file-label input[type='file'] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.btn {
  border-radius: 0.5rem;
  font-size: 0.9rem;
  padding: 0.55rem 1.25rem;
  cursor: pointer;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.btn-primary {
  background-color: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline {
  background-color: #fff;
  color: #111827;
  border-color: #d1d5db;
}

.btn-outline:hover {
  background-color: #f3f4f6;
}

.error-text {
  margin-top: 0.75rem;
  color: #b91c1c;
  font-size: 0.9rem;
}

.preview-panel {
  background: #fff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.preview-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend {
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
}

.legend.create {
  background-color: #ecfdf5;
  border-color: #6ee7b7;
  color: #166534;
}

.legend.update {
  background-color: #eff6ff;
  border-color: #93c5fd;
  color: #1d4ed8;
}

.table-wrapper {
  overflow-x: auto;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.preview-table th,
.preview-table td {
  padding: 0.5rem 0.6rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
}

.preview-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.row-create {
  background-color: #f9fdfb;
}

.row-update {
  background-color: #f8fbff;
}

.badge {
  display: inline-flex;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.create {
  background-color: #dcfce7;
  color: #166534;
}

.badge.update {
  background-color: #dbeafe;
  color: #1d4ed8;
}

@media (max-width: 768px) {
  .bulk-import {
    padding: 1rem;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>

