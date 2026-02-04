<template>
  <div class="default-layout">
    <!-- Main header (white) -->
    <header class="site-header">
      <div class="container header-inner">
        <RouterLink to="/" class="logo">FURNITURE STORE</RouterLink>
        <nav class="nav-menu">
          <RouterLink to="/">Trang chủ</RouterLink>
          <RouterLink to="/category/sofa-couches">Sofa</RouterLink>
          <RouterLink to="/category/tables">Bàn</RouterLink>
          <RouterLink to="/category/chairs">Ghế</RouterLink>
          <RouterLink to="/contact">Liên hệ</RouterLink>
        </nav>
        <div class="header-actions">
          <div class="search-wrap">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm sản phẩm..."
              class="search-input"
              @keyup.enter="onSearch"
            />
            <button type="button" class="search-btn" aria-label="Tìm kiếm" @click="onSearch">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </div>
          <RouterLink to="/wishlist" class="icon-link" aria-label="Yêu thích">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span v-if="wishlistCount" class="badge">{{ wishlistCount }}</span>
          </RouterLink>
          <RouterLink to="/cart" class="icon-link" aria-label="Giỏ hàng">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span v-if="cartCount" class="badge badge-red">{{ cartCount }}</span>
          </RouterLink>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <!-- Footer: category columns + contact row + bottom -->
    <footer class="site-footer">
      <div class="footer-cols">
        <div class="container footer-cols-inner">
          <div class="footer-col">
            <h4>Sofa & Ghế</h4>
            <ul>
              <li><RouterLink to="/category/sofa-couches">Sofa</RouterLink></li>
              <li><RouterLink to="/category/living-room-sofas">Sofa phòng khách</RouterLink></li>
              <li><RouterLink to="/category/sectional-sofas">Sofa góc</RouterLink></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Bàn</h4>
            <ul>
              <li><RouterLink to="/category/tables">Bàn</RouterLink></li>
              <li><RouterLink to="/category/dining-tables">Bàn ăn</RouterLink></li>
              <li><RouterLink to="/category/coffee-tables">Bàn trà</RouterLink></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Ghế</h4>
            <ul>
              <li><RouterLink to="/category/chairs">Ghế</RouterLink></li>
              <li><RouterLink to="/category/dining-chairs">Ghế ăn</RouterLink></li>
              <li><RouterLink to="/category/office-chairs">Ghế văn phòng</RouterLink></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Thông tin</h4>
            <ul>
              <li><RouterLink to="/contact">Liên hệ</RouterLink></li>
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Giao hàng</a></li>
              <li><a href="#">Đổi trả</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-mid">
        <div class="container footer-mid-inner">
          <RouterLink to="/" class="footer-logo">FURNITURE STORE</RouterLink>
          <div class="footer-contact">
            <p class="footer-phone">(024) 1234 5678</p>
            <p class="footer-hours">Thứ 2 - Thứ 6: 8:00 - 21:00 / Thứ 7: 9:00 - 18:00</p>
          </div>
          <div class="footer-payments">
            <span class="payment-label">Thanh toán:</span>
            <span class="payment-icons">Visa · Mastercard · COD</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p>© Furniture Store. Bảo lưu mọi quyền.</p>
          <div class="footer-legal">
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <RouterLink to="/contact">Liên hệ</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const searchQuery = ref('')

const cartCount = computed(() => cartStore.totalItems)
const wishlistCount = computed(() => wishlistStore.items.length)

function onSearch() {
  const q = searchQuery.value?.trim()
  if (q) router.push({ path: '/', query: { search: q } })
}
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Top bar */
.header-top-bar {
  background: #1a1a1a;
  color: #fff;
  padding: 0.4rem 0;
}
.header-top-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.top-nav {
  display: flex;
  gap: 1.5rem;
}
.top-nav a {
  color: #ccc;
  font-size: 0.8rem;
}
.top-nav a:hover,
.top-nav a.router-link-active {
  color: #fff;
}
.top-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.top-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  padding: 0.25rem;
}
.top-icon:hover {
  color: #fff;
}
.top-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 14px;
  height: 14px;
  font-size: 0.65rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main header */
.site-header {
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem 0;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
.logo {
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: 0.05em;
  color: #1a1a1a;
}
.nav-menu {
  display: flex;
  gap: 2rem;
}
.nav-menu a {
  font-weight: 500;
  font-size: 0.95rem;
  color: #1a1a1a;
}
.nav-menu a.router-link-active {
  color: var(--color-primary);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.search-wrap {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-bg-alt);
}
.search-input {
  width: 220px;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
}
.search-input::placeholder {
  color: var(--color-text-muted);
}
.search-btn {
  padding: 0.5rem 0.75rem;
  color: var(--color-text-muted);
}
.search-btn:hover {
  color: var(--color-primary);
}
.icon-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
}
.icon-link:hover {
  color: var(--color-primary);
}
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  background: #1a1a1a;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.badge-red {
  background: var(--color-primary);
}

main {
  flex: 1;
}

/* Footer */
.site-footer {
  background: #1a1a1a;
  color: #ccc;
  margin-top: auto;
}
.footer-cols {
  padding: 2.5rem 0 1.5rem;
}
.footer-cols-inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}
.footer-col h4 {
  color: #fff;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-weight: 600;
}
.footer-col ul {
  list-style: none;
}
.footer-col li {
  margin-bottom: 0.4rem;
}
.footer-col a {
  color: #aaa;
  font-size: 0.85rem;
}
.footer-col a:hover {
  color: #fff;
}
.footer-mid {
  border-top: 1px solid #333;
  padding: 1.25rem 0;
}
.footer-mid-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.footer-logo {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  color: #fff;
}
.footer-contact {
  text-align: center;
}
.footer-phone {
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.2rem 0;
}
.footer-hours {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
}
.footer-payments {
  font-size: 0.85rem;
  color: #888;
}
.payment-label {
  margin-right: 0.5rem;
}
.footer-bottom {
  border-top: 1px solid #333;
  padding: 0.75rem 0;
}
.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.footer-bottom-inner p {
  margin: 0;
  font-size: 0.8rem;
  color: #888;
}
.footer-legal {
  display: flex;
  gap: 1rem;
}
.footer-legal a {
  font-size: 0.8rem;
  color: #888;
}
.footer-legal a:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .header-inner {
    flex-direction: column;
  }
  .nav-menu {
    justify-content: center;
  }
  .search-wrap {
    width: 100%;
  }
  .search-input {
    width: 100%;
  }
  .footer-cols-inner {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-mid-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
