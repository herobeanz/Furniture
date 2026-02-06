<template>
  <div class="collection-form">
    <div class="page-header">
      <h1>{{ isEdit ? 'Sửa bộ sưu tập' : 'Thêm bộ sưu tập' }}</h1>
      <RouterLink to="/admin/collections" class="btn btn-outline">Quay lại</RouterLink>
    </div>
    <form @submit.prevent="save" class="form">
      <div class="form-group">
        <label>Tên bộ sưu tập *</label>
        <input v-model="form.name" required />
      </div>
      <div class="form-group">
        <label>Slug *</label>
        <input v-model="form.slug" required />
        <small>URL-friendly name, ví dụ: bo-suu-tap-mua-he</small>
      </div>
      <div class="form-group">
        <label>Mô tả</label>
        <textarea v-model="form.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Ảnh đại diện (URL)</label>
        <input v-model="form.thumbnail" type="url" />
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input v-model.number="form.orderIndex" type="number" min="0" />
      </div>
      <div class="form-group">
        <label>
          <input v-model="form.isActive" type="checkbox" />
          Hiển thị
        </label>
      </div>
      <div class="form-group">
        <label>SEO Title</label>
        <input v-model="form.seoTitle" />
      </div>
      <div class="form-group">
        <label>SEO Description</label>
        <textarea v-model="form.seoDescription" rows="2"></textarea>
      </div>

      <!-- Products Management Section -->
      <div v-if="isEdit" class="products-section">
        <div class="section-header">
          <h2>Sản phẩm trong bộ sưu tập</h2>
          <button type="button" class="btn btn-sm btn-primary" @click="showAddProductModal = true">
            + Thêm sản phẩm
          </button>
        </div>

        <div v-if="loadingProducts" class="loading">Đang tải sản phẩm...</div>
        <div v-else-if="collectionProducts.length === 0" class="empty">
          <p>Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để thêm.</p>
        </div>
        <div v-else class="products-list">
          <div v-for="(item, index) in collectionProducts" :key="item.id" class="product-item">
            <div class="product-info">
              <img
                v-if="item.thumbnail"
                :src="item.thumbnail"
                :alt="item.name"
                class="product-thumb"
              />
              <div v-else class="product-thumb placeholder">📦</div>
              <div class="product-details">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-meta">{{ formatPrice(item.price) }}</div>
              </div>
            </div>
            <div class="product-actions">
              <input
                v-model.number="item.orderIndex"
                type="number"
                min="0"
                class="order-input"
                @change="updateProductOrder"
              />
              <button
                type="button"
                class="btn-remove"
                @click="removeProduct(item.id)"
                title="Xóa"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <RouterLink to="/admin/collections" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>

    <!-- Add Product Modal -->
    <div v-if="showAddProductModal" class="modal-overlay" @click="showAddProductModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Thêm sản phẩm</h3>
          <button type="button" class="btn-close" @click="showAddProductModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="search-box">
            <input
              v-model="productSearch"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              @input="searchProducts"
            />
          </div>
          <div v-if="loadingSearch" class="loading">Đang tìm...</div>
          <div v-else-if="searchResults.length === 0" class="empty">Không tìm thấy sản phẩm.</div>
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
                :src="product.thumbnail"
                :alt="product.name"
                class="result-thumb"
              />
              <div v-else class="result-thumb placeholder">📦</div>
              <div class="result-info">
                <div class="result-name">{{ product.name }}</div>
                <div class="result-price">{{ formatPrice(product.price) }}</div>
              </div>
              <span v-if="isProductInCollection(product.id)" class="badge">Đã thêm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import apiClient from '@/services/api.client'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const id = computed(() => route.params.id as string)
const isEdit = computed(() => !!id.value)
const saving = ref(false)
const loadingProducts = ref(false)
const showAddProductModal = ref(false)
const productSearch = ref('')
const loadingSearch = ref(false)
const searchResults = ref<any[]>([])

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

const collectionProducts = ref<Array<{
  id: number
  name: string
  price: number
  thumbnail?: string
  orderIndex: number
}>>([])

onMounted(async () => {
  if (isEdit.value) {
    await loadCollection()
  }
})

