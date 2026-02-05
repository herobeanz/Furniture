<template>
  <div class="product-page">
    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/">Trang chủ</RouterLink>
        <template v-if="product?.breadcrumb">
          <template v-for="(item, i) in product.breadcrumb" :key="i">
            <span class="sep">/</span>
            <RouterLink :to="getBreadcrumbPath(item, i)">{{ item.name }}</RouterLink>
          </template>
        </template>
        <template v-else-if="product">
          <span class="sep">/</span>
          <span>{{ product.name }}</span>
        </template>
        <span v-else class="skeleton-text">...</span>
      </nav>

      <!-- Error -->
      <div v-if="error" class="error-msg">
        <p>{{ error }}</p>
        <RouterLink to="/" class="btn btn-primary">Về trang chủ</RouterLink>
      </div>

      <!-- Loading -->
      <div v-else-if="loading && !product" class="loading">Đang tải...</div>

      <!-- Product detail -->
      <template v-else-if="product">
        <section class="product-detail">
          <!-- Gallery -->
          <div class="product-gallery">
            <div class="gallery-main">
              <img
                v-if="currentImage"
                :src="currentImage"
                :alt="product.name"
              />
              <div v-else class="no-image">Ảnh sản phẩm</div>
            </div>
            <div v-if="product.images?.length > 1" class="gallery-thumbs">
              <button
                v-for="(img, i) in product.images"
                :key="i"
                type="button"
                class="thumb"
                :class="{ active: selectedIndex === i }"
                @click="selectedIndex = i"
              >
                <img :src="img" :alt="`${product.name} ${i + 1}`" />
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            <div class="product-prices">
              <span class="price-current">{{ formatPrice(product.price) }}</span>
              <span v-if="product.salePrice" class="price-old">
                {{ formatPrice(product.salePrice) }}
              </span>
              <span v-if="product.salePrice" class="sale-badge">Sale</span>
            </div>
            <p v-if="product.description" class="product-desc">
              {{ product.description }}
            </p>

            <!-- Add to cart -->
            <div class="add-to-cart-form">
              <div class="quantity-wrap">
                <label for="qty">Số lượng:</label>
                <input
                  id="qty"
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  max="99"
                  class="qty-input"
                />
              </div>
              <button
                type="button"
                class="btn btn-primary btn-add-cart"
                @click="addToCart"
              >
                Thêm vào giỏ hàng
              </button>
              <button
                type="button"
                class="btn btn-outline btn-wishlist"
                :class="{ active: inWishlist }"
                @click="toggleWishlist"
                title="Yêu thích"
              >
                ♥ Yêu thích
              </button>
            </div>
          </div>
        </section>

        <!-- Related products -->
        <section v-if="related.length > 0" class="related-section">
          <h2 class="section-title">Sản phẩm liên quan</h2>
          <ProductGrid
            :products="related"
            :columns="4"
            show-sale-tag
            @add-to-cart="addToCartRelated"
            @toggle-wishlist="toggleWishlistRelated"
          />
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductGrid from '@/components/ProductGrid.vue'
import { productService, type Product } from '@/services/product.service'
import { formatPrice } from '@/utils/format'
import { useCart } from '@/composables/useCart'
import { useToast } from '@/composables/useToast'
import { useWishlistStore } from '@/stores/wishlist'

const route = useRoute()
const roomSlug = computed(() => (route.params.roomSlug as string) ?? '')
const categorySlug = computed(() => (route.params.categorySlug as string) ?? '')
const productSlug = computed(() => (route.params.productSlug as string) ?? '')

const product = ref<Product | null>(null)
const related = ref<Product[]>([])
const loading = ref(false)
const error = ref('')
const selectedIndex = ref(0)
const quantity = ref(1)

const { addItem } = useCart()
const wishlistStore = useWishlistStore()
const { toast } = useToast()

const currentImage = computed(() => {
  const p = product.value
  if (!p?.images?.length) return p?.thumbnail || ''
  const i = Math.min(selectedIndex.value, p.images.length - 1)
  return p.images[i]
})

const inWishlist = computed(() =>
  product.value ? wishlistStore.isInWishlist(product.value.id) : false
)

function getBreadcrumbPath(item: { name: string; slug: string }, index: number): string {
  if (product.value?.breadcrumb) {
    // Build path from breadcrumb
    const path = product.value.breadcrumb.slice(0, index + 1).map(b => b.slug).join('/')
    return `/${path}`
  }
  return '#'
}

function addToCart() {
  if (!product.value) return
  addItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    quantity: quantity.value,
    image: product.value.images?.[0] || product.value.thumbnail,
    slug: product.value.slug,
  })
  toast.success('Đã thêm vào giỏ', `${product.value.name} x${quantity.value}`)
}

function toggleWishlist() {
  if (!product.value) return
  wishlistStore.toggleItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.images?.[0] || product.value.thumbnail,
    slug: product.value.slug,
  })
}

function addToCartRelated(p: Product) {
  addItem({
    id: p.id,
    name: p.name,
    price: p.price,
    quantity: 1,
    image: p.images?.[0],
    slug: p.slug,
  })
  toast.success('Đã thêm vào giỏ', p.name)
}

function toggleWishlistRelated(p: Product) {
  wishlistStore.toggleItem({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images?.[0],
    slug: p.slug,
  })
}

async function fetchProduct() {
  if (!productSlug.value) return
  loading.value = true
  error.value = ''
  product.value = null
  related.value = []
  selectedIndex.value = 0
  quantity.value = 1
  try {
    const [p, rel] = await Promise.all([
      productService.getProduct(productSlug.value),
      productService.getRelatedProducts(productSlug.value, 4),
    ])
    product.value = p
    related.value = Array.isArray(rel) ? rel : []
  } catch (e: any) {
    error.value =
      e?.response?.data?.message || e?.message || 'Không tìm thấy sản phẩm.'
  } finally {
    loading.value = false
  }
}

watch(productSlug, fetchProduct, { immediate: true })
</script>

<style scoped>
.product-page {
  padding: 1.5rem 0 3rem;
}
.breadcrumb {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}
.breadcrumb .sep {
  margin: 0 0.5rem;
}
.breadcrumb a:hover {
  color: var(--color-primary);
}
.skeleton-text {
  opacity: 0.7;
}
.error-msg {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.error-msg .btn {
  margin-top: 1rem;
}
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: start;
}
@media (max-width: 900px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
.product-gallery {
  position: sticky;
  top: calc(var(--header-height, 60px) + 1rem);
}
.gallery-main {
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gallery-main .no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.thumb {
  width: 64px;
  height: 64px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background: var(--color-bg-alt);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb.active,
.thumb:hover {
  border-color: var(--color-primary);
}
.product-info {
  min-width: 0;
}
.product-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}
.product-prices {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.price-current {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}
.price-old {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}
.sale-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 4px;
}
.product-desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
}
.add-to-cart-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
.quantity-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.quantity-wrap label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.qty-input {
  width: 4rem;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
}
.btn-add-cart {
  padding: 0.75rem 1.5rem;
}
.btn-wishlist.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.related-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>
