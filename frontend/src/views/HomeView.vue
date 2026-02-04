<template>
  <div class="landing">
    <!-- Hero 2x2 Category Grid -->
    <section class="hero-grid">
      <RouterLink
        v-for="(item, i) in heroCategories"
        :key="item.id"
        :to="'/category/' + item.slug"
        class="hero-tile"
        :class="'hero-tile-' + (i + 1)"
      >
        <div class="hero-tile-bg" :style="tileBg(item, i)"></div>
        <span class="hero-tile-btn">{{ item.name }}</span>
      </RouterLink>
    </section>

    <!-- Value props - 4 items -->
    <section class="value-section">
      <div class="container value-grid">
        <div class="value-item">
          <span class="value-icon">₫</span>
          <h3>Giá tốt mỗi ngày</h3>
          <p>Mức giá phù hợp với túi tiền của bạn</p>
        </div>
        <div class="value-item">
          <span class="value-icon">🚚</span>
          <h3>Giao hàng từ 2 triệu</h3>
          <p>Giao nhanh trong 1–2 ngày</p>
        </div>
        <div class="value-item">
          <span class="value-icon">🎧</span>
          <h3>Hỗ trợ 24/7</h3>
          <p>Đội ngũ tư vấn sẵn sàng phục vụ</p>
        </div>
        <div class="value-item">
          <span class="value-icon">✓</span>
          <h3>Đa dạng sản phẩm</h3>
          <p>Nội thất đủ phong cách, một điểm đến</p>
        </div>
      </div>
    </section>

    <!-- Daily Flash Sale -->
    <section class="flash-section">
      <div class="container">
        <h2 class="flash-title">Daily Flash Sale!</h2>
        <div class="flash-countdown" v-if="countdownText">{{ countdownText }}</div>
        <div v-if="loading" class="loading">Đang tải...</div>
        <div v-else-if="flashProducts.length === 0" class="empty">Chưa có sản phẩm.</div>
        <div v-else class="product-grid four-cols">
          <article v-for="p in flashProducts" :key="p.id" class="product-card flash-card">
            <RouterLink :to="'/product/' + p.slug" class="product-image-wrap">
              <img v-if="p.images?.length" :src="p.images[0]" :alt="p.name" />
              <div v-else class="no-image">Ảnh</div>
              <span class="flash-countdown-tag" v-if="countdownText">{{ countdownText }}</span>
              <span v-if="p.comparePrice" class="product-sale-tag">Sale</span>
            </RouterLink>
            <div class="product-info">
              <RouterLink :to="'/product/' + p.slug" class="product-name">{{ p.name }}</RouterLink>
              <div class="product-prices">
                <span v-if="p.comparePrice" class="price-old">{{ formatPrice(p.comparePrice) }}</span>
                <span class="price-current">{{ formatPrice(p.price) }}</span>
              </div>
              <div class="product-actions">
                <button type="button" class="action-btn add-cart" @click="addToCart(p)">+ Thêm vào giỏ</button>
                <button type="button" class="action-btn icon-only" :class="{ active: wishlistStore.isInWishlist(p.id) }" @click="toggleWishlist(p)" title="Yêu thích">♥</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Promo 2x2 Banners -->
    <section class="promo-section">
      <div class="container promo-2x2">
        <RouterLink v-for="item in promoBanners" :key="item.slug" :to="'/category/' + item.slug" class="promo-banner">
          <div class="promo-banner-bg" :style="promoBg()"></div>
          <span class="promo-banner-text">{{ item.name }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Shop By Department -->
    <section class="dept-section">
      <div class="container">
        <h2 class="section-title">Mua theo danh mục</h2>
        <div class="dept-tiles">
          <RouterLink v-for="c in allDeptCategories" :key="c.id" :to="'/category/' + c.slug" class="dept-tile">
            <div class="dept-tile-img" :style="tileBg(c, 0)"></div>
            <span>{{ c.name }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Big Sale Banner -->
    <section class="sale-banner">
      <div class="container">
        <p class="sale-banner-text">GIẢM SỐC TOÀN BỘ SẢN PHẨM LÊN ĐẾN 50%</p>
      </div>
    </section>

    <!-- Popular Picks -->
    <section class="popular-section">
      <div class="container">
        <h2 class="section-title">Gợi ý tại Furniture Store</h2>
        <div class="tabs">
          <button
            v-for="cat in rootCategories"
            :key="cat.id"
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === cat.slug }"
            @click="activeTab = cat.slug"
          >
            {{ cat.name }}
          </button>
        </div>
        <div v-if="tabProductsLoading" class="loading">Đang tải...</div>
        <div v-else-if="tabProducts.length" class="product-grid four-cols">
          <article v-for="(p, idx) in tabProducts" :key="p.id" class="product-card">
            <RouterLink :to="'/product/' + p.slug" class="product-image-wrap">
              <img v-if="p.images?.length" :src="p.images[0]" :alt="p.name" />
              <div v-else class="no-image">Ảnh</div>
              <span v-if="idx < 2" class="product-hot-tag">HOT</span>
            </RouterLink>
            <div class="product-info">
              <RouterLink :to="'/product/' + p.slug" class="product-name">{{ p.name }}</RouterLink>
              <p class="product-prices">
                <span class="price-current">{{ formatPrice(p.price) }}</span>
              </p>
              <button type="button" class="action-btn add-cart" @click="addToCart(p)">+ Thêm vào giỏ</button>
              <button type="button" class="action-btn icon-only" :class="{ active: wishlistStore.isInWishlist(p.id) }" @click="toggleWishlist(p)">♥</button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Latest Reviews -->
    <section class="reviews-section">
      <div class="container">
        <h2 class="section-title">Đánh giá gần đây</h2>
        <div class="reviews-grid">
          <div v-for="r in mockReviews" :key="r.name" class="review-card">
            <p class="review-text">"{{ r.text }}"</p>
            <p class="review-author">{{ r.name }}</p>
            <div class="review-stars">★★★★★</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog (mock) -->
    <section class="blog-section">
      <div class="container">
        <h2 class="section-title">Bài viết nổi bật</h2>
        <div class="blog-grid">
          <article v-for="b in mockBlogs" :key="b.title" class="blog-card">
            <div class="blog-image" :style="{ background: 'linear-gradient(135deg,#e8e8e8,#f5f5f5)' }"></div>
            <span class="blog-cat">{{ b.cat }}</span>
            <h3 class="blog-title">{{ b.title }}</h3>
            <p class="blog-meta">{{ b.meta }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div class="container newsletter-inner">
        <h2 class="newsletter-title">Đăng ký nhận tin</h2>
        <p>Tham gia nhận cập nhật khuyến mãi và mã giảm giá.</p>
        <form class="newsletter-form" @submit.prevent="submitNewsletter">
          <input v-model="newsletterEmail" type="email" placeholder="Email của bạn..." required />
          <button type="submit" class="btn btn-primary">Gửi</button>
        </form>
        <div class="newsletter-social">
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="Zalo">Zalo</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { categoryService, type Category } from '../services/category.service'
import { productService, type Product } from '../services/product.service'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const tabProducts = ref<Product[]>([])
const tabProductsLoading = ref(false)
const activeTab = ref('')
const newsletterEmail = ref('')

const rootCategories = computed(() => categories.value.filter((c) => !c.parentId))

const heroCategories = computed(() => {
  const roots = rootCategories.value
  if (roots.length >= 4) return roots.slice(0, 4)
  const children = categories.value.filter((c) => c.parentId === roots[0]?.id)
  return [...roots, ...children].slice(0, 4)
})

const allDeptCategories = computed(() => {
  const roots = rootCategories.value
  const result: Category[] = []
  roots.forEach((r) => {
    result.push(r)
    result.push(...categories.value.filter((c) => c.parentId === r.id))
  })
  return result
})

const promoBanners = computed(() => {
  const r = rootCategories.value
  if (r.length >= 4) return r.slice(0, 4)
  const extra = categories.value.find((c) => c.parentId === r[0]?.id)
  return extra ? [...r, extra] : r
})

const flashProducts = computed(() => products.value.slice(0, 4))

const countdownText = ref('')
function updateCountdown() {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const ms = end.getTime() - Date.now()
  if (ms <= 0) {
    countdownText.value = 'Hết hạn'
    return
  }
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  countdownText.value = `${h}h : ${m}m : ${s}s`
}
let countdownTimer: ReturnType<typeof setInterval> | null = null

const mockReviews = [
  { text: 'Phục vụ rất nhiệt tình, sản phẩm đúng mô tả. Tôi rất hài lòng.', name: 'Khách hàng A' },
  { text: 'Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ lâu dài.', name: 'Khách hàng B' },
  { text: 'Chất lượng tốt, giá hợp lý. Recommend cho mọi người.', name: 'Khách hàng C' },
]

const mockBlogs = [
  { cat: 'PHÒNG KHÁCH', title: 'Gợi ý chọn sofa phù hợp không gian', meta: 'Furniture Store | 2024' },
  { cat: 'BÀN GHẾ', title: 'Xu hướng nội thất gỗ 2024', meta: 'Furniture Store | 2024' },
  { cat: 'TIPS', title: 'Bảo quản nội thất bền đẹp', meta: 'Furniture Store | 2024' },
]

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function tileBg(cat: Category, _i: number) {
  const firstProduct = products.value.find((p) => p.categoryId === cat.id)
  const img = firstProduct?.images?.[0]
  if (img) return { backgroundImage: `url(${img})` }
  return { background: 'linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%)' }
}

function promoBg() {
  return { background: 'linear-gradient(135deg, #f0f0f0 0%, #e5e5e5 100%)' }
}

function addToCart(p: Product) {
  cartStore.addItem({
    id: p.id,
    name: p.name,
    price: p.price,
    quantity: 1,
    image: p.images?.[0],
    slug: p.slug,
  })
}

function toggleWishlist(p: Product) {
  wishlistStore.toggleItem({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images?.[0],
    slug: p.slug,
  })
}

function submitNewsletter() {
  alert('Cảm ơn bạn đã đăng ký: ' + newsletterEmail.value)
  newsletterEmail.value = ''
}

async function loadTabProducts() {
  if (!activeTab.value) return
  tabProductsLoading.value = true
  try {
    const res = await categoryService.getCategoryProducts(activeTab.value, { limit: 8 })
    tabProducts.value = res.data || []
  } catch {
    tabProducts.value = []
  } finally {
    tabProductsLoading.value = false
  }
}

onMounted(async () => {
  try {
    const [cats, res] = await Promise.all([
      categoryService.getCategories(),
      productService.getProducts({ limit: 12 }),
    ])
    categories.value = cats
    products.value = res.data || []
    if (rootCategories.value.length && !activeTab.value) activeTab.value = rootCategories.value[0]?.slug ?? ''
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
})

watch(activeTab, () => {
  loadTabProducts()
})

watch(
  () => rootCategories.value.length,
  (len) => {
    if (len && !activeTab.value) activeTab.value = rootCategories.value[0]?.slug ?? ''
  }
)

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<style scoped>
.landing {
  padding-bottom: 0;
}

/* Hero 2x2 */
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
  min-height: 70vh;
}
.hero-tile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-decoration: none;
  color: #1a1a1a;
}
.hero-tile-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.85);
}
.hero-tile:hover .hero-tile-bg {
  filter: brightness(0.9);
}
.hero-tile-btn {
  position: relative;
  z-index: 1;
  padding: 0.75rem 2rem;
  background: #fff;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}
.hero-tile:hover .hero-tile-btn {
  transform: scale(1.05);
}

/* Value */
.value-section {
  padding: 2rem 0;
  background: #fff;
}
.value-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.value-item {
  text-align: center;
  padding: 1rem;
}
.value-icon {
  font-size: 1.75rem;
  display: block;
  margin-bottom: 0.5rem;
}
.value-item h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}
.value-item p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* Flash Sale */
.flash-section {
  padding: 2.5rem 0;
  background: var(--color-bg-alt);
}
.flash-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.flash-countdown {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.four-cols {
  grid-template-columns: repeat(4, 1fr);
}
.flash-card .flash-countdown-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  background: rgba(204, 0, 0, 0.9);
  color: #fff;
  font-size: 0.7rem;
  padding: 0.25rem;
  text-align: center;
  border-radius: 4px;
}
.product-grid {
  display: grid;
  gap: 1.25rem;
}
.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
.product-image-wrap {
  position: relative;
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  overflow: hidden;
  display: block;
}
.product-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.875rem;
}
.product-sale-tag,
.product-hot-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
.product-info {
  padding: 1rem;
}
.product-name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}
.product-name:hover {
  color: var(--color-primary);
}
.product-prices {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}
.price-current {
  font-weight: 700;
  color: var(--color-primary);
}
.price-old {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
}
.product-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.action-btn {
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.action-btn.add-cart {
  flex: 1;
}
.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.action-btn.icon-only {
  width: 32px;
  padding: 0.4rem;
}
.action-btn.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

/* Promo 2x2 */
.promo-section {
  padding: 2rem 0;
}
.promo-2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.promo-banner {
  position: relative;
  aspect-ratio: 1.2;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1.5rem;
  text-decoration: none;
  color: #1a1a1a;
}
.promo-banner-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}
.promo-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(255,255,255,0.9), transparent);
}
.promo-banner-text {
  position: relative;
  z-index: 1;
  font-weight: 700;
  font-size: 1rem;
}