async function loadCollection() {
  try {
    const c = await apiClient.get(`/collections/by-id/${id.value}`) as any
    form.name = c.name || ''
    form.slug = c.slug || ''
    form.description = c.description || ''
    form.thumbnail = c.thumbnail || ''
    form.orderIndex = c.orderIndex || 0
    form.isActive = c.isActive ?? true
    form.seoTitle = c.seoTitle || ''
    form.seoDescription = c.seoDescription || ''
    
    if (c.products) {
      collectionProducts.value = c.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        thumbnail: p.thumbnail,
        orderIndex: p.orderIndex || 0,
      }))
    }
  } catch (e) {
    console.error(e)
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
    const res = await apiClient.get('/products/list/all') as any[]
    searchResults.value = res
      .filter((p: any) => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 20)
  } catch (e) {
    console.error(e)
    searchResults.value = []
  } finally {
    loadingSearch.value = false
  }
}

function isProductInCollection(productId: number): boolean {
  return collectionProducts.value.some((p) => p.id === productId)
}

async function addProduct(product: any) {
  if (isProductInCollection(product.id)) return
  
  if (!isEdit.value || !id.value) {
    alert('Vui lòng lưu bộ sưu tập trước khi thêm sản phẩm.')
    return
  }
  
  try {
    await apiClient.post(`/collections/${id.value}/products`, {
      productId: product.id,
    })
    collectionProducts.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      orderIndex: collectionProducts.value.length,
    })
    showAddProductModal.value = false
    productSearch.value = ''
    searchResults.value = []
  } catch (e: any) {
    console.error(e)
    alert(e?.response?.data?.message || 'Thêm sản phẩm thất bại.')
  }
}

async function removeProduct(productId: number) {
  if (!confirm('Xóa sản phẩm này khỏi bộ sưu tập?')) return
  
  if (!isEdit.value || !id.value) return
  
  try {
    await apiClient.delete(`/collections/${id.value}/products/${productId}`)
    collectionProducts.value = collectionProducts.value.filter((p) => p.id !== productId)
  } catch (e: any) {
    console.error(e)
    alert(e?.response?.data?.message || 'Xóa sản phẩm thất bại.')
  }
}

async function updateProductOrder() {
  if (!isEdit.value || !id.value) return
  
  try {
    await apiClient.patch(`/collections/${id.value}/products/order`, {
      products: collectionProducts.value.map((p) => ({
        productId: p.id,
        orderIndex: p.orderIndex,
      })),
    })
  } catch (e: any) {
    console.error(e)
    // Don't show error for order updates, just log it
  }
}

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await apiClient.patch(`/collections/${id.value}`, form)
    } else {
      const result = await apiClient.post('/collections', form) as any
      // Redirect to edit page to manage products
      window.location.href = `/admin/collections/${result.id}`
      return
    }
    // Redirect to list
    window.location.href = '/admin/collections'
  } catch (e: any) {
    console.error(e)
    const errorMsg = e?.response?.data?.message || e?.message || 'Lưu thất bại.'
    alert(errorMsg)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.page-header h1 {
  font-size: 1.5rem;
  margin: 0;
}
.form {
  max-width: 800px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}
.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
}
.form-group small {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #666;
}
.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
}

/* Products Section */
.products-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.section-header h2 {
  font-size: 1.1rem;
  margin: 0;
}
.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}
.products-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f8f8;
  border-radius: 6px;
  border: 1px solid #eee;
}
.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}
.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  background: #eee;
}
.product-thumb.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.product-details {
  flex: 1;
}
.product-name {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
.product-meta {
  font-size: 0.8rem;
  color: #666;
}
.product-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.order-input {
  width: 60px;
  padding: 0.4rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.85rem;
}
.btn-remove {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #c00;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-remove:hover {
  background: #fee;
  border-color: #c00;
}
.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
}
.btn-close {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}
.btn-close:hover {
  color: #000;
}
.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}
.search-box {
  margin-bottom: 1rem;
}
.search-box input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
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
  border: 1px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.search-result-item:hover:not(.disabled) {
  background: #f8f8f8;
  border-color: var(--color-primary);
}
.search-result-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.result-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  background: #eee;
}
.result-thumb.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.result-info {
  flex: 1;
}
.result-name {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
.result-price {
  font-size: 0.8rem;
  color: #666;
}
.badge {
  padding: 0.25rem 0.5rem;
  background: #0a0;
  color: #fff;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
