<template>
  <div class="product-form">
    <h1>{{ isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="categoryId">Danh mục *</label>
        <select id="categoryId" v-model.number="form.categoryId" required>
          <option value="0">Chọn danh mục</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="name">Tên *</label>
        <input id="name" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label for="sku">SKU *</label>
        <input id="sku" v-model="form.sku" required />
      </div>
      <div class="form-group">
        <label for="slug">Slug (để trống sẽ tự tạo)</label>
        <input id="slug" v-model="form.slug" />
      </div>
      <div class="form-group">
        <label for="shortDescription">Mô tả ngắn</label>
        <textarea id="shortDescription" v-model="form.shortDescription" rows="2"></textarea>
      </div>
      <div class="form-group">
        <label for="description">Mô tả đầy đủ</label>
        <textarea id="description" v-model="form.description" rows="4"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="price">Giá *</label>
          <input id="price" v-model.number="form.price" type="number" min="0" step="0.01" required />
        </div>
        <div class="form-group">
          <label for="salePrice">Giá khuyến mãi</label>
          <input id="salePrice" v-model.number="form.salePrice" type="number" min="0" step="0.01" />
        </div>
      </div>
      <div class="form-group">
        <label for="thumbnail">Ảnh đại diện (URL)</label>
        <input id="thumbnail" v-model="form.thumbnail" type="url" />
      </div>
      <div class="form-group">
        <label for="images">Ảnh sản phẩm (mỗi URL một dòng)</label>
        <textarea id="images" v-model="imagesText" rows="3" placeholder="https://..."></textarea>
        <small>Ảnh đầu tiên sẽ là ảnh chính</small>
      </div>
      <div class="form-group">
        <label for="status">Trạng thái</label>
        <select id="status" v-model="form.status">
          <option value="available">available</option>
          <option value="hidden">hidden</option>
          <option value="discontinued">discontinued</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="material">Chất liệu</label>
          <input id="material" v-model="form.material" />
        </div>
        <div class="form-group">
          <label for="dimensions">Kích thước</label>
          <input id="dimensions" v-model="form.dimensions" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="color">Màu sắc</label>
          <input id="color" v-model="form.color" />
        </div>
        <div class="form-group">
          <label for="warranty">Bảo hành</label>
          <input id="warranty" v-model="form.warranty" />
        </div>
      </div>
      <div class="form-group">
        <label>
          <input v-model="form.isActive" type="checkbox" />
          Kích hoạt
        </label>
      </div>
      <div class="form-group">
        <label>
          <input v-model="form.isFeatured" type="checkbox" />
          Sản phẩm nổi bật
        </label>
      </div>
      <div class="form-group">
        <label>
          <input v-model="form.isHot" type="checkbox" />
          Sản phẩm hot
        </label>
      </div>
      <div class="form-group">
        <label for="seoTitle">SEO Title</label>
        <input id="seoTitle" v-model="form.seoTitle" />
      </div>
      <div class="form-group">
        <label for="seoDescription">SEO Description</label>
        <textarea id="seoDescription" v-model="form.seoDescription" rows="2"></textarea>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <RouterLink to="/admin/products" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import apiClient from '@/services/api.client'

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
  isActive: true,
  isFeatured: false,
  isHot: false,
  seoTitle: '',
  seoDescription: '',
})

const imagesText = ref('')
const saving = ref(false)
const error = ref('')

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

  return {
    categoryId: form.categoryId,
    name: form.name,
    sku: form.sku,
    slug: form.slug || undefined,
    shortDescription: form.shortDescription || undefined,
    description: form.description || undefined,
    price: form.price,
    salePrice: form.salePrice || undefined,
    thumbnail: form.thumbnail || undefined,
    status: form.status,
    material: form.material || undefined,
    dimensions: form.dimensions || undefined,
    color: form.color || undefined,
    warranty: form.warranty || undefined,
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    isHot: form.isHot,
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
      form.isActive = product.isActive ?? true
      form.isFeatured = product.isFeatured ?? false
      form.isHot = product.isHot ?? false
      form.seoTitle = product.seoTitle || ''
      form.seoDescription = product.seoDescription || ''
      imagesText.value = (product.images ?? []).join('\n')
    } catch (e) {
      console.error(e)
    }
  }
})

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
</script>

<style scoped>
.product-form h1 {
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
.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  max-width: 500px;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
}
.form-group small {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #666;
}
.form-row {
  display: flex;
  gap: 1rem;
}
.form-row .form-group {
  flex: 1;
  max-width: 250px;
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