/* Dept */
.dept-section {
  padding: 2rem 0;
  background: #fff;
}
.section-title {
  font-size: 1.35rem;
  margin-bottom: 1.25rem;
  text-align: center;
}
.dept-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}
.dept-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: #1a1a1a;
  font-size: 0.85rem;
  font-weight: 500;
}
.dept-tile-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-bg-alt);
  margin-bottom: 0.5rem;
  background-size: cover;
  background-position: center;
}

/* Sale banner */
.sale-banner {
  background: var(--color-primary);
  color: #fff;
  padding: 1rem;
  text-align: center;
}
.sale-banner-text {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  margin: 0;
}

/* Popular */
.popular-section {
  padding: 2.5rem 0;
  background: var(--color-bg-alt);
}
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}
.tab-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  background: #fff;
  border: 1px solid var(--color-border);
  cursor: pointer;
}
.tab-btn:hover,
.tab-btn.active {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

/* Reviews */
.reviews-section {
  padding: 2rem 0;
  background: #fff;
}
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.review-card {
  padding: 1.5rem;
  background: var(--color-bg-alt);
  border-radius: 8px;
  text-align: center;
}
.review-text {
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  color: #333;
  font-style: italic;
}
.review-author {
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.35rem;
}
.review-stars {
  color: #f90;
  font-size: 0.9rem;
}

/* Blog */
.blog-section {
  padding: 2rem 0;
  background: var(--color-bg-alt);
}
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.blog-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.blog-image {
  aspect-ratio: 16/10;
  background-size: cover;
  background-position: center;
}
.blog-cat {
  display: inline-block;
  margin: 0.75rem 1rem 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-primary);
}
.blog-title {
  font-size: 1rem;
  margin: 0.35rem 1rem 0;
  padding-bottom: 0.5rem;
}
.blog-meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0 1rem 1rem;
}

/* Newsletter */
.newsletter {
  padding: 2.5rem 0;
  background: #1a1a1a;
  color: #fff;
}
.newsletter-inner {
  text-align: center;
  max-width: 520px;
  margin: 0 auto;
}
.newsletter-title {
  font-size: 1.35rem;
  margin-bottom: 0.5rem;
}
.newsletter-inner > p {
  color: #aaa;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
}
.newsletter-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.newsletter-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: none;
}
.newsletter-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.newsletter-social a {
  color: #aaa;
  font-size: 0.9rem;
}
.newsletter-social a:hover {
  color: #fff;
}

@media (max-width: 1024px) {
  .value-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .four-cols {
    grid-template-columns: repeat(2, 1fr);
  }
  .reviews-grid {
    grid-template-columns: 1fr;
  }
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .hero-grid {
    min-height: 50vh;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
  .value-grid {
    grid-template-columns: 1fr;
  }
  .promo-2x2 {
    grid-template-columns: 1fr;
  }
  .four-cols {
    grid-template-columns: 1fr;
  }
}
</style>
