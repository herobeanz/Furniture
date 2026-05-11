<template>
  <div class="collection-form">
    <h1>{{ isEdit ? 'Sửa bộ sưu tập' : 'Thêm bộ sưu tập' }}</h1>
    <form @submit.prevent="save" class="form-container">
      <FormField label="Tên bộ sưu tập" :required="true">
        <UiInput v-model="form.name" placeholder="Enter collection name" :required="true" />
      </FormField>

      <FormField label="Slug" :required="true" hint="URL-friendly name, ví dụ: bo-suu-tap-mua-he">
        <UiInput v-model="form.slug" placeholder="Enter slug" :required="true" />
      </FormField>

      <FormField label="Mô tả" optional>
        <UiTextarea v-model="form.description" :rows="3" placeholder="Enter description" />
      </FormField>

      <FormField label="Ảnh đại diện (URL)" optional>
        <UiInput v-model="form.thumbnail" type="url" placeholder="Enter image URL" />
      </FormField>

      <FormField label="Thứ tự hiển thị" optional>
        <UiInput v-model.number="form.orderIndex" type="number" min="0" placeholder="0" />
      </FormField>

      <FormField>
        <UiCheckbox v-model="form.isActive" label="Hiển thị" />
      </FormField>

      <FormField label="SEO Title" optional>
        <UiInput v-model="form.seoTitle" placeholder="Enter SEO title" />
      </FormField>

      <FormField label="SEO Description" optional>
        <UiTextarea v-model="form.seoDescription" :rows="2" placeholder="Enter SEO description" />
      </FormField>

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
          <div v-for="item in collectionProducts" :key="item.id" class="product-item">
            <div class="product-info">
              <RouterLink :to="getProductPath(item)" class="product-link" target="_blank">
                <img
                  v-if="item.thumbnail"
                  :src="item.thumbnail"
                  :alt="item.name"
                  class="product-thumb"
                />
                <div v-else class="product-thumb placeholder">📦</div>
              </RouterLink>
              <div class="product-details">
                <RouterLink :to="getProductPath(item)" class="product-name" target="_blank">
                  {{ item.name }}
                </RouterLink>
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
        <button type="button" class="btn btn-outline" @click="handlePreview" :disabled="!form.slug || !form.name">
          Xem trước
        </button>
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
import { logger } from '@/utils/logger'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import apiClient from '@/services/api/client'
import { formatPrice } from '@/utils/format'
import { savePreviewData } from '@/utils/preview'
import { getProductPath } from '@/utils/navigation'
import FormField from '@/components/ui/FormField.vue'
import { UiInput, UiTextarea, UiCheckbox } from '@/components/ui'

const route = useRoute()
const router = useRouter()
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
  slug: string
  price: number
  thumbnail?: string
  orderIndex: number
  breadcrumb?: { name: string; slug: string }[]
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
        slug: p.slug || '',
        price: p.price,
        thumbnail: p.thumbnail,
        orderIndex: p.orderIndex || 0,
        breadcrumb: p.breadcrumb || [],
      }))
    }
  } catch (e) {
    logger.error(e)
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
    logger.error(e)
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
    
    // Fetch full product details to get breadcrumb
    let breadcrumb: { name: string; slug: string }[] = []
    let productSlug = product.slug || ''
    
    try {
      const fullProduct = await apiClient.get(`/products/by-id/${product.id}`) as any
      productSlug = fullProduct.slug || productSlug
      // Build breadcrumb from product category if available
      if (fullProduct.categoryId) {
        const category = await apiClient.get(`/categories/by-id/${fullProduct.categoryId}`) as any
        if (category?.roomId) {
          const room = await apiClient.get(`/rooms/by-id/${category.roomId}`) as any
          if (room && category) {
            breadcrumb = [
              { name: room.name, slug: room.slug },
              { name: category.name, slug: category.slug },
            ]
          }
        }
      }
    } catch (e) {
      logger.warn('Could not fetch full product details for breadcrumb:', e)
    }
    
    collectionProducts.value.push({
      id: product.id,
      name: product.name,
      slug: productSlug,
      price: product.price,
      thumbnail: product.thumbnail,
      orderIndex: collectionProducts.value.length,
      breadcrumb,
    })
    showAddProductModal.value = false
    productSearch.value = ''
    searchResults.value = []
  } catch (e: any) {
    logger.error(e)
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
    logger.error(e)
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
    logger.error(e)
    // Don't show error for order updates, just log it
  }
}

async function handlePreview() {
  if (!form.slug || !form.name) {
    alert('Vui lòng nhập tên và slug để xem trước.')
    return
  }
  
  // Ensure all products have breadcrumb before preview
  const productsWithBreadcrumb = await Promise.all(
    collectionProducts.value.map(async (p) => {
      // If product already has breadcrumb with at least 2 items, use it
      if (p.breadcrumb && p.breadcrumb.length >= 2) {
        return p
      }
      
      // Otherwise, fetch full product details to get breadcrumb
      try {
        const fullProduct = await apiClient.get(`/products/by-id/${p.id}`) as any
        let breadcrumb: { name: string; slug: string }[] = []
        
        // Build breadcrumb from product category if available
        if (fullProduct.categoryId) {
          const category = await apiClient.get(`/categories/by-id/${fullProduct.categoryId}`) as any
          if (category?.roomId) {
            const room = await apiClient.get(`/rooms/by-id/${category.roomId}`) as any
            if (room && category && room.slug && category.slug) {
              breadcrumb = [
                { name: room.name, slug: room.slug },
                { name: category.name, slug: category.slug },
              ]
            }
          }
        }
        
        return {
          ...p,
          slug: fullProduct.slug || p.slug || '',
          breadcrumb,
        }
      } catch (e) {
        logger.warn(`Could not fetch breadcrumb for product ${p.id}:`, e)
        return p
      }
    })
  )
  
  // Create preview collection data
  const previewCollection = {
    collection: {
      id: id.value || 999999, // Temporary ID for preview
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description?.trim() || '',
      thumbnail: form.thumbnail?.trim() || '',
      orderIndex: form.orderIndex || 0,
      isActive: form.isActive,
      seoTitle: form.seoTitle?.trim() || '',
      seoDescription: form.seoDescription?.trim() || '',
    },
    products: productsWithBreadcrumb, // Include products with breadcrumb
  }
  
  // Save to localStorage
  savePreviewData('collection', form.slug, previewCollection)
  
  // Navigate to preview in same app
  router.push(`/bo-suu-tap/${form.slug}/preview`)
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
    logger.error(e)
    const errorMsg = e?.response?.data?.message || e?.message || 'Lưu thất bại.'
    alert(errorMsg)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.collection-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.collection-form h1 {
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

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
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
.product-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
.product-link:hover {
  opacity: 0.8;
}
.product-name {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #1a1a1a;
  text-decoration: none;
  display: block;
}
.product-name:hover {
  color: var(--color-primary);
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
