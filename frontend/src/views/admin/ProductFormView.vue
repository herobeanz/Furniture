<template>
  <div class="product-form">
    <h1>{{ isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="name">Tên *</label>
        <input id="name" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label for="slug">Slug (để trống sẽ tự tạo)</label>
        <input id="slug" v-model="form.slug" />
      </div>
      <div class="form-group">
        <label for="description">Mô tả</label>
        <textarea id="description" v-model="form.description" rows="4"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="price">Giá *</label>
          <input id="price" v-model.number="form.price" type="number" min="0" step="0.01" required />
        </div>
        <div class="form-group">
          <label for="comparePrice">Giá so sánh</label>
          <input id="comparePrice" v-model.number="form.comparePrice" type="number" min="0" step="0.01" />
        </div>
      </div>
      <div class="form-group">
        <label for="categoryId">Danh mục (ID)</label>
        <input id="categoryId" v-model="form.categoryId" />
      </div>
      <div class="form-group">
        <label for="images">Ảnh (mỗi URL một dòng)</label>
        <textarea id="images" v-model="imagesText" rows="3" placeholder="https://..."></textarea>
      </div>
      <div class="form-group">
        <label for="status">Trạng thái</label>
        <select id="status" v-model="form.status">
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="draft">draft</option>
        </select>
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
const id = computed(() => route.params.id as string)
const isEdit = computed(() => !!id.value && id.value !== 'new')

const form = reactive({
  name: '',
  slug: '',
  description: '',
  price: 0,
  comparePrice: undefined as number | undefined,
  categoryId: '',
  status: 'active',
})

const imagesText = ref('')
const saving = ref(false)
const error = ref('')

const formPayload = computed(() => ({
  name: form.name,
  slug: form.slug || undefined,
  description: form.description || undefined,
  price: form.price,
  comparePrice: form.comparePrice,
  categoryId: form.categoryId || undefined,
  images: imagesText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean),
  status: form.status,
}))

onMounted(async () => {
  if (isEdit.value) {
    try {
      const product = await apiClient.get(`/products/by-id/${id.value}`) as any
      form.name = product.name
      form.slug = product.slug
      form.description = product.description ?? ''
      form.price = product.price
      form.comparePrice = product.comparePrice
      form.categoryId = product.categoryId ?? ''
      form.status = product.status
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
    if (isEdit.value) {
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
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  max-width: 400px;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
}
.form-row {
  display: flex;
  gap: 1rem;
}
.form-row .form-group {
  flex: 1;
  max-width: 200px;
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
